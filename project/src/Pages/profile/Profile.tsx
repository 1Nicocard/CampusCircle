import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Attachment = { name: string; type: string; url: string };
type Post = {
  id: number | string;
  user: { name: string; avatar?: string; role?: string; semester?: string };
  date: string;
  category?: string;
  title: string;
  content?: string;
  likes?: number;
  comments?: unknown[];
  attachments?: Attachment[];
};
import { getCurrentUser } from "../../lib/auth";
import mockData from "../../Data/mockData.json";

export default function Profile(){
  const user = getCurrentUser();
  if(!user){
    return (
      <section className="container py-20">
        <p className="text-center text-[18px] text-[#565656]">Please sign in.</p>
        <div className="text-center mt-4">
          <Link to="/signin" className="text-[var(--cc-blue)] font-satoshi font-bold hover:underline">Go to Sign In</Link>
        </div>
      </section>
    );
  }

  const userPosts = (mockData as Post[]).filter(
    p => p?.user?.name?.trim()?.toLowerCase() === user.name.trim().toLowerCase()
  );

  return (
    <section className="w-full bg-[var(--cc-bg)]">
      {/* header name */}
      <div className="container pt-44 md:pt-48 pb-4">
        <h1 className="font-satoshi font-bold text-[36px] md:text-[54px] leading-tight text-[var(--cc-blue)]">
          {user.name}
        </h1>
      </div>

      <div className="container pb-20">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT – About me */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="bg-[var(--cc-card)] rounded-[var(--cc-radius-card)] shadow-[var(--cc-shadow)] p-6 md:p-7 border border-[var(--cc-border)]">
              <h2 className="text-[22px] font-satoshi font-bold text-[#222] mb-4">About me</h2>
              <hr className="border-t border-[var(--cc-border)] mb-4" />
              <ul className="space-y-4 text-[15px] md:text-[16px]">
                <li className="flex items-start gap-3">
                  <span className="opacity-70 mt-[2px]">🏫</span>
                  <div><b className="text-[#2B2F36]">Institution:</b> <span className="text-[var(--cc-text)]">{user.major ? "Icesi" : "Icesi"}</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="opacity-70 mt-[2px]">📚</span>
                  <div><b className="text-[#2B2F36]">Study Program:</b> <span className="text-[var(--cc-text)]">{user.major || "Interactive Media Design"}</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="opacity-70 mt-[2px]">📅</span>
                  <div><b className="text-[#2B2F36]">Term:</b> <span className="text-[var(--cc-text)]">{user.semester || "5th Semester"}</span></div>
                </li>
              </ul>

              <Link
                to="/profile/edit"
                className="mt-6 inline-flex items-center justify-center w-full h-[44px] rounded-[var(--cc-radius-pill)]
                bg-[var(--cc-blue)] text-white font-ABeeZee text-[16px] hover:bg-[var(--cc-blue-dark)] transition"
              >
                Edit profile
              </Link>
            </div>
          </aside>

          {/* RIGHT – Posts */}
          <main className="col-span-12 lg:col-span-8 space-y-5">
            {userPosts.map((post)=>(
              <PostCard key={post.id} post={post} />
            ))}
            {userPosts.length===0 && (
              <div className="bg-[var(--cc-card)] rounded-[var(--cc-radius-card)] shadow-[var(--cc-shadow)] p-8 text-center border border-[var(--cc-border)]">
                <p className="text-[16px] text-[var(--cc-text)]">No posts yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function Chip({children}:{children:ReactNode}){
  return (
    <span className="inline-flex items-center gap-2 px-3 h-[34px] rounded-[999px] bg-[#F1F4F9] text-[#667085] text-[14px] border border-[var(--cc-border)]">
      {children}
    </span>
  );
}

function PostCard({ post }: { post: Post }){
  return (
    <article className="bg-[var(--cc-card)] rounded-[var(--cc-radius-card)] shadow-[var(--cc-shadow)] p-6 md:p-7 border border-[var(--cc-border)]">
      {/* top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px] text-[var(--cc-muted)]">
          <span className="w-2.5 h-2.5 bg-[var(--cc-blue)] rounded-full inline-block" />
          <span className="font-satoshi font-bold text-[#2B2F36] text-[20px] md:text-[22px]">{post.title}</span>
        </div>
        <time className="text-[13px] md:text-[14px] text-[var(--cc-muted)]">
          {new Date(post.date).toLocaleDateString("en-GB")}
        </time>
      </div>

      {/* chips */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Chip>🏷️ {post.category}</Chip>
        <Chip>❤️ {post.likes}</Chip>
        <Chip>💬 {post.comments?.length ?? 0}</Chip>
        {Array.isArray(post.attachments) && post.attachments.length > 0 && post.attachments.map((a, i) => (
          <Chip key={i}>{a.type==="pdf" ? "📕" : "🖼️"}</Chip>
        ))}
      </div>
    </article>
  );
}
