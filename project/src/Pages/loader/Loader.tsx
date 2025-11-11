import React from "react";

export default function Loader() {
  return (
    <section
      className="fixed inset-0 z-40 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/src/Assets/loader-bg.png')", // 🔁 Cambia esta imagen de fondo
        backgroundColor: "#0088FF",
      }}
    >
      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Logo + Texto-imagen */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <img
            src="/src/Assets/logo gif.gif" // 🔁 Logo del ícono
            alt="CampusCircle icon"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain"
          />

          <img
            src="/src/Assets/campuscircle-short-logo.png" // 🔁 Texto como imagen
            alt="CampusCircle text"
            className="w-[200px] sm:w-[280px] md:w-[380px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
