import { useState } from "react";
import "../styles/Global.css";

const Navbar = () => {
  const [active, setActive] = useState("Home"); // Link activo con underline

  return (
    <div className="relative flex justify-center items-center mt-8">
      {/* Fondo glass */}
      <div className="absolute w-[1202px] h-[113px] bg-[#0077FF]/10 rounded-[55px] backdrop-blur-md"></div>

      {/* Barra principal */}
      <nav className="relative flex items-center justify-between w-[1168.75px] h-[81.91px] bg-[#0077FF] border-[3px] border-white rounded-[85px] px-10 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="CampusCircle logo" className="w-8 h-8" />
          <span className="font-satoshi font-bold text-[25px] text-white">
            CampusCircle
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-[53px] font-satoshi font-bold text-[25px]">
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

        {/* Botón principal */}
        <button className="bg-gradient-to-r from-[#3399FF] to-[#66B2FF] text-white font-satoshi font-bold text-[22px] px-6 py-2 rounded-full transition">
          Create Post
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
