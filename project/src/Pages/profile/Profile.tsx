// src/Pages/profile/Profile.tsx
// src/Pages/profile/Profile.tsx
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "../../lib/auth";
import {
  getAllPosts,
  toggleLike,
  isLikedByMe,
  type Post as FullPost,
  type PostFile,
} from "../../lib/postStore"; // nuevo archivo que gestiona likes persistentes

// Iconos: map tags to local assets
const tagIcons: Record<string, string> = {
  Design: "/src/Assets/design.svg",
  Literature: "/src/Assets/literature.svg",
  Math: "/src/Assets/math.svg",
  Science: "/src/Assets/science.svg",
  Social: "/src/Assets/social.svg",
  Default: "/src/Assets/Star.png",
};

const iconComment = "/src/Assets/comment.png";

import icInstitution from "../../Assets/icons/academicicon.svg";
import icProgram from "../../Assets/icons/programicon.svg";
import icTerm from "../../Assets/icons/calendaricon.svg";

type Post = FullPost;

export default function Profile() {
  const user = getCurrentUser();
  const [posts, setPosts] = useState<Post[]>([]);

  const refresh = useCallback(() => {
    if (!user) return setPosts([]);
    const all = getAllPosts();
    // Filtra los posts del usuario actual
    const mine = all.filter((p) => {
      const byEmail =
        p?.user?.email &&
        user.email &&
        String(p.user.email).toLowerCase() ===
          String(user.email).toLowerCase();
      const byName =
        String(p?.user?.name || "").trim().toLowerCase() ===
        String(user.name || "").trim().toLowerCase();
      return byEmail || byName;
    });
    setPosts(mine);
  }, [user]);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("posts:update", onUpdate);
    return () => window.removeEventListener("posts:update", onUpdate);
  }, [refresh]);

  if (!user) {
    return (
      <section className="container py-24">
        <p className="text-center text-[18px] text-[#565C66]">
          Please sign in.
        </p>
        <div className="text-center mt-4">
          <Link
            to="/signin"
            className="text-[#1E90FF] font-bold hover:underline"
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
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <img
            src={user?.avatar || "/src/Assets/Foto user.jpg"}
            alt="Profile picture"
            className="w-20 h-20 md:w-20 md:h-20 rounded-full object-cover border-2 border-blue-400 mx-auto md:mx-0"
          />

          <div className="text-center md:text-left">
            <h1 className="font-satoshi font-bold text-[34px] md:text-[54px] leading-tight text-[#1E90FF]">
              {user.name || "Your name"}
            </h1>
          </div>
        </div>
      </div>

      <div className="container pb-20">
        <div className="grid grid-cols-12 gap-6">
          {/* ===== LEFT: About me ===== */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-[22px] border border-[#E6E8EE] shadow-[0_8px_24px_rgba(24,72,167,.10)] p-7">
              <h2 className="text-[26px] font-satoshi font-bold text-[#222] mb-3">
                About me
              </h2>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E6E8EE] to-transparent mb-4" />
              <ul className="space-y-5 text-[15px] md:text-[16px]">
                <AboutRow
                  icon={icInstitution}
                  label="Institution"
                  value={"Icesi"}
                />
                <AboutRow
                  icon={icProgram}
                  label="Study Program"
                  value={user.major || "Interactive Media Design"}
                />
                <AboutRow
                  icon={icTerm}
                  label="Term"
                  value={user.semester || "5th Semester"}
                />
              </ul>

              <Link
                to="/feed/profile/edit"
                className="mt-6 inline-flex items-center justify-center w-full h-[44px] rounded-full
                           bg-[#1E90FF] text-white font-ABeeZee text-[16px] hover:bg-[#1478E9] transition"
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
                  onChange={(u) =>
                    setPosts((prev) =>
                      prev.map((x) => (x.id === u.id ? u : x))
                    )
                  }
                />
              ))
            ) : (
              <div className="bg-white rounded-[22px] border border-[#E6E8EE] shadow-[0_8px_24px_rgba(24,72,167,.10)] p-8 text-center">
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
    <li className="flex items-start gap-3">
      <img src={icon} className="w-5 h-5 opacity-70 mt-[2px]" />
      <div>
        <b className="text-[#2B2F36]">{label}:</b>{" "}
        <span className="text-[#565C66]">{value}</span>
      </div>
    </li>
  );
}

/* ---------- Mini Card de Post (según imagen) ---------- */

function MiniPostCard({
  post,
  onChange,
}: {
  post: Post;
  onChange?: (u: Post) => void;
}) {
  const liked = isLikedByMe(post);
  const date = post.createdAt ? new Date(post.createdAt) : new Date();
  const dateStr = new Intl.DateTimeFormat("en-GB").format(date);

  const handleLike = () => {
    try {
      const updated = toggleLike(String(post.id));
      if (updated) onChange?.(updated as Post);
    } catch (e) {
      console.warn(e);
    }
  };

  const spark = "/src/Assets/icons/spark.svg";

  return (
    <article className="bg-white rounded-[22px] border border-[#E6E8EE] shadow-[0_8px_24px_rgba(24,72,167,.10)] p-6 md:p-7">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex items-center gap-2 text-[18px] md:text-[20px] font-satoshi font-bold text-[#2B2F36]">
          <img src={spark} className="inline-block w-2.5 h-2.5" alt="spark" />
          {post.content || "Untitled post"}
        </h3>
        <time className="text-[13px] md:text-[14px] text-[#8B94A5] whitespace-nowrap">
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
          className={`inline-flex items-center gap-2 px-3 h-[34px] rounded-full border text-[14px] transition-transform active:scale-95 ${
            liked
              ? "bg-[#FFF4F4] border-red-200"
              : "bg-[#F1F4F9] border-[#E6E8EE]"
          }`}
        >
            <img src="/src/Assets/like.svg" alt="like" className={`w-4 h-4 ${liked ? "opacity-100" : "opacity-60"}`} />
          <span
            className={
              liked ? "text-[#DC2626] font-medium" : "text-[#667085]"
            }
          >
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
          )
        )}
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
    <span className="inline-flex items-center gap-2 px-3 h-[34px] rounded-full bg-[#F1F4F9] text-[#667085] text-[14px] border border-[#E6E8EE]">
      {icon && <img src={icon} className="w-4 h-4 opacity-80" />}
      {children}
    </span>
  );
}
