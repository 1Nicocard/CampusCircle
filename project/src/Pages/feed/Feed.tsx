import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Card";
import { Button } from "../../Components/Button";

const tagIcons: Record<string, string> = {
  Design: "/src/Assets/design.svg",
  Literature: "/src/Assets/literature.svg",
  Math: "/src/Assets/math.svg",
  Science: "/src/Assets/science.png",
  Social: "/src/Assets/social.png",
  Default: "/src/Assets/Star.png",
};

const clipIcon = "/src/Assets/clip.png";
const commentIcon = "/src/Assets/comment.png";
const spark = "/src/Assets/icons/spark.svg";

import mockData from "../../Data/mockData.json";
import { getCurrentUser } from "../../lib/auth";
import {
  getAllPosts,
  isLikedByMe,
  type Post as CCPost,
  type PostFile,
} from "../../lib/postStore";

import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { selectPosts, toggleLike as toggleLikeAction } from '../../store/postsSlice';

const POSTS_PER_PAGE = 10;

export default function Feed() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<CCPost[]>([]);
  const reduxPosts = useSelector(selectPosts) as CCPost[];
  const dispatch = useDispatch<AppDispatch>();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [draftsAttachments, setDraftsAttachments] = useState<Record<string, PostFile[]>>({});
  const [visiblePostCount, setVisiblePostCount] = useState(POSTS_PER_PAGE);

  type Category = "All" | "Design" | "Literature" | "Math" | "Science" | "Social";
  const [selectedCats, setSelectedCats] = useState<Category[]>(["All"]);

  useEffect(() => {
    const refresh = () => setPosts(getAllPosts());
    const existing = getAllPosts();
    if (!existing || existing.length === 0) {
      type SeedShape = { posts?: CCPost[] };
      const seed = mockData as SeedShape | CCPost[];
      const seeded = Array.isArray(seed)
        ? seed
        : (seed && Array.isArray(seed.posts) ? seed.posts : []);
      try { localStorage.setItem("posts", JSON.stringify(seeded)); } catch { }
    }
    refresh();
    if (Array.isArray(reduxPosts) && reduxPosts.length > 0) setPosts(reduxPosts);
    const onUpdate = () => refresh();
    window.addEventListener("posts:update", onUpdate);
    return () => window.removeEventListener("posts:update", onUpdate);
  }, [reduxPosts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const usingAll = selectedCats.length === 0 || selectedCats.includes("All");

    return posts.filter((p) => {
      const text = `${p.content || ""} ${p.user?.name || ""} ${p.tag || ""}`.toLowerCase();
      const matches = !q || text.includes(q);
      const inCategory = usingAll
        ? true
        : selectedCats.includes((p.tag || "All") as Category);
      return inCategory && matches;
    });
  }, [searchQuery, selectedCats, posts]);

  const postsToShow = useMemo(() => {
    return filteredPosts.slice(0, visiblePostCount);
  }, [filteredPosts, visiblePostCount]);

  type FileShape = { url: string; type?: string; label?: string };

  return (
    <section className="w-full flex flex-col items-center">
      {/* Banner */}
      <div className="relative w-full">
        <picture>
          <source media="(max-width: 668px)" srcSet="/src/Assets/banner-mobile.png" />
          <img src="/src/Assets/banner.png" alt="CampusCircle banner" className="w-full h-auto object-cover" />
        </picture>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 translate-y-[-60px] sm:translate-y-[-80px] md:translate-y-[-100px]">
          <h1 className="text-white font-satoshi font-bold text-[35px] sm:text-[59px] md:text-[60px] lg:text-[85px] leading-tight max-w-[900px]">
            Your space to <br />share, interact and <br />discover
          </h1>
          <Button
            variant="hero"
            onClick={() => navigate('/feed/create-post')}
            className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 bg-white text-[#0077FF] border-2 border-[#0077FF]
              hover:bg-gradient-to-r hover:from-[#74EBD5] hover:to-[#9FACE6]
              hover:text-white hover:border-transparent transition-all duration-300"
          >
            Start sharing
          </Button>
        </div>
      </div>

      {/* Buscador */}
      <div className="container text-center mb-12">
        <div className="mx-auto max-w-[760px] mt-6 mb-2">
          <div className="relative">
            <div className="relative h-[48px] bg-[#007CFF] rounded-full border-[2px] border-white flex items-center px-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 bg-transparent text-white placeholder-white/90 outline-none text-base sm:text-lg md:text-xl"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex justify-center flex-wrap gap-14 mb-28">
        {(["All", "Design", "Literature", "Math", "Science", "Social"] as const).map((item) => {
          const active = selectedCats.includes(item);
          return (
            <Button
              key={item}
              variant="secondary"
              onClick={() => {
                setSelectedCats((prev) => {
                  if (item === "All") return ["All"];
                  const base = prev.includes("All") ? [] : [...prev];
                  if (base.includes(item)) {
                    const next = base.filter((c) => c !== item);
                    return next.length ? next : ["All"];
                  } else {
                    return [...base, item];
                  }
                });
              }}
              className={`px-8 py-1.5 rounded-full border-[2px] outline-none ${active
                ? "bg-[#0066FF] text-white border-[#0066FF] shadow-[0_6px_18px_rgba(0,102,255,0.35)]"
                : "bg-transparent text-[#2091FF] border-[#2091FF] hover:bg-[#EAF5FF]"
                }`}
            >
              {item}
            </Button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="container flex flex-col items-center gap-16">
        {postsToShow.map((post) => {
          const { id, user, tag, content, files } = post;

          // 🔹 Separar título del contenido
          const lines = (content || "").split("\n");
          const title = lines[0]?.slice(0, 120);
          const body = lines.slice(1).join("\n");

          return (
            <main key={id} className="w-full max-w-[1200px]">
              <Card className="relative w-full bg-white rounded-2xl shadow-md shadow-black/5 p-10 md:p-14 flex flex-col">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img src={user?.avatar} alt={user?.name} className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover" />
                    <div>
                      <h2 className="text-[26px] md:text-[32px] font-satoshi font-bold text-[#565656] leading-tight">{user?.name}</h2>
                      <p className="text-[14px] md:text-[16px] text-[#7B8694]">{(() => {
                        const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
                        if (!isObj(user)) return 'Student';
                        const u = user as Record<string, unknown>;
                        const program = typeof u.program === 'string' ? u.program : (typeof u.major === 'string' ? u.major : 'Program');
                        const term = typeof u.term === 'string' ? u.term : (typeof u.semester === 'string' ? u.semester : 'Term');
                        return `${program} | ${term}`;
                      })()}</p>
                    </div>
                  </div>
                  <div className="ml-auto text-right text-[#A1A1A1] text-sm md:text-base">
                    {(() => {
                      const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
                      let val: unknown = undefined;
                      if (isObj(post) && 'createdAt' in post) val = (post as Record<string, unknown>).createdAt;
                      const d = val ? new Date(String(val)) : new Date();
                      return d.toLocaleDateString();
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-8">
                  <img src={spark} alt="spark" className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
                  <h3 className="text-[36px] md:text-[50px] font-satoshi font-bold text-[#454545]">{title}</h3>
                </div>

                {/* Categoría */}
                <div className="mt-4">
                  <Button variant="label" className="px-4 py-1 text-sm inline-flex items-center justify-center gap-2">
                    <img
                      src={tagIcons[tag || "Default"]}
                      className={`${tag === "Science" ? "w-5 h-3,5" : "w-5 h-5"} inline-block`}
                      alt={tag || "tag"}
                    />
                    <span className="text-sm leading-none">{tag || "General"}</span>
                  </Button>
                </div>

                {/* Contenido */}
                <p className="mt-10 text-[20px] md:text-[24px] font-sarala text-[#565656] leading-relaxed">{body}</p>

                {/* Archivos */}
                <div className="flex flex-wrap gap-4 mt-10">
                  {(files || []).map((file: FileShape, index) => (
                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors hover:text-gray-700"
                    >
                      <img
                        src={file.type === "pdf"
                          ? "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                          : "https://cdn-icons-png.flaticon.com/512/337/337940.png"
                        }
                        alt={file.type}
                        className="w-5 h-5"
                      />
                      <span className="font-sarala text-[20px] md:text-[24px] text-[#565656]">{file.label || String(file.url).split('/').pop()}</span>
                    </a>
                  ))}
                </div>

                {/* Like y Comentarios */}
                <div className="flex items-center gap-4 mt-8">
                  <button
                    onClick={async () => {
                      try {
                        const res = await dispatch(toggleLikeAction(String(post.id)));
                        const updated = (res as any)?.payload;
                        if (updated) setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                      } catch { }
                    }}
                    className="inline-flex items-center gap-2 px-3 h-[34px] rounded-full border bg-[#F1F4F9] border-[#E6E8EE] text-[14px] transition-transform active:scale-95"
                  >
                    <img
                      src={isLikedByMe(post) ? "/src/Assets/like-red.png" : "/src/Assets/like.svg"}
                      alt="like"
                      className="w-4 h-4"
                    />
                    <span className="text-[#667085]">{post.likes ?? 0}</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById(`attach-${id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="inline-flex items-center gap-2 px-3 h-[34px] rounded-full border text-[14px] transition-transform active:scale-95 bg-[#F1F4F9] border-[#E6E8EE]"
                    title="Comments"
                  >
                    <img src={commentIcon} alt="comments" className="w-4 h-4 opacity-80" />
                    <span className="text-[#667085]">{post.comments ?? 0}</span>
                  </button>
                </div>

                {/* Comentarios */}
                <div className="mt-6 space-y-4">
                  {(post.commentsList ?? []).map((c) => (
                    <div key={c.id} className="flex items-start gap-3 bg-[#FBFCFF] rounded-xl p-3">
                      <img src={c.user?.avatar || "/src/Assets/user2.png"} className="w-9 h-9 rounded-full object-cover" />

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-[14px] text-[#2B2F36] font-medium">
                          <span>{c.user?.name || "Anonymous"}</span>
                          {c.createdAt && (
                            <span className="text-[12px] text-[#8C8C8C]">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="text-[15px] text-[#565656] mt-1">{c.text}</div>

                        {Array.isArray(c.attachments) && c.attachments.length > 0 && (
                          <div className="mt-2 flex gap-3">
                            {c.attachments.map((a: PostFile, ai: number) => (
                              <a
                                key={ai}
                                href={a.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md"
                              >
                                <img
                                  src={
                                    a.type === "pdf"
                                      ? "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                      : "https://cdn-icons-png.flaticon.com/512/337/337940.png"
                                  }
                                  className="w-5 h-5"
                                />
                                <span className="text-sm text-[#565656]">
                                  {a.label || String(a.url).split("/").pop()}
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Composer */}
                <div className="mt-6">
                  <div className="bg-white rounded-2xl border border-[#E6E8EE] p-4 flex items-start gap-4">
                    <img src={getCurrentUser()?.avatar || "/src/Assets/user2.png"} className="w-10 h-10 rounded-full object-cover" alt="you" />
                    <input
                      placeholder="Write a comment..."
                      value={drafts[id] || ""}
                      onChange={(e) => setDrafts((s) => ({ ...s, [id]: e.target.value }))}
                      className="flex-1 border border-transparent rounded-full px-4 py-3 outline-none text-[15px]"
                    />

                    <input
                      id={`attach-${id}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        if (!f) return;
                        const url = URL.createObjectURL(f);
                        const fileShape: PostFile = {
                          id: `f_${Date.now()}`,
                          type: f.type.includes('pdf') ? 'pdf' : 'img',
                          url,
                          label: f.name,
                        };
                        setDraftsAttachments((s) => ({ ...s, [id]: [...(s[id] || []), fileShape] }));
                        (e.target as HTMLInputElement).value = '';
                      }}
                    />

                    <button
                      onClick={() => document.getElementById(`attach-${id}`)?.click()}
                      className="ml-2 inline-flex items-center px-3 py-2 rounded-full bg-white border border-[#E6E8EE]"
                      title="Attach file"
                    >
                      <img src={clipIcon} alt="Attach" className="w-6 h-6" />
                    </button>

                    <button
                      onClick={() => {
                        const text = (drafts[id] || "").trim();
                        const attachments = draftsAttachments[id] || [];
                        if (!text && attachments.length === 0) return;
                        const commenter = getCurrentUser();
                        const newComment = {
                          id: `c_${Date.now()}`,
                          text,
                          user: commenter ? { name: commenter.name, avatar: commenter.avatar } : undefined,
                          createdAt: new Date().toISOString(),
                          attachments: attachments.length ? attachments : undefined,
                        };
                        try {
                          dispatch({ type: 'posts/addComment', payload: { postId: String(id), comment: newComment } });
                          setDrafts((s) => ({ ...s, [id]: "" }));
                          setDraftsAttachments((s) => ({ ...s, [id]: [] }));
                        } catch { }
                      }}
                      className="ml-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E6E8EE] text-[#1E90FF]"
                    >Post</button>

                  </div>
                </div>
              </Card>
            </main>
          );
        })}

        {/* 🆕 5. Botón "Ver más / Ver menos" */}
        {filteredPosts.length > POSTS_PER_PAGE && (
          <div className="mt-10 mb-20">
            <Button
              variant="hero"
              onClick={() => {
                if (visiblePostCount >= filteredPosts.length) {
                  setVisiblePostCount(POSTS_PER_PAGE); // Ver menos
                } else {
                  setVisiblePostCount((prev) => prev + POSTS_PER_PAGE); // Ver más
                }
              }}
              className="px-10 py-3 text-lg font-bold bg-[#0077FF] text-white rounded-full
        hover:bg-[#0055CC] transition-all duration-200 shadow-[0_4px_12px_rgba(0,119,255,0.4)]"
            >
              {visiblePostCount >= filteredPosts.length ? "Ver menos" : "Ver más"}
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
