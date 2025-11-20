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
} from "../../lib/postStore";

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
            src={user?.avatar || "/src/Assets/Foto user.jpg"}
            alt="Profile picture"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#0077FF] mx-auto md:mx-0"
          />
          <div className="text-center md:text-left">
            <h1 className="font-satoshi font-bold text-[34px] sm:text-[42px] md:text-[54px] leading-tight text-[#0077FF]">
              {user.name || "Your name"}
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
}: {
  post: Post;
  onChange?: (u: Post) => void;
}) {
  const liked = isLikedByMe(post);
  const date = post.createdAt ? new Date(post.createdAt) : new Date();
  const dateStr = date.toLocaleDateString();

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
    <article className="bg-white rounded-2xl border border-[#E6E8EE] shadow-md p-6 sm:p-8">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex items-center gap-2 text-[20px] sm:text-[24px] font-satoshi font-bold text-[#454545]">
          <img src={spark} className="inline-block w-4 h-4" alt="spark" />
          {post.content || "Untitled post"}
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
          className={`inline-flex items-center gap-2 px-4 h-[36px] rounded-full border text-[16px] sm:text-[18px] transition-transform active:scale-95 ${
            liked
              ? "bg-[#FFF4F4] border-red-200 text-[#DC2626]"
              : "bg-[#F1F4F9] border-[#E6E8EE] text-[#667085]"
          }`}
        >
          <img
            src="/src/Assets/like.svg"
            alt="like"
            className={`w-5 h-5 ${liked ? "opacity-100" : "opacity-60"}`}
          />
          <span>{post.likes ?? 0}</span>
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
