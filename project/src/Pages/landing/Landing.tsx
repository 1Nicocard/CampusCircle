import React from "react";
import { Button } from "../../Components/Button";

export default function Landing() {
  return (
    <section>

      <section
        className="relative w-full flex flex-col md:flex-row items-center justify-start bg-cover bg-center"
        style={{ backgroundImage: "url('/src/Assets/bannerLanding.png')" }}>

        {/* Contenido (texto + botón) */}
        <div className="relative z-10 flex flex-col justify-center items-center md:items-start text-center md:text-left w-full md:w-1/2 px-8 sm:px-12 md:pl-16 lg:pl-40 pt-24 md:pt-36 space-y-6 text-white max-w-full md:max-w-[750px]">
          <h1 className="font-satoshi text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight break-words">
            Connect and  learn
          </h1>
          <p className="text-white-600 text-[18px] md:text-[24px] leading-relaxed mt-2">
            CampusCircle, your space to connect, organize, and study with the support of a community that drives you to achieve your goals.
          </p>

          <Button
            variant="hero"
            className={
              "bg-white text-[#0077FF] border-2 border-[#0077FF] " +
              "hover:bg-gradient-to-r hover:from-[#74EBD5] hover:to-[#9FACE6] hover:text-white hover:border-transparent " +
              "transition-all duration-300 h-18 px-6 sm:px-8 md:px-10"
            }
          >
            Join Now
          </Button>
        </div>

        {/* Imagen */}
        <div className="relative z-10 w-full md:flex-1 flex justify-end items-center mt-4 md:mt-10">
          <img
            src="/src/Assets/Decoration.png"
            alt="CampusCircle banner"
            className="w-full max-w-[900px] md:max-w-[950px] h-auto object-contain"
          />
        </div>
      </section>




      <section className="w-full px-8 md:px-40 py-16">
        <div className="max-w-full mx-auto flex flex-col-reverse md:flex-row gap-20 items-start">

          {/* Columna de la imagen */}
          <div className="w-full md:w-1/2 flex items-start justify-center md:justify-start">
            <img
              src="/src/Assets/laptopIllustration.png"
              alt="CampusCircle illustration"
              className="w-full md:w-[900px] lg:w-[1200px] object-contain"
            />
          </div>

          {/* Columna de texto */}
          <div className="w-full md:w-4/5 text-center md:text-left space-y-10 md:ml-10">

            {/* Títulos */}
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-gray-600 text-3xl md:text-5xl font-bold">
                What is
              </h2>
              <h2 className="text-[#0077FF] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
                CampusCircle
              </h2>
            </div>

            {/* Párrafos */}
            <p className="text-gray-600 text-[18px] md:text-[24px] leading-relaxed">
              CampusCircle is an online academic platform that makes collaborative learning among students easier. It allows you to share resources, organize tasks, and stay up to date with exams, all within an interactive and supportive space.
            </p>
            <p className="text-gray-600 text-[18px] md:text-[24px] leading-relaxed">
              With tools like a personalized calendar, reminders, and the option to upload study materials, CampusCircle helps optimize study time and enhances every student’s academic experience.
            </p>

            {/* Botón */}
            <Button
              className={
                "bg-white text-[#0077FF] border-2 border-[#0077FF] " +
                "hover:bg-gradient-to-r hover:from-[#74EBD5] hover:to-[#9FACE6] hover:text-white hover:border-transparent " +
                "transition-all duration-300 h-18 px-6 sm:px-8 md:px-10"
              }
            >
              Join Now
            </Button>
          </div>

        </div>
      </section>




      <section className="w-full my-5">
        <div className="relative w-full h-[2px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-[3px]"></div>
        </div>
      </section>





      <section className="w-full px-8 md:px-40 py-20 bg-[#F0F3FC]">
        {/* Título principal */}
        <div className="text-center mb-10"> {/* Reducimos mb de 16 a 10 */}
          <h2 className="text-gray-600 text-[28px] md:text-[48px] font-bold leading-tight">
            Our impact and <br /> connections
          </h2>
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">

          {/* Item 1 */}
          <div className="p-6 flex flex-col items-center text-center">
            <img
              src="/src/Assets/item1.png"
              alt="Item 1"
              className="w-56 h-56 md:w-72 md:h-72 object-contain mb-4"
            />
            <h3 className="text-gray-700 text-[28px] md:text-[36px] font-bold mb-1">+3.5K</h3>
            <h4 className="text-gray-500 text-[20px] md:text-[24px] mb-4 font-bold">Connections</h4>
            <p className="text-gray-600 text-[18px] md:text-[24px] leading-relaxed mt-2">
              Students from different universities are already sharing ideas and building community.
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-6 flex flex-col items-center text-center">
            <img
              src="/src/Assets/item2.png"
              alt="Item 2"
              className="w-56 h-56 md:w-72 md:h-72 object-contain mb-4"
            />
            <h3 className="text-gray-700 text-[28px] md:text-[36px] font-bold mb-1">Projects</h3>
            <h4 className="text-gray-500 text-[20px] md:text-[24px] mb-4 font-bold">Teamwork</h4>
            <p className="text-gray-600 text-[18px] md:text-[24px] leading-relaxed mt-2">
              More than 800 projects, papers, and prototypes published to inspire and boost your learning.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-6 flex flex-col items-center text-center">
            <img
              src="/src/Assets/item3.png"
              alt="Item 3"
              className="w-56 h-56 md:w-72 md:h-72 object-contain mb-4"
            />
            <h3 className="text-gray-700 text-[28px] md:text-[36px] font-bold mb-1">Level 9.2</h3>
            <h4 className="text-gray-500 text-[20px] md:text-[24px] mb-4 font-bold ">Rating</h4>
            <p className="text-gray-600 text-[18px] md:text-[24px] leading-relaxed mt-2">
              The community rates CampusCircle as an outstanding and truly engaging experience.
            </p>
          </div>

        </div>
      </section>






      <section className="w-full bg-[#F0F3FC] py-20">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h2 className="text-gray-600 text-[28px] md:text-[48px] font-bold leading-tight">
            Partner Universities
          </h2>
        </div>

        {/* Imagen de logos */}
        <div className="w-full overflow-hidden">
          <img
            src="/src/Assets/Universities.gif" // reemplaza con tu asset
            alt="Partner Universities Logos"
            className="w-full h-[300px] sm:h-[350px] md:h-auto object-cover md:object-contain"
          />
        </div>
      </section>




      <section className="w-full my-5">
        <div className="relative w-full h-[2px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-[3px]"></div>
        </div>
      </section>




      <section className="w-full bg-[#F0F3FC] py-20 flex flex-col items-center">
        {/* Imagen */}
        <div className="w-full max-w-4xl overflow-hidden mb-8">
          <img
            src="/src/Assets/CTA.png" // reemplaza con tu asset
            alt="Sample"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Botón */}
        <button className="px-8 py-4 bg-[#0077FF] text-white font-bold rounded-full text-lg hover:bg-gradient-to-r hover:from-[#74EBD5] hover:to-[#9FACE6] transition-all duration-300">
          Learn More
        </button>
      </section>



    </section>

  );
}
