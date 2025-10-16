import { useState } from "react";
import "../styles/Global.css";
import Logo from "../Assets/Logo completo.png";

const Navbar = () => {
  const [active, setActive] = useState("Home");

  return (
    <header className="w-full fixed top-0 left-0 z-[9999] flex justify-center items-center mt-8 px-4">
      {/* ========= NAV DESKTOP ========= */}
      <div className="hidden md:flex relative justify-center items-center w-full max-w-[1202px]">
        {/* Fondo glass */}
        <div className="absolute w-full h-[113px] bg-[#0077FF]/10 rounded-[55px] backdrop-blur-md"></div>

        {/* Barra principal */}
        <nav className="relative flex items-center justify-between w-[95%] max-w-[1168.75px] h-[81.91px] bg-[#0077FF] border-[3px] border-white rounded-[85px] px-6 lg:px-10 text-white overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          {/* Logo */}
          <div className="flex items-center min-w-[180px]">
            <img
              src={Logo}
              alt="CampusCircle logo"
              className="w-[240px] md:w-[280px] lg:w-[342.42px] h-auto object-contain"
            />
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center justify-center gap-[35px] lg:gap-[53px] font-satoshi font-bold text-[18px] lg:text-[25px]">
            {["About us", "Home", "Profile"].map((link) => (
              <button
                key={link}
                onClick={() => setActive(link)}
                className={`relative ${
                  active === link
                    ? "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:bg-white"
                    : ""
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* ======= Botón con dropdown ======= */}
          <div className="relative group">
            <button
              className="
                relative
                w-[160px] sm:w-[180px] lg:w-[213px] h-[50px] sm:h-[55px] lg:h-[58px]
                rounded-[2000px]
                font-ABeeZee text-[18px] sm:text-[20px] lg:text-[24px] text-white
                flex justify-center items-center
                opacity-62
                transition-all duration-300
                bg-[linear-gradient(180deg,_rgba(2,112,238,0.93)_0%,_rgba(112,179,255,1)_68%,_rgba(225,242,255,1)_100%)]
                border-[2px] border-transparent
                hover:border-white
                hover:shadow-[0_2px_20px_rgba(255,255,255,1)]
                box-border
                overflow-hidden
              "
              style={{ backgroundClip: "padding-box" }}
            >
              Create Post
            </button>

            {/* Dropdown (aparece al hacer hover) */}
            <div
              className="
                absolute left-1/2 -translate-x-1/2 top-[70px]
                bg-white text-[#0077FF] rounded-[20px] shadow-lg
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-300 ease-in-out
                w-[200px] py-3 text-center font-satoshi font-semibold text-[16px]
              "
            >
              <ul className="flex flex-col gap-2">
                <li className="hover:bg-[#0077FF]/10 py-2 rounded-md cursor-pointer transition">
                  New Photo
                </li>
                <li className="hover:bg-[#0077FF]/10 py-2 rounded-md cursor-pointer transition">
                  New Video
                </li>
                <li className="hover:bg-[#0077FF]/10 py-2 rounded-md cursor-pointer transition">
                  New Article
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* ========= NAV MOBILE ========= */}
      <div className="flex md:hidden fixed bottom-6 left-0 w-full justify-center items-center z-[9999] px-4">
        <div className="relative flex justify-center items-center w-full max-w-[440px]">
          {/* Fondo glass */}
          <div className="absolute w-full h-[96px] bg-[#0077FF]/10 rounded-[55px] backdrop-blur-md"></div>

          {/* Contenedor principal */}
          <div className="relative w-full max-w-[390px] h-[70px] bg-[#0077FF] border-[3px] border-white rounded-[85px] flex items-center justify-around px-4 sm:px-6 text-[#4EB2FF] shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            
            {/* Landing */}
            <button
              onClick={() => setActive("Star")}
              className={`transition-all ${
                active === "Star"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[28px] sm:h-[32px] w-[28px] sm:w-[32px]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2.5L13.8 10.2 21.5 12 13.8 13.8 12 21.5 10.2 13.8 2.5 12 10.2 10.2 12 2.5Z"
                />
              </svg>
            </button>

            {/* Home */}
            <button
              onClick={() => setActive("Home")}
              className={`transition-all ${
                active === "Home"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[28px] sm:h-[32px] w-[28px] sm:w-[32px]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9.75L12 3l9 6.75V21H3V9.75z"
                />
              </svg>
            </button>

            {/* Create post */}
            <button
              onClick={() => setActive("Add")}
              className={`transition-all ${
                active === "Add"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[28px] sm:h-[32px] w-[28px] sm:w-[32px]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Perfil */}
            <button
              onClick={() => setActive("User")}
              className={`transition-all ${
                active === "User"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[28px] sm:h-[32px] w-[28px] sm:w-[32px]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4a4 4 0 110 8 4 4 0 010-8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 20a8 8 0 0116 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
