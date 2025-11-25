import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Global.css";
import Logo from "../Assets/Logo completo.png";

const Navbar = () => {
  const [active, setActive] = useState(""); // Ningún link activo por defecto
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Actualiza la pestaña activa según la ruta
  useEffect(() => {
    if (location.pathname.startsWith("/profile") || location.pathname.startsWith("/feed/profile")) {
      setActive("Profile");
    } else if (location.pathname.includes("/create-post") || location.pathname === "/post") {
      setActive(""); // Ningún subrayado cuando estamos en Create Post
    } else if (location.pathname === "/" || location.pathname.startsWith("/feed")) {
      setActive("Home");
    } else if (location.pathname.startsWith("/landing")) {
      setActive("About");
    } else {
      setActive("");
    }
  }, [location.pathname]);

  return (
    <header className="w-full fixed top-0 left-0 z-[9999] flex justify-center items-center mt-8 px-4">
      {/* ========= NAV DESKTOP ========= */}
      <div className="hidden md:flex relative justify-center items-center w-full max-w-[1202px]">
        {/* Fondo glass */}
        <div className="absolute w-full h-[113px] bg-[#0077FF]/10 rounded-[55px] backdrop-blur-md"></div>

        {/* Barra principal */}
        <nav className="relative flex items-center justify-between w-[95%] max-w-[1168.75px] h-[81.91px] bg-[#0077FF] border-[3px] border-white rounded-[85px] px-6 lg:px-10 text-white overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          
          {/* Logo */}
          <div
            className="flex items-center min-w-[180px] cursor-pointer"
            onClick={() => navigate("/feed")}
          >
            <img
              src={Logo}
              alt="CampusCircle logo"
              className="w-[240px] md:w-[280px] lg:w-[342.42px] h-auto object-contain"
            />
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center justify-center gap-[35px] lg:gap-[53px] font-satoshi font-bold text-[18px] lg:text-[25px]">
            {["About", "Home", "Profile"].map((link) => (
              <button
                key={link}
                onClick={() => {
                  if (link === "Profile") navigate("/feed/profile");
                  if (link === "Home") navigate("/feed");
                  if (link === "About") navigate("/landing");
                }}
                className={`relative transition-all duration-300 ${
                  active === link
                    ? "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:bg-white"
                    : ""
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* 🔹 Botón principal "Create Post" */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => navigate("/feed/create-post")}
              className="
                relative
                w-[160px] sm:w-[180px] lg:w-[213px] h-[50px] sm:h-[55px] lg:h-[58px]
                rounded-[2000px]
                font-ABeeZee text-[18px] sm:text-[20px] lg:text-[24px] text-white
                flex justify-center items-center
                transition-all duration-300
                bg-gradient-to-b from-[#0270EE]/90 via-[#70B3FF] to-[#E1F2FF]
                hover:border-white hover:shadow-[0_2px_20px_rgba(255,255,255,1)] 
                overflow-hidden
              "
            >
              Create Post
            </button>

            {/* Dropdown */}
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
                {["Photo", "Video", "Article"].map((item) => (
                  <li
                    key={item}
                    onClick={() => navigate("/feed/create-post")}
                    className="hover:bg-[#0077FF]/10 py-2 rounded-md cursor-pointer transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* ========= NAV MOBILE ========= */}
      <div className="flex md:hidden fixed bottom-6 left-0 w-full justify-center items-center z-[9999] px-4">
        <div className="relative flex justify-center items-center w-full max-w-[440px]">
          <div className="absolute w-full h-[96px] bg-[#0077FF]/10 rounded-[55px] backdrop-blur-md"></div>

          <div className="relative w-full max-w-[390px] h-[70px] bg-[#0077FF] border-[3px] border-white rounded-[85px] flex items-center justify-around px-4 sm:px-6 text-[#4EB2FF] shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            
            {/* Explore */}
            <button
              type="button"
              onClick={() => navigate("/landing")}
              className={`transition-all ${
                active === "About"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[28px]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5L13.8 10.2 21.5 12 13.8 13.8 12 21.5 10.2 13.8 2.5 12 10.2 10.2 12 2.5Z" />
              </svg>
            </button>

            {/* Home */}
            <button
              type="button"
              onClick={() => navigate("/feed")}
              className={`transition-all ${
                active === "Home"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[28px]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
              </svg>
            </button>

            {/* Add (Create Post) */}
            <button
              type="button"
              onClick={() => navigate("/feed/create-post")}
              className={`transition-all ${
                location.pathname.includes("/create-post") || location.pathname === "/post"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[28px]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Profile */}
            <button
              type="button"
              onClick={() => navigate("/feed/profile")}
              className={`transition-all ${
                active === "Profile"
                  ? "stroke-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  : "stroke-[#4EB2FF]"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[28px]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a4 4 0 110 8 4 4 0 010-8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20a8 8 0 0116 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
