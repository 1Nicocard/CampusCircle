import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getAllPosts, saveAllPosts, toggleLike as postToggleLike } from '../lib/postStore';
import type { Post } from '../lib/postStore';
import * as supabaseApi from '../lib/supabaseApi';

export type PostState = {
  posts: Post[];
};

const initialState: PostState = {
  posts: getAllPosts(),
};

export const fetchPosts = createAsyncThunk<Post[]>('posts/fetchPosts', async () => {
  const posts = await supabaseApi.fetchPosts();
  return posts;
});

export const createPost = createAsyncThunk<Post | null, Post>('posts/createPost', async (post: Post) => {
  const created = await supabaseApi.createPost(post);
  return created;
});

export const toggleLike = createAsyncThunk<
  { postId: string; likes: number; likedBy: string[] } | null, 
  { postId: string; userId: string }
>(
  'posts/toggleLike', 
  async ({ postId, userId }: { postId: string; userId: string }) => {
    // Try Supabase database first
    if (userId) {
      try {
        const dbResult = await supabaseApi.toggleLikeSupabase(postId, userId);
        if (dbResult) {
          console.log('toggleLike: DB success', dbResult);
          return { 
            postId, 
            likes: dbResult.likes, 
            likedBy: dbResult.liked_by 
          };
        }
      } catch (err) {
        console.warn('toggleLike: DB failed, falling back to localStorage', err);
      }
    }

    // Fallback to localStorage
    const updated = postToggleLike(postId);
    if (updated) {
      return {
        postId,
        likes: updated.likes ?? 0,
        likedBy: updated.likedBy ?? [],
      };
    }
    
    return null;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts = [action.payload, ...state.posts];
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    },
    addComment(state, action: PayloadAction<{ postId: string; comment: NonNullable<Post['commentsList']>[number] }>) {
      const { postId, comment } = action.payload;
      const i = state.posts.findIndex(p => String(p.id) === String(postId));
      if (i === -1) return;
      const existing = Array.isArray(state.posts[i].commentsList) ? [...state.posts[i].commentsList] : [];
      const newList = [...existing, comment];
      const updated = { ...state.posts[i], commentsList: newList, comments: newList.length } as Post;
      state.posts[i] = updated;
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    },
    updatePost(state, action: PayloadAction<Post>) {
      state.posts = state.posts.map((p) => (p.id === action.payload.id ? action.payload : p));
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    },
    updatePostsUserInfo(state, action: PayloadAction<{
      userId: string;
      username: string;
      career: string;
      term: string;
      avatar: string;
    }>) {
      const { userId, username, career, term, avatar } = action.payload;
      state.posts = state.posts.map(post => {
        if (post.user?.id === userId) {
          return {
            ...post,
            user: {
              ...post.user,
              name: username,
              major: career,
              semester: term,
              avatar: avatar
            }
          };
        }
        return post;
      });
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
      // Preserve likes data from existing posts when fetching new data
      const existingPosts = state.posts;
      const newPosts = action.payload.map(newPost => {
        const existing = existingPosts.find(p => String(p.id) === String(newPost.id));
        if (existing) {
          // Keep the likes and likedBy from localStorage
          return {
            ...newPost,
            likes: existing.likes ?? newPost.likes,
            likedBy: existing.likedBy ?? newPost.likedBy,
          };
        }
        return newPost;
      });
      
      state.posts = newPosts;
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    });

    builder.addCase(createPost.fulfilled, (state, action: PayloadAction<Post | null>) => {
      if (action.payload) {
        state.posts = [action.payload, ...state.posts];
        try { saveAllPosts(state.posts); } catch { /* ignore */ }
      }
    });

    builder.addCase(toggleLike.fulfilled, (state, action) => {
      if (!action.payload) return;
      const { postId, likes, likedBy } = action.payload;
      const post = state.posts.find(p => String(p.id) === String(postId));
      if (post) {
        post.likes = likes;
        post.likedBy = likedBy;
        try { saveAllPosts(state.posts); } catch { /* ignore */ }
      }
    });
  }
});

export const { setPosts, addPost, addComment, updatePost, updatePostsUserInfo } = postsSlice.actions;
export default postsSlice.reducer;

import type { RootState } from './store';

export const selectPosts = (s: RootState) => s.posts.posts;
