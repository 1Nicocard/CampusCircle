import { useState } from "react";
import "../styles/Global.css";
import Logo from "../Assets/Logo completo.png";

const Navbar = () => {
    const [active, setActive] = useState("Home");

    return (
        <header className="relative flex justify-center items-center mt-8">
            {/* ========= NAV DESKTOP ========= */}
            <div className="hidden md:flex relative justify-center items-center">
                {/* Fondo glass */}
                <div className="absolute w-[1202px] h-[113px] bg-[#0077FF]/10 rounded-[55px] backdrop-blur-md"></div>

                {/* Barra principal */}
                <nav className="relative flex items-center justify-between w-[1168.75px] h-[81.91px] bg-[#0077FF] border-[3px] border-white rounded-[85px] px-10 text-white overflow-hidden">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src={Logo}
                            alt="CampusCircle logo"
                            className="w-[342.42px] h-[63.83px] object-contain"
                        />
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-center gap-[53px] font-satoshi font-bold text-[25px]">
                        {["About us", "Home", "Profile"].map((link) => (
                            <button
                                key={link}
                                onClick={() => setActive(link)}
                                className={`relative ${active === link
                                        ? "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:bg-white"
                                        : ""
                                    }`}
                            >
                                {link}
                            </button>
                        ))}
                    </div>

                    {/* Botón principal */}
                    <button
                        className="
              relative
              w-[213px] h-[58px]
              rounded-[2000px]
              font-ABeeZee text-[24px] text-white
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
                        style={{
                            backgroundClip: "padding-box",
                        }}
                    >
                        Create Post
                    </button>
                </nav>
            </div>

            {/* ========= NAV MOBILE (placeholder) ========= */}
            <div className="flex md:hidden">
                {/* Aquí luego pondrás la versión responsive */}
            </div>
        </header>
    );
};

export default Navbar;
