import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loader: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/landing"), 3000); // 3 segundos
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section
      className="fixed inset-0 z-40 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/src/Assets/loader-bg.png')",
        backgroundColor: "#0088FF",
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <img
            src="/src/Assets/logo gif.gif"
            alt="CampusCircle icon"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain"
          />
          <img
            src="/src/Assets/campuscircle-short-logo.png"
            alt="CampusCircle text"
            className="w-[200px] sm:w-[280px] md:w-[380px] object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Loader;
