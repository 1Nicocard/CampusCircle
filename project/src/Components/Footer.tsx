import { useState } from "react";
import footerElement1 from "../Assets/Footer element 1 izquierda.png";
import footerElement2 from "../Assets/Footer element 2.png";
import footermobileElement2 from "../Assets/Footer mobile element 2.png";
import LogoGif from "../Assets/Logo gif.gif";
import { ChevronDown } from "lucide-react";

export default function Footer() {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        about: false,
        social: false,
    });

    const toggleSection = (section: "about" | "social") => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const baseGlass = 610;
    const baseBlue = 580;
    const extraPerOpen = 580;
    const extraHeight =
        (openSections.about ? extraPerOpen : 0) +
        (openSections.social ? extraPerOpen : 0);

    const blueHeight = baseBlue + extraHeight;
    const glassHeight = baseGlass + 15;

    return (
        <div className="relative w-full">

            {/* === FOOTER MOBILE === */}
            <div className="block max-[832px]:block min-[833px]:hidden relative w-full overflow-hidden">

                {/* Footer móvil */}
                <footer className="relative w-full flex flex-col items-center justify-end z-[10] mt-0 mb-0">

                    {/* Fondo azul */}
                    <div className="absolute bottom-0 left-0 w-full bg-[#0077FF] z-[2] transition-all duration-500"
                        style={{ height: `${blueHeight}px` }} />

                    {/* Fondo glass */}
                    <div className="absolute bottom-0 left-0 w-full bg-[#0077FF]/10 backdrop-blur-md z-[1] transition-all duration-500"
                        style={{ height: `${glassHeight}px` }} />

                    {/* Contenido principal */}
                    <div className="relative z-[10] flex flex-col items-start text-white font-abeezee pt-[60px] pb-[410px] space-y-[36px] px-10">

                        {/* About us */}
                        <div className="flex flex-col items-start w-full z-[10]">
                            <div className="w-[398px]">
                                <button onClick={() => toggleSection("about")} className="flex items-center justify-between w-full focus:outline-none" aria-expanded={openSections.about}>
                                    <h2 className="font-satoshi font-bold text-[30px] text-left">About us</h2>
                                    <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openSections.about ? "rotate-180" : ""}`} />
                                </button>

                                <div className="mt-[6px] h-[2px] bg-[#4EB2FF] w-[398px]" />
                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openSections.about ? "max-h-[200px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                                    <ul className="font-sarala text-[20px] text-left mt-2 space-y-2 pl-0">
                                        <li>Company</li>
                                        <li>Leadership</li>
                                        <li>Press</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Social media */}
                        <div className="flex flex-col items-start w-full z-[10]">
                            <div className="w-[398px]">
                                <button onClick={() => toggleSection("social")} className="flex items-center justify-between w-full focus:outline-none" aria-expanded={openSections.social}>
                                    <h2 className="font-satoshi font-bold text-[30px] text-left">Social media</h2>
                                    <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openSections.social ? "rotate-180" : ""}`} />
                                </button>

                                <div className="mt-[6px] h-[2px] bg-[#4EB2FF] w-[398px]" />
                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openSections.social ? "max-h-[200px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                                    <ul className="font-sarala text-[20px] text-left mt-2 space-y-2 pl-0">
                                        <li>Instagram</li>
                                        <li>Youtube</li>
                                        <li>TikTok</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Objeto central */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[656px] flex flex-col items-center justify-end z-[5]">
                        <img src={footermobileElement2} alt="Decorativo" className="absolute bottom-[-198px] left-1/2 -translate-x-1/2 w-full h-[700px] object-contain z-[6]" />
                        <div className="relative w-[524px] h-[240px] overflow-hidden z-[5]">
                            <img src={LogoGif} alt="Logo animado" className="w-full h-auto object-cover object-top" />
                        </div>
                    </div>
                </footer>
            </div>

            {/* === FOOTER DESKTOP === */}
            <div className="hidden min-[833px]:block relative w-full">
                <div className="absolute bottom-[400px] left-0 w-full flex justify-between pointer-events-none z-[3]">
                    <img src={footerElement1} alt="Elemento izquierdo" className="h-[276px] object-contain object-left select-none" />
                    <img src={footerElement1} alt="Elemento derecho" className="h-[276px] object-contain object-right select-none scale-x-[-1]" />
                </div>

                <footer className="relative w-full overflow-hidden flex flex-col items-center justify-end mt-0 mb-0 z-[10]">
                    <div className="absolute bottom-0 left-0 w-full h-[485px] bg-[#0077FF]/10 backdrop-blur-md z-[1]" />
                    <div className="absolute bottom-0 left-0 w-full h-[464px] bg-[#0077FF] z-[2]" />

                    {/* Objeto central */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[656px] flex flex-col items-center justify-end z-[5]">
                        <img src={footerElement2} alt="Decorativo" className="absolute bottom-[-118px] left-1/2 -translate-x-1/2 w-full h-[700px] object-contain z-[6]" />
                        <div className="relative w-[524px] h-[240px] overflow-hidden z-[5]">
                            <img src={LogoGif} alt="Logo animado" className="w-full h-auto object-cover object-top" />
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="relative z-[10] w-full max-w-[1728px] flex flex-wrap justify-between gap-y-10 px-[5vw] pt-[77px] pb-[105px] text-white font-abeezee overflow-hidden">
                        <div className="flex flex-col items-start flex-1 min-w-[300px]">
                            <div className="flex flex-col mb-[45px] mt-[100px]">
                                <h2 className="font-satoshi font-bold text-[50px]">About us</h2>
                                <div className="mt-[3px] h-[3px] w-[230px] bg-white"></div>
                            </div>

                            <ul className="text-[25px] space-y-[15px]">
                                <li className="font-sarala text-[24px] flex flex-col">
                                    <span>Company</span>
                                    <div className="mt-[6px] -ml-[20px] h-[3px] w-[487px]" style={{ background: "linear-gradient(90deg, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)" }}></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col">
                                    <span>Leadership</span>
                                    <div className="mt-[6px] -ml-[20px] h-[3px] w-[360px]" style={{ background: "linear-gradient(90deg, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)" }}></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col">
                                    <span>Press</span>
                                    <div className="mt-[6px] -ml-[20px] h-[3px] w-[233px]" style={{ background: "linear-gradient(90deg, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)" }}></div>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-end text-right flex-1 min-w-[300px]">
                            <div className="flex flex-col mb-[45px] mt-[100px] items-end">
                                <h2 className="font-satoshi font-bold text-[50px]">Social media</h2>
                                <div className="mt-[3px] h-[3px] w-[300px] bg-white"></div>
                            </div>

                            <ul className="text-[25px] space-y-[15px]">
                                <li className="font-sarala text-[24px] flex flex-col items-end">
                                    <span>Instagram</span>
                                    <div className="mt-[6px] -mr-[40px] h-[3px] w-[487px]" style={{ background: "linear-gradient(to left, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)" }}></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col items-end">
                                    <span>Youtube</span>
                                    <div className="mt-[6px] -mr-[40px] h-[3px] w-[360px]" style={{ background: "linear-gradient(to left, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)" }}></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col items-end">
                                    <span>TikTok</span>
                                    <div className="mt-[6px] -mr-[40px] h-[3px] w-[233px]" style={{ background: "linear-gradient(to left, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)" }}></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
