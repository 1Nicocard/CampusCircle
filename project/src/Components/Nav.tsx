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

            
            <div className="flex md:hidden">
               {/* ========= NAV MOBILE ========= */}
<div className="relative flex justify-center items-center w-full mt-6">
  {/* Fondo glass */}
  <div className="absolute w-[417px] h-[96px] bg-[#0077FF]/10 rounded-[55px] backdrop-blur-md"></div>

  {/* Contenedor principal */}
  <div className="relative w-[390px] h-[70px] bg-[#0077FF] border-[3px] border-white rounded-[200px] flex items-center justify-between px-6 text-[#4EB2FF] overflow-visible">

    {/* Círculo central grande */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95px] h-[95px] bg-[#0077FF] border-[3px] border-white rounded-full flex justify-center items-center">

      {/* Círculo más pequeño (botón +) */}
      <div
        className="w-[42px] h-[42px] rounded-full flex justify-center items-center
        bg-[linear-gradient(180deg,_rgba(2,112,238,0.93)_0%,_rgba(112,179,255,1)_68%,_rgba(225,242,255,1)_100%)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-[25px] w-[25px] stroke-white"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
    

    {/* Íconos laterales */}
    <div className="flex items-center justify-between w-full px-4">
      {/* Estrella */}
      <button className="transition-all active:stroke-white active:drop-shadow-[0_0_10px_white]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-[28.02px] w-[28.02px] stroke-[#4EB2FF] active:stroke-white"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2l2.39 7.26h7.61l-6.16 4.48L17.83 22 12 17.77 6.17 22l1.99-8.26L2 9.26h7.61z"
          />
        </svg>
      </button>

      {/* Casa */}
      <button className="transition-all active:stroke-white active:drop-shadow-[0_0_10px_white]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-[22px] w-[22px] stroke-[#4EB2FF]"
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

      {/* Calendario */}
      <button className="transition-all active:stroke-white active:drop-shadow-[0_0_10px_white]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-[22px] w-[22px] stroke-[#4EB2FF]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Usuario */}
      <button className="transition-all active:stroke-white active:drop-shadow-[0_0_10px_white]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-[27px] w-[27px] stroke-[#4EB2FF]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14c3.314 0 6 2.686 6 6H6c0-3.314 2.686-6 6-6zm0-10a4 4 0 110 8 4 4 0 010-8z"
          />
        </svg>
      </button>
    </div>
  </div>
</div>


            </div>
        </header>
    );
};

export default Navbar;
