import React, { useState } from "react";
import Card from "../../Components/Card";
import { Button } from "../../Components/Button";
import star from "../../Assets/Star.png";
import mockData from "../../Data/mockData.json";
import { Paperclip } from "lucide-react"; // Usa íconos del sistema


export default function Feed() {
  const post = mockData[0];
  const { user, date, category, title, content, attachments } = post;

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    { text: string; file?: File | null }[]
  >([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePublish = () => {
    if (!comment.trim() && !file) return;
    setComments([...comments, { text: comment.trim(), file }]);
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
          : "https://cdn-icons-png.flaticon.com/512/337/337946.png"; // ícono por defecto (PDF)

    return (
      <img
        src={iconSrc}
        alt={file.type}
        className="inline-block w-5 h-5 mr-2 align-middle"
      />
    );
  };



  return (
    <section className="w-full flex flex-col items-center bg-white">
      {/* 🟦 Banner superior */}
      <div className="relative w-full">
        {/* Imagen de fondo */}
        <img
          src="/src/Assets/banner.png"
          alt="CampusCircle banner"
          className="w-full h-auto object-cover"
        />

        {/* Capa de texto superpuesta */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center  px-6">
          <h1
            className="text-white font-satoshi font-bold 
      text-[28px] sm:text-[36px] md:text-[48px] lg:text-[80px] 
      leading-tight max-w-[1000px]"
          >
            Your space to <br />share, interact and <br />discover
          </h1>
          <Button
            variant="hero"
            onClick={handlePublish}
          >
            Start sharing
          </Button>
        </div>
      </div>


      {/* 🔵 Espacio para la barra y filtros */}
      <div className="w-full bg-[#F0F3FC] flex flex-col items-center -mt-8 pt-10 pb-20 rounded-t-[40px]">
        {/* Espacio simulado para barra y filtros */}
        <div className="container text-center mb-12">
          <div className="h-[60px] bg-white rounded-full shadow-sm mx-auto max-w-[800px] mb-8"></div>
          <div className="flex justify-center flex-wrap gap-4">
            <div className="w-[90px] h-[40px] bg-white rounded-full"></div>
            <div className="w-[90px] h-[40px] bg-white rounded-full"></div>
            <div className="w-[90px] h-[40px] bg-white rounded-full"></div>
            <div className="w-[90px] h-[40px] bg-white rounded-full"></div>
          </div>
        </div>

        {/* 🧩 Card centrada */}
        <div className="container flex justify-center">
          <main className="w-full max-w-[1200px]">
            <Card className="relative w-full bg-white rounded-2xl shadow-md shadow-black/5 p-10 md:p-14 flex flex-col">
              {/* Encabezado */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                {/* Usuario */}
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

                {/* Fecha */}
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
                <Button variant="reaction" />
                <Button variant="reaction" />
              </div>

              {/* Línea centrada */}
              <div
                className="my-12 w-full max-w-[1304px] h-[2px] mx-auto rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #FFFFFF 0%, #CFCFCF 10%, #CFCFCF 90%, #FFFFFF 100%)",
                }}
              ></div>

              {/* Comentarios */}
              <div className="mt-6 flex flex-col gap-6">
                {/* Input de comentario */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  {/* Avatar */}
                  <img
                    src={user.avatar}
                    alt="comment user"
                    className="w-[55px] h-[55px] md:w-[67px] md:h-[67px] rounded-full object-cover"
                  />

                  {/* Contenedor del input y botones */}
                  <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    {/* Input */}
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 min-w-0 rounded-full px-5 py-3 text-lg sm:text-xl md:text-2xl font-sarala focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400"
                    />

                    {/* Botones */}
                    <div className="flex items-center gap-3 sm:justify-end">
                      {/* Adjuntar archivo */}
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

                      {/* Publicar */}
                      <Button
                        variant="secondary"
                        onClick={handlePublish}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>


                {/* Lista de comentarios (último primero) */}
                <div className="mt-4 flex flex-col gap-4">
                  {[...comments].reverse().map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start sm:items-center gap-3 sm:gap-4 bg-gray-50 p-4 sm:p-5 rounded-xl flex-wrap"
                    >
                      {/* Avatar */}
                      <img
                        src={user.avatar}
                        alt="comment avatar"
                        className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full object-cover"
                      />

                      {/* Contenido */}
                      <div className="flex flex-col flex-1 min-w-[200px] sm:min-w-[300px] break-words">
                        <p className="text-[20px] sm:text-[24px] lg:text-[26px] font-sarala text-[#565656] leading-snug">
                          {c.text}
                        </p>

                        {c.file && (
                          <div className="flex items-center flex-wrap gap-2 mt-2 font-sarala text-[18px] sm:text-[22px] md:text-[24px] text-[#565656]">
                            {getFileIcon(c.file)}
                            <span className="truncate max-w-[180px] sm:max-w-[280px] md:max-w-[380px]">
                              {c.file.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Card>
          </main>
        </div>
      </div>
    </section>
  );
}
