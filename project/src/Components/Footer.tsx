import footerElement1 from "../assets/Footer element 1 izquierda.png";
import footerElement2 from "../assets/Footer element 2.png";
import LogoGif from "../assets/Logo gif.gif";

export default function Footer() {
    return (
        <div className="relative w-full">
            {/* ======= FOOTER DESKTOP ======= */}
            <div className="hidden md:block relative w-full">
                {/* Elemento 1 - Izquierda y Derecha */}
                <div className="absolute bottom-[400px] left-0 w-full flex justify-between pointer-events-none z-[0]">
                    <img
                        src={footerElement1}
                        alt="Elemento izquierdo"
                        className="h-[276px] object-contain object-left select-none"
                    />
                    <img
                        src={footerElement1}
                        alt="Elemento derecho"
                        className="h-[276px] object-contain object-right select-none scale-x-[-1]"
                    />
                </div>

                <footer className="relative w-full overflow-hidden flex flex-col items-center justify-end mt-0 mb-0 z-[10]">
                    {/* Fondo glass */}
                    <div className="absolute bottom-0 left-0 w-full h-[485px] bg-[#0077FF]/10 backdrop-blur-md z-[1]" />

                    {/* Fondo azul */}
                    <div className="absolute bottom-0 left-0 w-full h-[464px] bg-[#0077FF] z-[2]" />

                    {/* Contenedor central (elemento2 + gif) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[656px] flex flex-col items-center justify-end z-[5]">
                        <img
                            src={footerElement2}
                            alt="Decorative element"
                            className="absolute bottom-[-118px] left-1/2 -translate-x-1/2 w-full h-[700px] object-contain z-[6]"
                        />

                        <div className="relative w-[524px] h-[240px] overflow-hidden z-[5]">
                            <img
                                src={LogoGif}
                                alt="Logo animado"
                                className="w-full h-auto object-cover object-top"
                            />
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="relative z-[10] w-full max-w-[1728px] flex justify-between px-[129px] pt-[77px] pb-[105px] text-white font-abeezee">
                        {/* About us */}
                        <div className="flex flex-col items-start">
                            <div className="flex flex-col mb-[45px] mt-[100px]">
                                <h2 className="font-satoshi font-bold text-[50px]">About us</h2>
                                <div className="mt-[3px] h-[3px] w-[230px] bg-white"></div>
                            </div>

                            <ul className="text-[25px] space-y-[15px]">
                                <li className="font-sarala text-[24px] flex flex-col">
                                    <span>Company</span>
                                    <div
                                        className="mt-[6px] -ml-[20px] h-[3px] w-[487px]"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)",
                                        }}
                                    ></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col">
                                    <span>Leadership</span>
                                    <div
                                        className="mt-[6px] -ml-[20px] h-[3px] w-[360px]"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)",
                                        }}
                                    ></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col">
                                    <span>Press</span>
                                    <div
                                        className="mt-[6px] -ml-[20px] h-[3px] w-[233px]"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)",
                                        }}
                                    ></div>
                                </li>
                            </ul>
                        </div>

                        {/* Social media */}
                        <div className="flex flex-col items-end text-right">
                            <div className="flex flex-col mb-[45px] mt-[100px] items-end">
                                <h2 className="font-satoshi font-bold text-[50px]">Social media</h2>
                                <div className="mt-[3px] h-[3px] w-[300px] bg-white"></div>
                            </div>

                            <ul className="text-[25px] space-y-[15px]">
                                <li className="font-sarala text-[24px] flex flex-col items-end">
                                    <span>Instagram</span>
                                    <div
                                        className="mt-[6px] -mr-[40px] h-[3px] w-[487px]"
                                        style={{
                                            background:
                                                "linear-gradient(to left, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)",
                                        }}
                                    ></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col items-end">
                                    <span>Youtube</span>
                                    <div
                                        className="mt-[6px] -mr-[40px] h-[3px] w-[360px]"
                                        style={{
                                            background:
                                                "linear-gradient(to left, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)",
                                        }}
                                    ></div>
                                </li>
                                <li className="font-sarala text-[24px] flex flex-col items-end">
                                    <span>TikTok</span>
                                    <div
                                        className="mt-[6px] -mr-[40px] h-[3px] w-[233px]"
                                        style={{
                                            background:
                                                "linear-gradient(to left, rgba(78,178,255,0) 0%, #4EB2FF 17%, rgba(78,178,255,0) 100%)",
                                        }}
                                    ></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>

            
        </div>
    );
}
