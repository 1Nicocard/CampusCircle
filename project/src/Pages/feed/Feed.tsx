import React, { useMemo, useState } from "react";
import Card from "../../Components/Card";
import { Button } from "../../Components/Button";
import star from "../../Assets/Star.png";
import mockData from "../../Data/mockData.json";
import { Paperclip } from "lucide-react";

export default function Feed() {
  // Función para crear estado independiente de comentarios por post
  type CommentData = {
    text: string;
    file?: File | null;
    fileUrl?: string | null;
  };

const [searchQuery, setSearchQuery] = useState("");
type Category = "All" | "Art" | "Literature" | "Math" | "Science" | "Social";
const [selectedCats, setSelectedCats] = useState<Category[]>(["All"]);



const filteredPosts = useMemo(() => {
  const q = searchQuery.trim().toLowerCase();
  const usingAll = selectedCats.length === 0 || selectedCats.includes("All");

  return mockData.filter((p) => {
    const text = `${p.title} ${p.content} ${p.user.name} ${p.category}`.toLowerCase();
    const matches = !q || text.includes(q);
    const inCategory = usingAll ? true : selectedCats.includes(p.category as Category);
    return inCategory && matches;
  });
}, [searchQuery, selectedCats]);



  const [commentsByPost, setCommentsByPost] = useState<{
    [postId: number]: CommentData[];
  }>({});


  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePublish = (postId: number) => {
    if (!comment.trim() && !file) return;

    const localUrl = file ? URL.createObjectURL(file) : null;

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        { text: comment.trim(), file, fileUrl: localUrl },
      ],
    }));

    setComment("");
    setFile(null);
  };

  const getFileIcon = (file?: File | null) => {
    if (!file) return null;

    const iconSrc =
      file.type === "application/pdf"
        ? "https://cdn-icons-png.flaticon.com/512/337/337946.png"
        : file.type.startsWith("image/")
          ? "https://cdn-icons-png.flaticon.com/512/337/337940.png"
          : "https://cdn-icons-png.flaticon.com/512/337/337946.png";

    return (
      <img
        src={iconSrc}
        alt={file.type}
        className="inline-block w-5 h-5 mr-2 align-middle"
      />
    );
  };

  return (
    <section className="w-full flex flex-col items-center">
      {/* 🟦 Banner superior */}
      <div className="relative w-full">
        <picture>
          <source media="(max-width: 668px)" srcSet="/src/Assets/banner-mobile.png" />
          <img
            src="/src/Assets/banner.png"
            alt="CampusCircle banner"
            className="w-full h-auto object-cover"
          />
        </picture>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6
        translate-y-[-60px] sm:translate-y-[-80px] md:translate-y-[-100px]"
        >
          <h1
            className="text-white font-satoshi font-bold
            text-[35px] sm:text-[59px] md:text-[60px] lg:text-[85px]
            leading-tight max-w-[900px]"
          >
            Your space to <br />share, interact and <br />discover
          </h1>
          <Button
              variant="hero"
              className="mt-8 sm:mt-12 md:mt-16 lg:mt-20
                 bg-white text-[#0077FF]
                border-2 border-[#0077FF]
                hover:bg-gradient-to-r hover:from-[#74EBD5] hover:to-[#9FACE6]
                 hover:text-white hover:border-transparent
                 transition-all duration-300"
>
  Start sharing
</Button>
        </div>
      </div>

      {/*  Contenedor principal */}
     <div className="container text-center mb-12">
  {/* BÚSQUEDA */}
  <div className="mx-auto max-w-[760px] mt-6 mb-6">
  <div className="relative">
    <div className="absolute -inset-1 rounded-full bg-white/70 blur-[2px] pointer-events-none" />
    <div className="relative h-[48px] bg-[#007CFF] rounded-full border-[2px] border-white flex items-center px-5">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className="flex-1 bg-transparent text-white placeholder-white/90 outline-none text-base sm:text-lg md:text-xl"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    </div>
  </div>
</div>
</div>


  {/* FILTROS */}
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
        className={`h-[32px] px-4 rounded-full border-[2px] outline-none
          ${active
            ? "bg-[#0066FF] text-white border-[#0066FF] shadow-[0_6px_18px_rgba(0,102,255,0.35)]"
            : "bg-transparent text-[#2091FF] border-[#2091FF] hover:bg-[#EAF5FF]"}
        `}
      >
        {item}
      </Button>
    );
  })}
</div>







        {/* Cards del feed */}
        <div className="container flex flex-col items-center gap-16">
          {filteredPosts.map((post) => {
            const { id, user, date, category, title, content, attachments } = post;
            const comments = commentsByPost[id] || [];

            return (
              <main key={id} className="w-full max-w-[1200px]">
                <Card className="relative w-full bg-white rounded-2xl shadow-md shadow-black/5 p-10 md:p-14 flex flex-col">
                  {/* Encabezado */}
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-[26px] md:text-[32px] font-satoshi font-bold text-[#565656] leading-tight">
                          {user.name}
                        </h2>
                        <p className="text-[18px] md:text-[22px] font-satoshi font-medium text-[#949494]">
                          {user.role} | {user.semester}
                        </p>
                      </div>
                    </div>

                    <p className="text-[18px] md:text-[22px] font-satoshi font-bold text-[#949494]">
                      {new Date(date).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  {/* Título */}
                  <div className="flex items-center gap-2 mt-8">
                    <img
                      src={star}
                      alt="star"
                      className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]"
                    />
                    <h3 className="text-[36px] md:text-[50px] font-satoshi font-bold text-[#454545]">
                      {title}
                    </h3>
                  </div>

                  {/* Categoría */}
                  <div className="mt-4">
                    <Button variant="label">{category}</Button>
                  </div>

                  {/* Contenido */}
                  <p className="mt-10 text-[20px] md:text-[24px] font-sarala text-[#565656] leading-relaxed">
                    {content}
                  </p>

                  {/* Archivos adjuntos */}
                  <div className="flex flex-wrap gap-4 mt-10">
                    {attachments.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors hover:text-gray-700"
                      >
                        <img
                          src={
                            file.type === "pdf"
                              ? "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                              : "https://cdn-icons-png.flaticon.com/512/337/337940.png"
                          }
                          alt={file.type}
                          className="w-5 h-5"
                        />
                        <span className="font-sarala text-[20px] md:text-[24px] text-[#565656]">
                          {file.name}
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Reacciones */}
                    <div className="flex items-center gap-4 mt-8">
                    {/* Like: interactivo */}
                      <Button variant="reaction" reactionType="like" />

                      <Button
                        variant="reaction"
                        reactionType="comment"
                        controlledCount={(commentsByPost[id] || []).length}
                        readOnly
                        title="Comments"
                      />
                    </div>

                  {/* Línea */}
                  <div
                    className="my-12 w-full max-w-[1304px] h-[2px] mx-auto rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #FFFFFF 0%, #CFCFCF 10%, #CFCFCF 90%, #FFFFFF 100%)",
                    }}
                  ></div>

                  {/* Comentarios */}
                  <div className="mt-6 flex flex-col gap-6">
                    {/* Input comentario */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                      <img
                        src="/src/Assets/Foto user.jpg"
                        alt="User avatar"
                        className="w-[55px] h-[55px] md:w-[67px] md:h-[67px] rounded-full object-cover"
                      />


                      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 min-w-0 rounded-full px-5 py-3 text-lg sm:text-xl md:text-2xl font-sarala focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400"
                        />

                        <div className="flex items-center gap-3 sm:justify-end">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <div className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                              <Paperclip size={32} className="text-gray-600" />
                            </div>
                          </label>

                          <Button variant="secondary" onClick={() => handlePublish(id)}>
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Lista comentarios */}
                    <div className="mt-4 flex flex-col gap-4">
                      {[...comments].reverse().map((c, i) => (
                        <div
                          key={i}
                          className="flex items-start sm:items-center gap-3 sm:gap-4 bg-gray-50 p-4 sm:p-5 rounded-xl flex-wrap"
                        >
              
                          <img
                            src="/src/Assets/Foto user.jpg"
                            alt="comment avatar"
                            className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full object-cover"
                          />
                          <div className="flex flex-col flex-1 min-w-[200px] break-words">
                            <p className="text-[20px] sm:text-[24px] lg:text-[26px] font-sarala text-[#565656] leading-snug">
                              {c.text}
                            </p>
                            {c.file && c.fileUrl && (
                              <a
                                href={c.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 mt-2 text-[#565656] font-sarala text-[20px] hover:underline"
                              >
                                {getFileIcon(c.file)}
                                <span className="truncate">{c.file.name}</span>
                              </a>
                            )}

                          </div>
                        </div>
                      ))}
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
