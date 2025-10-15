import Card from "../../Components/Card";
import { Button } from "../../Components/Button";
import star from "../../Assets/Star.png";
import mockData from "../../Data/mockData.json";

export default function Feed() {
  const post = mockData[0];
  const { user, date, category, title, content, attachments } = post;

  return (
    <section className="w-full flex flex-col items-center bg-white">
      {/* 🟦 Banner superior */}
      <div className="w-full">
        <img
          src="/src/Assets/banner.png"
          alt="CampusCircle banner"
          className="w-full h-auto object-cover"
        />
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
          <main className="w-full max-w-[900px]">
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
                <Button variant="reaction" count={19} />
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

              {/* Comentario */}
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt="comment user"
                  className="w-[55px] h-[55px] md:w-[67px] md:h-[67px] rounded-full object-cover"
                />
                <p className="font-sarala text-[20px] md:text-[24px] text-[#565656]">
                  Text comment
                </p>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </section>
  );
}
