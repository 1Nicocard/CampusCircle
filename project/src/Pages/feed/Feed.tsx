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
import { useAuth } from "../../lib/AuthProvider";
import {
  getAllPosts,
  isLikedByMe,
  type Post as CCPost,
  type PostFile,
} from "../../lib/postStore";

import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { selectPosts, toggleLike as toggleLikeAction, fetchPosts, addComment, updatePost } from '../../store/postsSlice';
import * as supabaseApi from '../../lib/supabaseApi';
import { supabase } from '../../lib/supabaseClient';

const POSTS_PER_PAGE = 10;

export default function Feed() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
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
    // dispatch fetch from supabase/local cache
    dispatch(fetchPosts());
    // seed local posts if completely empty (first-run)
    const existing = getAllPosts();
    if (!existing || existing.length === 0) {
      type SeedShape = { posts?: CCPost[] };
      const seed = mockData as SeedShape | CCPost[];
      const seeded = Array.isArray(seed)
        ? seed
        : (seed && Array.isArray(seed.posts) ? seed.posts : []);
      try { localStorage.setItem("posts", JSON.stringify(seeded)); } catch { }
    }

    // update posts from redux when available
    if (Array.isArray(reduxPosts) && reduxPosts.length > 0) setPosts(reduxPosts);

    // 🔴 REALTIME: Subscribe to posts table updates for live likes
    let realtimeChannel: any = null;
    if (supabase) {
      realtimeChannel = supabase
        .channel('posts-realtime')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'posts' 
          }, 
          (payload: any) => {
            console.log('🔴 Realtime update received:', payload);
            const updatedPost = payload.new;
            if (updatedPost?.id) {
              // Find existing post in Redux to merge with
              const existingPost = reduxPosts.find(p => String(p.id) === String(updatedPost.id));
              if (existingPost) {
                const merged: CCPost = {
                  ...existingPost,
                  likedBy: updatedPost.liked_by || [],
                  likes: (updatedPost.liked_by || []).length
                };
                dispatch(updatePost(merged));
              }
            }
          }
        )
        .subscribe();
    }

    const onUpdate = () => setPosts(getAllPosts());
    window.addEventListener("posts:update", onUpdate);
    
    return () => {
      window.removeEventListener("posts:update", onUpdate);
      if (realtimeChannel) {
        supabase?.removeChannel(realtimeChannel);
      }
    };
  }, [reduxPosts, dispatch]);

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
          <h1
            className="text-white font-satoshi font-bold text-[28px] sm:text-[45px] md:text-[60px] lg:text-[85px] leading-tight max-w-[900px]"
            style={{
              textShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 10px rgba(255,255,255,0.3)",
            }}
          >
            Your space to <br />share, interact and <br />discover
          </h1>
          <Button
            variant="hero"
            onClick={() => navigate('/feed/create-post')}
            className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 bg-white text-[#0077FF] border-2 border-[#0077FF]
              hover:bg-gradient-to-r hover:from-[#74EBD5] hover:to-[#9FACE6]
              hover:text-white hover:border-transparent transition-all duration-300"
          >
            Start sharing
          </Button>
        </div>
      </div>

      {/* Buscador */}
      <div className="container text-center mb-10">
        <div className="mx-auto max-w-[760px] mt-6 mb-2">
          <div className="relative">
            <div className="relative h-[48px] bg-[#007CFF] rounded-full border-[2px] border-white flex items-center px-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 bg-transparent text-white placeholder-white/90 outline-none text-[18px] sm:text-[20px] lg:text-[24px]"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex justify-center flex-wrap gap-6 sm:gap-10 mb-8 sm:mb-20 px-4">
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
              className={`!py-1.5 px-8  rounded-full border-[2px] outline-none ${active
                ? "bg-[#0066FF] text-white border-[#0066FF] shadow-[0_6px_18px_rgba(0,102,255,0.35)]"
                : "bg-transparent text-[#2091FF] border-[#2091FF] hover:bg-[#EAF5FF]"
                }`}
            >
              <span className="text-[14px] sm:text-[16px] lg:text-[18px]">{item}</span>
            </Button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="container flex flex-col items-center gap-8 sm:gap-12 px-4">
        {postsToShow.map((post) => {
          const { id, user, tag, content, files } = post;

          // 🔹 Separar título del contenido
          const lines = (content || "").split("\n");
          const title = lines[0]?.slice(0, 120);
          const body = lines.slice(1).join("\n");

          return (
            <div key={id} className="w-full max-w-[1200px]">
              <Card className="relative w-full bg-white rounded-2xl shadow-md shadow-black/5 p-6 sm:p-10 md:p-14 flex flex-col">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <img src={user?.avatar} alt={user?.name} className="w-[56px] h-[56px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover" />
                    <div>
                      <h2 className="text-[18px] sm:text-[20px] lg:text-[28px] font-satoshi font-bold text-[#565656] leading-tight">{user?.name}</h2>
                      <p className="text-[12px] sm:text-[14px] lg:text-[16px] text-[#7B8694]">
                        {(() => {
                          const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
                          if (!isObj(user)) return 'Student';
                          const u = user as Record<string, unknown>;
                          const program = typeof u.program === 'string' ? u.program : (typeof u.major === 'string' ? u.major : 'Program');
                          const term = typeof u.term === 'string' ? u.term : (typeof u.semester === 'string' ? u.semester : 'Term');
                          return `${program} | ${term}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto text-right text-[#A1A1A1] text-[12px] sm:text-[13px] md:text-[14px]">
                    {(() => {
                      const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
                      let val: unknown = undefined;
                      if (isObj(post) && 'createdAt' in post) val = (post as Record<string, unknown>).createdAt;
                      const d = val ? new Date(String(val)) : new Date();
                      return d.toLocaleDateString();
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 sm:mt-8">
                  <img src={spark} alt="spark" className="w-[20px] h-[20px] sm:w-[25px] sm:h-[25px]" />
                  <h3 className="text-[20px] sm:text-[28px] lg:text-[36px] font-satoshi font-bold text-[#454545] leading-tight">{title}</h3>
                </div>

                {/* Categoría */}
                <div className="mt-3 sm:mt-4">
                  <Button variant="label" className="px-3 py-1 text-sm inline-flex items-center justify-center gap-2">
                    <img
                      src={tagIcons[tag || "Default"]}
                      className={`${tag === "Science" ? "w-5 h-[14px]" : "w-5 h-5"} inline-block`}
                      alt={tag || "tag"}
                    />
                    <span className="text-[14px] sm:text-[16px] lg:text-[18px] leading-none">{tag || "General"}</span>
                  </Button>
                </div>

                {/* Contenido */}
                <p className="mt-6 sm:mt-2 text-[18px] sm:text-[20px] lg:text-[24px] font-sarala text-[#565656] leading-relaxed whitespace-pre-line">{body}</p>

                {/* Archivos */}
                <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
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
                      <span className="font-sarala text-[16px] sm:text-[18px] lg:text-[20px] text-[#565656]">{file.label || String(file.url).split('/').pop()}</span>
                    </a>
                  ))}
                </div>

                {/* Like y Comentarios */}
                <div className="flex items-center gap-3 mt-6 sm:mt-12">
                  <button
                    onClick={async () => {
                      try {
                        const userId = (authUser as any)?.id || (authUser as any)?.userId || '';
                        await dispatch(toggleLikeAction({ postId: String(post.id), userId }));
                      } catch (err) {
                        console.warn('Like toggle failed:', err);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-2 sm:px-4 h-[34px] sm:h-[42px] rounded-full border bg-[#F1F4F9] border-[#E6E8EE] text-[14px] sm:text-[16px] lg:text-[18px] transition-transform active:scale-95"
                  >
                    <img
                      src={isLikedByMe(post) ? "/src/Assets/like-red.png" : "/src/Assets/like.svg"}
                      alt="like"
                      className="w-5 sm:w-5 lg:w-5 h-5 sm:h-5 lg:h-5"
                    />
                    <span className="text-[#667085] text-[14px] sm:text-[16px] lg:text-[18px]">{post.likes ?? 0}</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById(`attach-${id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="inline-flex items-center gap-2 px-2 sm:px-4 h-[34px] sm:h-[42px] rounded-full border text-[14px] sm:text-[16px] lg:text-[18px] transition-transform active:scale-95 bg-[#F1F4F9] border-[#E6E8EE]"
                    title="Comments"
                  >
                    <img src={commentIcon} alt="comments" className="w-5 sm:w-6 lg:w-6 h-5 sm:h-6 lg:h-6 opacity-80" />
                    <span className="text-[#667085] text-[14px] sm:text-[16px] lg:text-[18px]">{post.comments ?? 0}</span>
                  </button>
                </div>



                {/* Composer */}
                <div className="mt-4 sm:mt-6">
                  <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">

                    {/* 🟦 INPUT + BOTONES (en desktop están dentro — en móvil fuera) */}
                    <div className="flex items-center gap-3 w-full relative">

                      {/* Avatar */}
                      <img
                        src={(authUser as any)?.avatar || "/src/Assets/user2.png"}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        alt="you"
                      />

                      {/* Input con espacio para los botones */}
                      <input
                        placeholder="Write a comment..."
                        value={drafts[id] || ""}
                        onChange={(e) =>
                          setDrafts((s) => ({ ...s, [id]: e.target.value }))
                        }
                        className="
          flex-1 border border-[#E6E8EE] rounded-full px-4 py-4
          text-[14px] sm:text-[18px] outline-none w-full
          pr-[120px]         /* 🟦 espacio para botones dentro del input */
          sm:pr-[0px]        /* 🟧 en móvil NO deja espacio — botones bajan */
        "
                      />

                      {/* 🟦 Botones dentro del input (solo desktop/tablet) */}
                      <div className="
        hidden sm:flex         /* solo se muestra en >= sm */
        items-center gap-3
        absolute right-4
      ">
                        {/* File input (hidden) */}
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
                              type: f.type.includes("pdf") ? "pdf" : "img",
                              url,
                              label: f.name,
                            };
                            setDraftsAttachments((s) => ({
                              ...s,
                              [id]: [...(s[id] || []), fileShape],
                            }));
                            (e.target as HTMLInputElement).value = "";
                          }}
                        />

                        {/* Clip inside input */}
                        <button
                          onClick={() =>
                            document.getElementById(`attach-${id}`)?.click()
                          }
                          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#ececec] bg-white"
                        >
                          <img src={clipIcon} className="w-6 h-6" />
                        </button>

                        {/* Post inside input */}
                        <button
                          onClick={() => {
                            const textVal = (drafts[id] || "").trim();
                            const attachmentsVal = draftsAttachments[id] || [];

                            const commenter = (authUser as any) || null;
                            const newComment = {
                              id: `c_${Date.now()}`,
                              text: textVal,
                              user: commenter
                                ? { name: commenter.name, avatar: commenter.avatar }
                                : undefined,
                              createdAt: new Date().toISOString(),
                              attachments: attachmentsVal.length
                                ? attachmentsVal
                                : undefined,
                            };

                              (async () => {
                                try {
                                  const userId = (authUser as any)?.id || null;
                                  const created = await supabaseApi.createComment(String(id), userId, textVal, attachmentsVal as any[]);
                                  const commentToAdd = created || newComment;
                                  dispatch(addComment({ postId: String(id), comment: commentToAdd }));
                                  setDrafts((s) => ({ ...s, [id]: "" }));
                                  setDraftsAttachments((s) => ({
                                    ...s,
                                    [id]: [],
                                  }));
                                } catch (err) { console.warn(err); }
                              })();
                          }}
                          className="px-5 py-2 rounded-full bg-[#1E90FF] text-white text-[18px] font-medium"
                        >
                          Post
                        </button>
                      </div>
                    </div>

                    {/* 📎 Preview of attached files */}
                    {draftsAttachments[id] && draftsAttachments[id].length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {draftsAttachments[id].map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                            <img
                              src={
                                file.type === "pdf"
                                  ? "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                  : "https://cdn-icons-png.flaticon.com/512/337/337940.png"
                              }
                              className="w-5 h-5"
                              alt="file icon"
                            />
                            <span className="text-sm text-gray-700">{file.label}</span>
                            <button
                              onClick={() => {
                                setDraftsAttachments((s) => ({
                                  ...s,
                                  [id]: s[id].filter((_, i) => i !== idx),
                                }));
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 text-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 🟧 Botones móviles — debajo y centrados */}
                    <div className="
      sm:hidden               /* solo móvil */
      flex justify-center gap-4 mt-3
    ">
                      <button
                        onClick={() =>
                          document.getElementById(`attach-${id}`)?.click()
                        }
                        className="w-12 h-12 flex items-center justify-center rounded-full border border-[#ececec] bg-white"
                      >
                        <img src={clipIcon} className="w-6 h-6" />
                      </button>

                      <button
                        onClick={() => {
                          const textVal = (drafts[id] || "").trim();
                          const attachmentsVal = draftsAttachments[id] || [];

                          const commenter = (authUser as any) || null;
                          const newComment = {
                            id: `c_${Date.now()}`,
                            text: textVal,
                            user: commenter
                              ? { name: commenter.name, avatar: commenter.avatar }
                              : undefined,
                            createdAt: new Date().toISOString(),
                            attachments: attachmentsVal.length
                              ? attachmentsVal
                              : undefined,
                          };

                          (async () => {
                            try {
                              const userId = (authUser as any)?.id || null;
                              const created = await supabaseApi.createComment(String(id), userId, textVal, attachmentsVal as any[]);
                              const commentToAdd = created || newComment;
                              dispatch(addComment({ postId: String(id), comment: commentToAdd }));
                              setDrafts((s) => ({ ...s, [id]: "" }));
                              setDraftsAttachments((s) => ({ ...s, [id]: [] }));
                            } catch (err) { console.warn(err); }
                          })();
                        }}
                        className="px-6 py-2 rounded-full bg-[#1E90FF] text-white text-[18px] font-medium"
                      >
                        Post
                      </button>
                    </div>

                  </div>
                </div>

                {/* Comentarios */}
                <div className="mt-4 sm:mt-6 space-y-4">
                  {(post.commentsList ?? []).map((c) => (
                    <div key={c.id} className="flex items-start gap-4 bg-[#FBFCFF] rounded-2xl p-4 sm:p-5">
                      <img
                        src={c.user?.avatar || "/src/Assets/user2.png"}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                      />

                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 text-[15px] sm:text-[16px] lg:text-[18px] text-[#2B2F36] font-semibold">
                          <span>{c.user?.name || "Anonymous"}</span>
                          {c.createdAt && (
                            <span className="text-[13px] sm:text-[14px] lg:text-[15px] text-[#8C8C8C]">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#565656] mt-2 leading-relaxed whitespace-pre-line">
                          {c.text}
                        </p>

                        {Array.isArray(c.attachments) && c.attachments.length > 0 && (
                          <div className="mt-2 flex gap-3 flex-wrap">
                            {c.attachments.map((a: PostFile, ai: number) => (
                              <a
                                key={ai}
                                href={a.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 px-4 py-2 bg-white border rounded-lg"
                              >
                                <img
                                  src={
                                    a.type === "pdf"
                                      ? "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                      : "https://cdn-icons-png.flaticon.com/512/337/337940.png"
                                  }
                                  className="w-6 h-6 sm:w-7 sm:h-7"
                                />
                                <span className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#565656]">
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


              </Card>
            </div>
          );
        })}

        {/* 🆕 5. Botón "Ver más / Ver menos" */}
        {filteredPosts.length > POSTS_PER_PAGE && (
          <div className="mt-6 mb-12">
            <Button
              variant="hero"
              onClick={() => {
                if (visiblePostCount >= filteredPosts.length) {
                  setVisiblePostCount(POSTS_PER_PAGE); // Ver menos
                } else {
                  setVisiblePostCount((prev) => prev + POSTS_PER_PAGE); // Ver más
                }
              }}
              className="px-6 py-2 text-[16px] sm:text-[18px] lg:text-[20px] font-bold bg-[#0077FF] text-white rounded-full
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
