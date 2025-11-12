import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Card";
import { Button } from "../../Components/Button";
const tagIcons: Record<string, string> = {
  Design: "/src/Assets/design.svg",
  Literature: "/src/Assets/literature.svg",
  Math: "/src/Assets/math.svg",
  Science: "/src/Assets/science.svg",
  Social: "/src/Assets/social.svg",
  Default: "/src/Assets/Star.png",
};
const commentIcon = "/src/Assets/comment.png";
const spark = "/src/Assets/icons/spark.svg";
import mockData from "../../Data/mockData.json";
import { getCurrentUser } from "../../lib/auth";
import {
  getAllPosts,
  toggleLike,
  saveAllPosts,
  isLikedByMe,
  type Post as CCPost,
  type PostFile,
} from "../../lib/postStore";
export default function Feed() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<CCPost[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [draftsAttachments, setDraftsAttachments] = useState<Record<string, PostFile[]>>({});
  type Category = "All" | "Art" | "Literature" | "Math" | "Science" | "Social";
  const [selectedCats, setSelectedCats] = useState<Category[]>(["All"]);

  // Cargar posts desde localStorage al montar y sembrar si está vacío
  useEffect(() => {
    const refresh = () => setPosts(getAllPosts());
    // Seed initial posts if none exist
    const existing = getAllPosts();
    if (!existing || existing.length === 0) {
      type SeedShape = { posts?: CCPost[] };
      const seed = mockData as SeedShape | CCPost[];
      const seeded = Array.isArray(seed) ? (seed as CCPost[]) : (seed && Array.isArray((seed as SeedShape).posts) ? (seed as SeedShape).posts as CCPost[] : []);
      try {
        localStorage.setItem("posts", JSON.stringify(seeded));
      } catch (err) { void err; }
    }
    refresh();

    // Escuchar actualizaciones globales de posts (likes, nuevos, etc.)
    const onUpdate = () => refresh();
    window.addEventListener("posts:update", onUpdate);
    return () => window.removeEventListener("posts:update", onUpdate);
  }, []);

  // Filtrado
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const usingAll = selectedCats.length === 0 || selectedCats.includes("All");

    return posts.filter((p) => {
      const text = `${p.content || ""} ${p.user?.name || ""} ${p.tag || ""}`.toLowerCase();
      const matches = !q || text.includes(q);
      const inCategory = usingAll ? true : selectedCats.includes((p.tag || "All") as Category);
      return inCategory && matches;
    });
  }, [searchQuery, selectedCats, posts]);

  type FileShape = { url: string; type?: string; label?: string };

  return (
    <section className="w-full flex flex-col items-center">
      {/* Banner y búsqueda */}
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

      {/* Contenedor búsqueda */}
      <div className="container text-center mb-12">
        <div className="mx-auto max-w-[760px] mt-6 mb-6">
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
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {(["All", "Art", "Literature", "Math", "Science", "Social"] as const).map((item) => {
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
              className={`h-[32px] px-4 rounded-full border-[2px] outline-none ${
                active
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
        {filteredPosts.map((post) => {
          const { id, user, tag, content, files } = post;
          const title = (content || "").split("\n")[0]?.slice(0, 120);

          return (
            <main key={id} className="w-full max-w-[1200px]">
              <Card className="relative w-full bg-white rounded-2xl shadow-md shadow-black/5 p-10 md:p-14 flex flex-col">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img src={user?.avatar} alt={user?.name} className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover" />
                    <div>
                      <h2 className="text-[26px] md:text-[32px] font-satoshi font-bold text-[#565656] leading-tight">{user?.name}</h2>
                      <p className="text-[18px] md:text-[22px] font-satoshi font-medium text-[#949494]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="flex items-center gap-2 mt-8">
                  <img src={spark} alt="spark" className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
                  <h3 className="text-[36px] md:text-[50px] font-satoshi font-bold text-[#454545]">{title}</h3>
                </div>

                {/* Categoría */}
                <div className="mt-4">
                  <Button variant="label">
                    <img src={tagIcons[tag || "Default"]} className="w-5 h-5 mr-2 inline-block" alt={tag || "tag"} />
                    {tag || "General"}
                  </Button>
                </div>

                {/* Contenido */}
                  <p className="mt-10 text-[20px] md:text-[24px] font-sarala text-[#565656] leading-relaxed">{content}</p>

                {/* Archivos adjuntos */}
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

                {/* Reacciones */}
                <div className="flex items-center gap-4 mt-8">
  {/* LIKE: persistente y sincronizado */}
  <button
    onClick={() => {
      try {
        const updated = toggleLike(String(post.id));
        if (updated) setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } catch (e) {
        console.warn(e);
      }
    }}
    className={`inline-flex items-center gap-2 px-3 h-[34px] rounded-full border text-[14px] transition-transform active:scale-95 ${
      isLikedByMe(post) ? "bg-[#FFF4F4] border-red-200" : "bg-[#F1F4F9] border-[#E6E8EE]"
    }`}
  >
  <img src="/src/Assets/like.svg" alt="like" className={`w-4 h-4 ${isLikedByMe(post) ? "opacity-100" : "opacity-60"}`} />
    <span className={isLikedByMe(post) ? "text-[#DC2626] font-medium" : "text-[#667085]"}>{post.likes ?? 0}</span>
  </button>

  {/* COMMENTS (counter) - match like button sizing and use comment asset */}
  <button
    onClick={() => {
      // scroll to comments or focus composer could be implemented; for now noop
      const el = document.getElementById(`attach-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }}
    className={`inline-flex items-center gap-2 px-3 h-[34px] rounded-full border text-[14px] transition-transform active:scale-95 bg-[#F1F4F9] border-[#E6E8EE]`}
    title="Comments"
  >
    <img src={commentIcon} alt="comments" className="w-4 h-4 opacity-80" />
    <span className="text-[#667085]">{post.comments ?? 0}</span>
  </button>
</div>

                {/* Comments list */}
                <div className="mt-6 space-y-4">
                  {(post.commentsList || []).map((c) => (
                    <div key={c.id} className="flex items-start gap-3 bg-[#FBFCFF] rounded-xl p-3">
                      <img src={c.user?.avatar || "/src/Assets/user2.png"} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="text-[14px] text-[#2B2F36] font-medium">{c.user?.name || "Anonymous"}</div>
                        <div className="text-[15px] text-[#565656]">{c.text}</div>
                        {/* comment attachments */}
                        {Array.isArray(c.attachments) && c.attachments.length > 0 && (
                          <div className="mt-2 flex gap-3">
                            {c.attachments.map((a, ai) => (
                              <a key={ai} href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md">
                                <img src={a.type === 'pdf' ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' : 'https://cdn-icons-png.flaticon.com/512/337/337940.png'} className="w-5 h-5" />
                                <span className="text-sm text-[#565656]">{a.label || String(a.url).split('/').pop()}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment composer inside the Card */}
                <div className="mt-6">
                  <div className="bg-white rounded-2xl border border-[#E6E8EE] p-4 flex items-start gap-4">
                    <img src={getCurrentUser()?.avatar || "/src/Assets/user2.png"} className="w-10 h-10 rounded-full object-cover" alt="you" />
                    <input
                      placeholder="Write a comment..."
                      value={drafts[id] || ""}
                      onChange={(e) => setDrafts((s) => ({ ...s, [id]: e.target.value }))}
                      className="flex-1 border border-transparent rounded-full px-4 py-3 outline-none text-[15px]"
                    />
                    {/* attach input (hidden) */}
                    <input
                      id={`attach-${id}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        if (!f) return;
                        const url = URL.createObjectURL(f);
                        const fileShape: PostFile = { id: `f_${Date.now()}`, type: f.type.includes('pdf') ? 'pdf' : 'img', url, label: f.name };
                        setDraftsAttachments((s) => ({ ...s, [id]: [...(s[id] || []), fileShape] }));
                        // reset input value so same file can be attached again if needed
                        (e.target as HTMLInputElement).value = '';
                      }}
                    />
                    <button
                      onClick={() => document.getElementById(`attach-${id}`)?.click()}
                      className="ml-2 inline-flex items-center px-3 py-2 rounded-full bg-white border border-[#E6E8EE]"
                      title="Attach file"
                    >
                      📎
                    </button>
                    <button
                      onClick={() => {
                        const text = (drafts[id] || "").trim();
                        const attachments = draftsAttachments[id] || [];
                        if (!text && attachments.length === 0) return;
                        // update posts: add comment object with attachments
                        const all = getAllPosts();
                        const i = all.findIndex((p) => String(p.id) === String(id));
                        if (i === -1) return;
                        const next = [...all];
                        const commenter = getCurrentUser();
                        const newComment = {
                          id: `c_${Date.now()}`,
                          text,
                          user: commenter ? { name: commenter.name, avatar: commenter.avatar } : undefined,
                          createdAt: new Date().toISOString(),
                          attachments: attachments.length ? attachments : undefined,
                        };
                        const existing = Array.isArray(next[i].commentsList) ? [...next[i].commentsList] : [];
                        const newList = [...existing, newComment];
                        next[i] = { ...next[i], comments: newList.length, commentsList: newList } as CCPost;
                        try {
                          saveAllPosts(next);
                          setPosts(next);
                          setDrafts((s) => ({ ...s, [id]: "" }));
                          setDraftsAttachments((s) => ({ ...s, [id]: [] }));
                        } catch (err) {
                          console.warn(err);
                        }
                      }}
                      className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E6E8EE] text-[#1E90FF]"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </Card>
            </main>
          );
        })}
      </div>
    </section>
  );
}
