// src/Pages/profile/Profile.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthProvider";
import { isLikedByMe, type Post as FullPost, type PostFile, getAllPosts } from "../../lib/postStore";
import * as supabaseApi from "../../lib/supabaseApi";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { toggleLike as toggleLikeAction } from '../../store/postsSlice';

const tagIcons: Record<string, string> = {
  Design: "/assets/design.svg",
  Literature: "/assets/literature.svg",
  Math: "/assets/math.svg",
  Science: "/assets/science.svg",
  Social: "/assets/social.svg",
  Default: "/assets/Star.png",
};

const iconComment = "/assets/comment.png";
import icInstitution from "../../Assets/icons/academicicon.svg";
import icProgram from "../../Assets/icons/programicon.svg";
import icTerm from "../../Assets/icons/calendaricon.svg";

type Post = FullPost;

export default function Profile() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
  const [, setLoading] = useState(false);


  // load profile and posts from Supabase when possible
  useEffect(() => {
    let mounted = true;
    
    async function loadProfileData() {
      if (!user) {
        if (mounted) {
          setProfile(null);
          setPosts([]);
        }
        return;
      }

      try {
        const pid = (user as any).id || (user as any)?.userId || null;
        if (!pid) {
          console.warn('Profile: no user id found');
          return;
        }
        
        console.log('Profile: fetching data for user', pid);
        const prof = await supabaseApi.getProfile(String(pid));
        const myPosts = await supabaseApi.getPostsByUser(String(pid));
        
        // Merge likes data from localStorage with posts from Supabase
        const localPosts = getAllPosts();
        const mergedPosts = myPosts.map(post => {
          const localPost = localPosts.find(p => String(p.id) === String(post.id));
          if (localPost) {
            return {
              ...post,
              likes: localPost.likes ?? post.likes,
              likedBy: localPost.likedBy ?? post.likedBy,
            };
          }
          return post;
        });
        
        if (mounted) {
          console.log('Profile: loaded profile', prof);
          setProfile(prof || null);
          setPosts(Array.isArray(mergedPosts) ? mergedPosts : []);
        }
      } catch (err) {
        console.error('Profile load failed', err);
      }
    }

    loadProfileData();

    const onUpdate = () => {
      (async () => {
        try {
          const pid = (user as any).id || (user as any)?.userId || null;
          if (!pid) return;
          const myPosts = await supabaseApi.getPostsByUser(String(pid));
          
          // Merge likes data from localStorage
          const localPosts = getAllPosts();
          const mergedPosts = myPosts.map(post => {
            const localPost = localPosts.find(p => String(p.id) === String(post.id));
            if (localPost) {
              return {
                ...post,
                likes: localPost.likes ?? post.likes,
                likedBy: localPost.likedBy ?? post.likedBy,
              };
            }
            return post;
          });
          
          if (mounted) setPosts(Array.isArray(mergedPosts) ? mergedPosts : []);
        } catch (e) { 
          console.warn('Failed to refresh posts:', e);
        }
      })();
    };

    window.addEventListener("posts:update", onUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("posts:update", onUpdate);
    };
  }, [user]); // Re-run when user changes (including profile updates)

  if (!user) {
    return (
      <section className="container py-24">
        <p className="text-center text-[18px] sm:text-[20px] text-[#565656]">
          Please sign in.
        </p>
        <div className="text-center mt-4">
          <Link
            to="/signin"
            className="text-[#0077FF] font-bold hover:underline"
          >
            Go to Sign In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F4F7FB]">
      <div className="container pt-40 md:pt-44 pb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <img
            src={user?.avatar || "/assets/defaultuser.png"}
            alt="Profile picture"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#0077FF] mx-auto md:mx-0"
          />
          <div className="text-center md:text-left">
            <h1 className="font-satoshi font-bold text-[34px] sm:text-[42px] md:text-[54px] leading-tight text-[#0077FF]">
              {user.name || profile?.username || "Your name"}
            </h1>
          </div>
        </div>
      </div>

      <div className="container pb-20">
        <div className="grid grid-cols-12 gap-6">
       <aside className="col-span-12 lg:col-span-4">
  <div className="bg-white rounded-2xl border border-[#E6E8EE] shadow-md p-6 sm:p-8">
    <h2 className="text-[20px] md:text-[32px] font-satoshi font-bold text-[#454545] mb-5">
      About me
    </h2>

    <div className="h-[1px] bg-[#E6E8EE] mb-6" />

    <ul className="space-y-5 text-[18px] md:text-[24px] text-[#565C66]">
      <AboutRow
        icon={icInstitution}
        label="Institution"
        value={"Icesi"}
      />
      <AboutRow
        icon={icProgram}
        label="Study Program"
        value={user.major || profile?.career || "Interactive Media Design"}
      />
      <AboutRow
        icon={icTerm}
        label="Term"
        value={user.semester || profile?.term || "5th Semester"}
      />
    </ul>

    <Link
      to="/feed/profile/edit"
      className="mt-6 inline-flex items-center justify-center w-full h-[44px] rounded-full
                 bg-[#0077FF] text-white font-sarala text-[16px] sm:text-[18px] hover:bg-[#0055CC] transition"
    >
      Edit profile
    </Link>
  </div>
</aside>


          {/* ===== RIGHT: POSTS ===== */}
          <main className="col-span-12 lg:col-span-8 space-y-5">
            {posts.length > 0 ? (
              posts.map((post: Post) => (
                <MiniPostCard
                  key={post.id}
                  post={post}
                  dispatch={dispatch}
                  userId={(user as any)?.id || (user as any)?.userId || ''}
                  onChange={(u) =>
                    setPosts((prev) =>
                      prev.map((x) => (x.id === u.id ? u : x))
                    )
                  }
                />
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-[#E6E8EE] shadow-md p-8 text-center">
                <p className="text-[#667085]">No posts yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

/* ---------- Subcomponents ---------- */

function AboutRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <img src={icon} className="w-5 h-5 opacity-70" />
      <div>
        <b className="text-[#454545]">{label}:</b>{" "}
        <span className="text-[#565656]">{value}</span>
      </div>
    </li>
  );
}

/* ---------- Mini Card de Post ---------- */

function MiniPostCard({
  post,
  onChange,
  dispatch,
  userId,
}: {
  post: Post;
  onChange?: (u: Post) => void;
  dispatch: AppDispatch;
  userId: string;
}) {
  const liked = isLikedByMe(post);
  const date = post.createdAt ? new Date(post.createdAt) : new Date();
  const dateStr = date.toLocaleDateString();

  const handleLike = async () => {
    try {
      if (!userId) {
        console.warn('Cannot like: no user ID');
        return;
      }
      
      // Dispatch to Redux - this will update DB and sync with Feed
      await dispatch(toggleLikeAction({ postId: String(post.id), userId }));
      
      // Optionally refresh local state (Redux should handle this, but for immediate feedback)
      const updatedPosts = getAllPosts();
      const updated = updatedPosts.find(p => String(p.id) === String(post.id));
      if (updated) {
        onChange?.(updated as Post);
      }
    } catch (e) {
      console.warn('Like failed:', e);
    }
  };

  const spark = "/assets/icons/spark.svg";

  return (
    <article className="bg-white rounded-2xl border border-[#E6E8EE] shadow-md p-6 sm:p-8">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex items-center gap-2 text-[20px] sm:text-[24px] font-satoshi font-bold text-[#454545]">
  <img src={spark} className="inline-block w-4 h-4" alt="spark" />
  {(post.content || "Untitled post").split("\n")[0]}
</h3>

        <time className="text-[13px] sm:text-[14px] text-[#8C8C8C] whitespace-nowrap">
          {dateStr}
        </time>
      </div>

      {/* Chips row */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* Tag */}
        <Chip icon={tagIcons[post.tag || "Default"]}>{post.tag || "Design"}</Chip>

        {/* Like */}
       
<button
  onClick={handleLike}
  className="inline-flex items-center gap-2 px-2 sm:px-4 h-[34px] sm:h-[42px] rounded-full border bg-[#F1F4F9] border-[#E6E8EE] text-[14px] sm:text-[16px] lg:text-[18px] transition-transform active:scale-95"
>
  <img
    src={liked ? "/assets/like-red.png" : "/assets/like.svg"}
    alt="like"
    className="w-5 sm:w-5 lg:w-5 h-5 sm:h-5 lg:h-5"
  />
  <span className="text-[#667085] text-[14px] sm:text-[16px] lg:text-[18px]">
    {post.likes ?? 0}
  </span>
</button>


        {/* Comments */}
        <Chip icon={iconComment}>{post.comments ?? 0}</Chip>

        {/* Attachments */}
        {(post.files || []).map((file: PostFile, i: number) => (
          <Chip key={i}>
            <img
              src={
                file.type === "pdf"
                  ? "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  : "https://cdn-icons-png.flaticon.com/512/337/337940.png"
              }
              alt={file.type}
              className="w-5 h-5"
            />
          </Chip>
        ))}
      </div>
    </article>
  );
}

function Chip({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 px-4 h-[36px] rounded-full bg-[#F1F4F9] text-[#667085] text-[16px] sm:text-[18px] border border-[#E6E8EE]">
      {icon && <img src={icon} className="w-4 h-4 opacity-80" />}
      {children}
    </span>
  );
}
