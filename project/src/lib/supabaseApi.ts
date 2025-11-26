import { supabase } from "./supabaseClient";
import { getAllPosts, saveAllPosts, type Post } from "./postStore";
import { setSessionUser } from "./auth";

/*
  Supabase helpers mapped to your schema:
  - posts: id (uuid), content (text), file_url (text), user_id (uuid), created_at (timestamptz)
  - profiles: id (uuid), username (text), career, bio, term, created_at
  - comments: id, content, user_id, post_id, created_at

  These helpers fallback to localStorage when Supabase is not configured or on errors.
*/

export async function fetchPosts(): Promise<Post[]> {
  if (!supabase) return getAllPosts();

  try {
    // select posts and the related profile (profiles must be set as a foreign relation in Supabase)
    const { data, error } = await (supabase as any)
      .from('posts')
      .select('id, content, file_url, created_at, user_id, liked_by, tag, profiles(id, username, career, bio, term, avatar, created_at)')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetchPosts error:', error);
      return getAllPosts();
    }

    // Fetch comments for all posts in parallel
    const postsWithComments = await Promise.all(
      (data as any[]).map(async (r) => {
        const files = r.file_url ? [{ id: `f_${r.id}`, url: r.file_url, type: r.file_url?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'img', label: String(r.file_url).split('/').pop() }] : [];
        const profile = r.profiles || null;
        
        // Build user object with all profile info (career, term)
        // Avatar comes from the profiles table
        const user = profile ? { 
          id: profile.id, 
          name: profile.username,
          major: profile.career,
          semester: profile.term,
          avatar: profile.avatar || '/src/Assets/defaultuser.png', // use DB avatar or fallback
        } : undefined;

        // Fetch comments for this post
        let commentsList: any[] = [];
        try {
          commentsList = await fetchComments(String(r.id));
        } catch (e) {
          console.warn('Failed to fetch comments for post', r.id, e);
        }

        return {
          id: String(r.id),
          content: r.content || '',
          createdAt: r.created_at || new Date().toISOString(),
          user,
          files,
          likes: (r.liked_by || []).length,
          likedBy: r.liked_by || [],
          comments: commentsList.length,
          commentsList: commentsList,
          tag: r.tag || 'General',
        } as Post;
      })
    );

    try { saveAllPosts(postsWithComments); } catch (e) { void e; }
    return postsWithComments;
  } catch (err) {
    console.warn('fetchPosts failed', err);
    return getAllPosts();
  }
}

export async function createPost(post: Post): Promise<Post | null> {
  if (!supabase) {
    try {
      const existing = getAllPosts();
      const updated = [post, ...existing];
      saveAllPosts(updated);
      return post;
    } catch (e) { void e; return null; }
  }

  try {
    const toInsert: any = {
      content: post.content,
      file_url: (post.files && post.files.length > 0) ? post.files[0].url : null,
      created_at: post.createdAt || new Date().toISOString(),
      tag: post.tag || 'General',
    };

    // Prefer attaching the authenticated session user id when available.
    if (post.user && (post.user as any).id) {
      toInsert.user_id = (post.user as any).id;
    } else {
      try {
        const sess = await (supabase as any).auth.getSession();
        const uid = sess?.data?.session?.user?.id;
        if (uid) toInsert.user_id = uid;
      } catch (e) {
        void e;
      }
    }

  console.log('Creating post with data:', toInsert);

  const { data, error } = await (supabase as any).from('posts').insert([toInsert]).select('id, content, file_url, created_at, user_id, tag, profiles(id, username, career, bio, term, created_at)');
    if (error || !data) {
      console.error('❌ createPost insert error:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      // fallback: persist locally so the UI still shows the post
      try {
        const existing = getAllPosts();
        saveAllPosts([post, ...existing]);
      } catch (e) { void e; }
      return post;
    }

    const r = (data as any[])[0];
    console.log('✅ Post created successfully:', { id: r.id, tag: r.tag });
    
    const mapped: Post = {
      id: String(r.id),
      content: r.content || '',
      createdAt: r.created_at || new Date().toISOString(),
      user: r.profiles ? { id: r.profiles.id, name: r.profiles.username } : post.user,
      files: r.file_url ? [{ id: `f_${r.id}`, url: r.file_url, type: r.file_url?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'img', label: String(r.file_url).split('/').pop() }] : [],
      likes: 0,
      likedBy: [],
      comments: 0,
      commentsList: [],
      tag: r.tag || 'General',
    };

    console.log('Mapped post object:', mapped);
    try { const existing = getAllPosts(); saveAllPosts([mapped, ...existing]); } catch (e) { void e; }

    return mapped;
  } catch (err) {
    console.warn('createPost failed', err);
    return null;
  }
}

export async function updateProfileInSupabase(userId: string, partial: Record<string, any>) {
  if (!supabase) {
    console.warn('updateProfileInSupabase: Supabase not configured');
    return null;
  }
  
  try {
    // Map incoming partial to your profiles columns (username, career, bio, term, avatar)
    const updateRow: any = { id: userId };
    if (partial.username) updateRow.username = partial.username;
    if (partial.name && !partial.username) updateRow.username = partial.name;
    if (partial.career) updateRow.career = partial.career;
    if (partial.bio !== undefined) updateRow.bio = partial.bio;
    if (partial.term) updateRow.term = partial.term;
    if (partial.avatar !== undefined) updateRow.avatar = partial.avatar; // Add avatar support

    console.log('updateProfileInSupabase: upserting userId', userId, 'with', updateRow);

    // Use UPSERT to handle both insert and update cases
    // onConflict: 'id' ensures we update if row exists, insert if it doesn't
    const { data, error } = await (supabase as any)
      .from('profiles')
      .upsert(updateRow, { onConflict: 'id' })
      .select('id, username, career, bio, term, created_at, avatar')
      .single();
    
    if (error) {
      console.error('updateProfileInSupabase ERROR:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    if (!data) {
      console.error('updateProfileInSupabase: No data returned after upsert');
      throw new Error('No data returned from profile update');
    }

    console.log('updateProfileInSupabase: SUCCESS', data);

    // Update local storage fallback
    try { 
      setSessionUser({ 
        id: userId, 
        name: data.username, 
        major: data.career, 
        semester: data.term,
        avatar: data.avatar || undefined,
      }); 
    } catch (e) { 
      console.warn('Failed to update local session:', e);
    }

    return data;
  } catch (err) {
    console.error('updateProfileInSupabase FAILED:', err);
    throw err;
  }
}

export async function toggleLikeSupabase(postId: string, userId: string): Promise<any | null> {
  if (!supabase || !userId) {
    console.warn('toggleLikeSupabase: No supabase client or userId');
    return null;
  }
  
  try {
    // Fetch current post to get liked_by array
    const { data: post, error: fetchError } = await (supabase as any)
      .from('posts')
      .select('liked_by')
      .eq('id', postId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('toggleLikeSupabase fetch error:', fetchError);
      return null;
    }

    if (!post) {
      console.warn('toggleLikeSupabase: Post not found');
      return null;
    }
    
    const likedBy = post.liked_by || [];
    const isLiked = likedBy.includes(userId);
    
    // Toggle like
    const newLikedBy = isLiked 
      ? likedBy.filter((id: string) => id !== userId)
      : [...likedBy, userId];
    
    // Update in DB
    const { error: updateError } = await (supabase as any)
      .from('posts')
      .update({ liked_by: newLikedBy })
      .eq('id', postId);
    
    if (updateError) {
      console.error('toggleLikeSupabase update error:', updateError);
      return null;
    }
    
    console.log('toggleLikeSupabase SUCCESS: liked_by=', newLikedBy);
    return { liked_by: newLikedBy, likes: newLikedBy.length };
  } catch (err) {
    console.warn('toggleLikeSupabase failed', err);
    return null;
  }
}

// COMMENTS helpers
export async function createComment(postId: string, userId: string | null, text: string, attachments?: { id: string; url: string; type?: string; label?: string }[]) {
  // Returns a comment shaped for the UI: { id, text, user: { name, avatar }, createdAt, attachments? }
  if (!supabase) {
    // local fallback: append to post in localStorage
    try {
      const posts = getAllPosts();
      const i = posts.findIndex(p => String(p.id) === String(postId));
      const now = new Date().toISOString();
      const comment = {
        id: `c_${Date.now()}`,
        text,
        user: userId ? { id: userId } : undefined,
        createdAt: now,
        attachments: attachments && attachments.length ? attachments : undefined,
      } as any;
      if (i !== -1) {
        const p = posts[i];
        const list = Array.isArray(p.commentsList) ? [...p.commentsList, comment] : [comment];
        p.commentsList = list;
        p.comments = list.length;
        try { saveAllPosts(posts); } catch { /* ignore */ }
      }
      return comment;
    } catch (e) { console.warn('createComment fallback error', e); return null; }
  }

  try {
    // Upload attachments first if any
    let uploadedAttachments = attachments || [];
    if (attachments && attachments.length > 0) {
      console.log('Uploading comment attachments:', attachments.length);
      // For now, we'll pass the blob URLs as-is
      // In production, you'd upload to Storage and get public URLs
      uploadedAttachments = attachments;
    }

    const toInsert: any = {
      content: text,
      post_id: postId,
      created_at: new Date().toISOString(),
      attachments: uploadedAttachments.length > 0 ? JSON.stringify(uploadedAttachments) : null,
    };
    if (userId) toInsert.user_id = userId;

    console.log('Creating comment with data:', toInsert);

  const { data, error } = await (supabase as any).from('comments').insert([toInsert]).select('id, content, created_at, user_id, attachments, profiles(id, username, career, bio, term, avatar, created_at)');
    if (error || !data) {
      console.warn('createComment insert error:', error);
      return null;
    }

    const row = (data as any[])[0];
    const profile = row.profiles || null;
    
    // Parse attachments from database if they exist
    let parsedAttachments = undefined;
    if (row.attachments) {
      try {
        parsedAttachments = typeof row.attachments === 'string' 
          ? JSON.parse(row.attachments) 
          : row.attachments;
      } catch (e) {
        console.warn('Failed to parse comment attachments:', e);
      }
    }

    const comment = {
      id: String(row.id),
      text: row.content || text,
      createdAt: row.created_at || new Date().toISOString(),
      user: profile ? { 
        name: profile.username,
        avatar: profile.avatar || '/src/Assets/defaultuser.png',
      } : (userId ? { id: userId } : undefined),
      attachments: parsedAttachments,
    };
    return comment;
  } catch (err) {
    console.warn('createComment failed', err);
    return null;
  }
}

export async function fetchComments(postId: string) {
  if (!supabase) return [];
  try {
  const { data, error } = await (supabase as any).from('comments').select('id, content, created_at, user_id, attachments, profiles(id, username, career, bio, term, avatar, created_at)').eq('post_id', postId).order('created_at', { ascending: true });
    if (error || !data) {
      console.warn('fetchComments error', error);
      return [];
    }
  return (data as any[]).map((r) => {
    // Parse attachments from database if they exist
    let parsedAttachments = undefined;
    if (r.attachments) {
      try {
        parsedAttachments = typeof r.attachments === 'string' 
          ? JSON.parse(r.attachments) 
          : r.attachments;
      } catch (e) {
        console.warn('Failed to parse comment attachments:', e);
      }
    }

    return { 
      id: String(r.id), 
      text: r.content, 
      createdAt: r.created_at, 
      user: r.profiles ? { 
        name: r.profiles.username,
        avatar: r.profiles.avatar || '/src/Assets/defaultuser.png',
      } : undefined,
      attachments: parsedAttachments,
    };
  });
  } catch (err) {
    console.warn('fetchComments failed', err);
    return [];
  }
}

export async function getProfile(userId: string) {
  if (!supabase) return null;
  try {
      const { data, error, status } = await (supabase as any)
      .from('profiles')
      .select('id, username, career, bio, term, avatar, created_at')
      .eq('id', userId)
      .maybeSingle(); // avoids throwing 406 when row not found    // 406 (Not Acceptable) from PostgREST means "no rows" when using single; treat as benign
    if (status === 406) return null;
    if (error) {
      console.warn('getProfile error', error);
      return null;
    }
    return data || null;
  } catch (err) {
    console.warn('getProfile failed', err);
    return null;
  }
}

export async function getPostsByUser(userId: string) {
  if (!supabase) return [];
  try {
    const { data, error } = await (supabase as any)
      .from('posts')
      .select('id, content, file_url, created_at, user_id, liked_by, tag, profiles(id, username, career, bio, term, avatar, created_at)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      console.warn('getPostsByUser error', error);
      return [];
    }

    // Fetch comments for all user posts in parallel
    const postsWithComments = await Promise.all(
      (data as any[]).map(async (r) => {
        // Fetch comments for this post
        let commentsList: any[] = [];
        try {
          commentsList = await fetchComments(String(r.id));
        } catch (e) {
          console.warn('Failed to fetch comments for post', r.id, e);
        }

        const profile = r.profiles || null;
        
        return {
          id: String(r.id),
          content: r.content || '',
          createdAt: r.created_at || new Date().toISOString(),
          user: profile ? { 
            id: profile.id, 
            name: profile.username,
            major: profile.career,
            semester: profile.term,
            avatar: profile.avatar || '/src/Assets/defaultuser.png', // use DB avatar or fallback
          } : undefined,
          files: r.file_url ? [{ id: `f_${r.id}`, url: r.file_url, type: (r.file_url?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'img') as any, label: String(r.file_url).split('/').pop() }] : [],
          likes: (r.liked_by || []).length,
          likedBy: r.liked_by || [],
          comments: commentsList.length,
          commentsList: commentsList,
          tag: r.tag || 'General',
        };
      })
    );

    return postsWithComments;
  } catch (err) {
    console.warn('getPostsByUser failed', err);
    return [];
  }
}

// Upload a File to Supabase Storage 'posts' bucket and return the public URL.
export async function uploadFile(file: File, userId?: string): Promise<string | null> {
  if (!supabase) return null;
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-z0-9.\-_/]/gi, '_');
    const path = `${userId || 'anon'}/${timestamp}_${safeName}`;

    const { error: uploadError } = await (supabase as any).storage.from('posts').upload(path, file, { upsert: true });
    if (uploadError) {
      console.warn('uploadFile: upload error', uploadError);
      return null;
    }

    const { data } = (supabase as any).storage.from('posts').getPublicUrl(path);
    const publicUrl = data?.publicUrl || null;
    return publicUrl;
  } catch (err) {
    console.warn('uploadFile failed', err);
    return null;
  }
}

// Upload avatar to Supabase Storage 'avatars' bucket and return the public URL.
export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  if (!supabase) return null;
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExt}`;
    const path = `${userId}/${fileName}`;

    console.log('Uploading avatar to path:', path);
    console.log('File info:', { name: file.name, size: file.size, type: file.type });

    // Upload to 'avatars' bucket
    const { data: uploadData, error: uploadError } = await (supabase as any).storage
      .from('avatars')
      .upload(path, file, { 
        cacheControl: '3600',
        upsert: true 
      });
    
    if (uploadError) {
      console.error('uploadAvatar: upload error details:', uploadError);
      console.error('Error code:', uploadError.statusCode);
      console.error('Error message:', uploadError.message);
      throw uploadError;
    }

    console.log('Upload successful, data:', uploadData);

    const { data } = (supabase as any).storage.from('avatars').getPublicUrl(path);
    const publicUrl = data?.publicUrl || null;
    
    console.log('Avatar uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (err) {
    console.error('uploadAvatar failed:', err);
    throw err;
  }
}
