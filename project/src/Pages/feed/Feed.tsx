import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Card";
import { Button } from "../../Components/Button";
import star from "../../Assets/Star.png";
import mockData from "../../Data/mockData.json";

function Feed() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  type Attachment = { name: string; type: string; url: string };
  type PostType = { id: string | number; user: { name: string; avatar?: string; semester?: string }; category?: string; title?: string; content?: string; attachments?: Attachment[] };
  const [posts, setPosts] = useState<PostType[]>([]);
  type Category = "All" | "Art" | "Literature" | "Math" | "Science" | "Social";
  const [selectedCats, setSelectedCats] = useState<Category[]>(["All"]);

  // Cargar posts desde localStorage al montar
  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("posts") || "[]");
  if (stored.length > 0) {
    setPosts(stored);
    return;
  }
  // seed inicial con mockData
  const seeded = Array.isArray(mockData) ? mockData : (mockData as any)?.posts || [];
  localStorage.setItem("posts", JSON.stringify(seeded));
  setPosts(seeded);
}, []);

  // Actualizar posts si hay cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      setPosts(updatedPosts);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Filtrado
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const usingAll = selectedCats.length === 0 || selectedCats.includes("All");

    return posts.filter((p) => {
      const text = `${p.title} ${p.content} ${p.user.name} ${p.category}`.toLowerCase();
      const matches = !q || text.includes(q);
      const inCategory = usingAll ? true : selectedCats.includes(p.category as Category);
      return inCategory && matches;
    });
  }, [searchQuery, selectedCats, posts]);

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
          const { id, user, category, title, content, attachments } = post;

          return (
            <main key={id} className="w-full max-w-[1200px]">
              <Card className="relative w-full bg-white rounded-2xl shadow-md shadow-black/5 p-10 md:p-14 flex flex-col">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover" />
                    <div>
                      <h2 className="text-[26px] md:text-[32px] font-satoshi font-bold text-[#565656] leading-tight">{user.name}</h2>
                      <p className="text-[18px] md:text-[22px] font-satoshi font-medium text-[#949494]">
                        {user.semester}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="flex items-center gap-2 mt-8">
                  <img src={star} alt="star" className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
                  <h3 className="text-[36px] md:text-[50px] font-satoshi font-bold text-[#454545]">{title}</h3>
                </div>

                {/* Categoría */}
                <div className="mt-4">
                  <Button variant="label">{category}</Button>
                </div>

                {/* Contenido */}
                <p className="mt-10 text-[20px] md:text-[24px] font-sarala text-[#565656] leading-relaxed">{content}</p>

                {/* Archivos adjuntos */}
                <div className="flex flex-wrap gap-4 mt-10">
                  {(attachments || []).map((file: Attachment, index: number) => (
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
                      <span className="font-sarala text-[20px] md:text-[24px] text-[#565656]">{file.name}</span>
                    </a>
                  ))}
                </div>

                {/* Reacciones */}
                <div className="flex items-center gap-4 mt-8">
                  <Button variant="reaction" reactionType="like" />
                  <Button variant="reaction" reactionType="comment" readOnly title="Comments" />
                </div>
              </Card>
            </main>
          );
        })}
      </div>
    </section>
  );
}

export default Feed;
