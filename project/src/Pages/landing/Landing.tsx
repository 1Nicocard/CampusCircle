import React from "react";
import { Button } from "../../Components/Button";

export default function Landing() {
  return (
    <section>


      <section
        className="relative w-full flex flex-col md:flex-row items-center justify-start bg-cover bg-center pb-32"
        style={{ backgroundImage: "url('/src/Assets/bannerLanding.png')" }}
      >
        {/* Contenido (texto + botón) */}
        <div className="relative z-10 flex flex-col justify-center items-center md:items-start text-center md:text-left w-full md:w-1/2 px-8 sm:px-12 md:pl-16 lg:pl-40 pt-24 md:pt-36 space-y-10 text-white max-w-full md:max-w-[770px]">
          <h1
            className="font-satoshi text-white-600 text-[50px] min-[480px]:text-[70px] min-[1500px]:text-[100px] mt-2   font-bold leading-tight break-words "
            style={{
              textShadow: "0 0 10px rgba(255, 255, 255, 0.3), 0 0 10px rgba(255, 255, 255, 0.3)"
            }}
          >
            Connect <br /> and learn
          </h1>
          <p className="text-white-600 text-[18px] min-[480px]:text-[21px] min-[1000px]:text-[24px] leading-relaxed mt-2">
            <span className="border-b-2 border-white">CampusCircle</span>, your space to connect, organize, and study with the support of a community that drives you to achieve your goals.
          </p>



          <Button
            variant="hero"
            className={
              "bg-white text-[#0077FF] border-2 border-[#0077FF] " +
              "hover:bg-gradient-to-r hover:from-[#74EBD5] hover:to-[#9FACE6] hover:text-white hover:border-transparent h-15 py-5 px-10 sm:px-12 md:px-12 " +
              "transition-all duration-300 h-18 px-6 sm:px-8 md:px-10"
            }
          >
            Join Now
          </Button>
        </div>

        {/* Imagen */}
        <div className="relative z-10 w-full md:flex-1 flex justify-end items-center mt-1 md:mt-20 mb-10 md:mb-16">
          <img
            src="/src/Assets/Decoration.png"
            alt="CampusCircle banner"
            className="w-full max-w-[950px] md:max-w-[1050px] h-auto object-contain"
          />
        </div>
      </section>


      <section className="w-full px-6 sm:px-10 min-[900px]:px-20 lg:px-32 xl:px-40 py-1 pb-16 md:pb-24">
        <div className="max-w-full mx-auto flex flex-col-reverse min-[900px]:flex-row gap-8 sm:gap-12 min-[900px]:gap-[30px] lg:gap-[30px] xl:gap-[30px] items-start">

          <div className="w-full min-[900px]:w-1/2 flex justify-center min-[900px]:justify-start">
            <img
              src="/src/Assets/laptopIllustration.png"
              alt="CampusCircle illustration"
              className="w-[85%] sm:w-[75%] min-[900px]:w-[100%] lg:w-[90%] xl:w-[100%] max-w-[700px] min-[900px]:max-w-[900px] h-auto object-contain transition-all duration-300"
            />
          </div>

          <div className="w-full min-[900px]:w-4/5 text-center min-[900px]:text-left space-y-8 sm:space-y-10 min-[900px]:ml-10">

            <div className="text-center min-[900px]:text-left space-y-0 leading-none">
              <h2 className="text-gray-700 text-[36px] sm:text-[42px] min-[900px]:text-[52px] lg:text-[60px] leading-tight mt-2 font-bold">
                What is
              </h2>
              <h2 className="text-[#1080ff] text-[36px] sm:text-[44px] min-[900px]:text-[52px] lg:text-[60px] font-bold">
                CampusCircle
              </h2>
            </div>

            <p className="text-gray-600 text-[16px] sm:text-[18px] min-[900px]:text-[21px] lg:text-[24px] leading-relaxed mt-2">
              CampusCircle is an online academic platform that makes collaborative learning among students easier. It allows you to share resources, organize tasks, and stay up to date with exams, all within an interactive and supportive space.
            </p>
            <p className="text-gray-600 text-[16px] sm:text-[18px] min-[900px]:text-[21px] lg:text-[24px] leading-relaxed mt-2">
              With tools like a personalized calendar, reminders, and the option to upload study materials, CampusCircle helps optimize study time and enhances every student’s academic experience.
            </p>

            <Button
              variant="hero"
              className="bg-gradient-to-r from-[#31E8B0] via-[#4EB2FF] to-[#CFAEFF] text-white font-semibold rounded-full transition-all duration-300 h-15 py-5 px-12 sm:px-16 min-[900px]:px-12 border-2 hover:border-white focus:outline-none">
              Join now
            </Button>
          </div>
        </div>
      </section>




      <section className="w-full my-5">
        <div className="relative w-full h-[2px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-[3px]"></div>
        </div>
      </section>



      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 pb-25 bg-[#F0F3FC]">

        <div className="text-center mb-8">
          <h2 className="text-gray-700 text-[42px] min-[480px]:text-[52px] min-[1000px]:text-[60px] leading-tight mt-2 font-bold">

            Our impact and <br /> connections
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16">

          <div className="p-6 flex flex-col items-center text-center">
            <img
              src="/src/Assets/item1.png"
              alt="Item 3"
              className="w-[240px] sm:w-[300px] md:w-[310px] lg:w-[320px] object-contain mb-8"
            />

            <h3 className="text-gray-600 text-[40px] min-[480px]:text-[45px] min-[1000px]:text-[50px] leading-tight mt-2 font-bold">+3.5K</h3>
            <h4 className="text-gray-400 text-[26px] md:text-[24px] min-[900px]:text-[24px] mb-10 font-bold">Connections</h4>
            <p className="text-gray-600 text-[18px] min-[480px]:text-[21px] min-[1000px]:text-[24px] leading-relaxed mt-2">
              Students from different universities are already sharing ideas and building community.
            </p>
          </div>

          <div className="p-6 flex flex-col items-center text-center">
            <img
              src="/src/Assets/item2.png"
              alt="Item 3"
              className="w-[240px] sm:w-[300px] md:w-[310px] lg:w-[320px] object-contain mb-8"
            />

            <h3 className="text-gray-600 text-[40px] min-[480px]:text-[45px] min-[1000px]:text-[50px] leading-tight mt-2 font-bold">Projects</h3>
            <h4 className="text-gray-400 text-[26px] md:text-[24px] min-[900px]:text-[24px] mb-10 font-bold">Teamwork</h4>
            <p className="text-gray-600 text-[18px] min-[480px]:text-[21px] min-[1000px]:text-[24px] leading-relaxed mt-2">
              More than 800 projects, papers, and prototypes published to inspire and boost your learning.
            </p>
          </div>

          <div className="p-6 flex flex-col items-center text-center">
            <img
              src="/src/Assets/item3.png"
              alt="Item 3"
              className="w-[240px] sm:w-[300px] md:w-[310px] lg:w-[320px] object-contain mb-8"
            />

            <h3 className="text-gray-600 text-[40px] min-[480px]:text-[45px] min-[1000px]:text-[50px] leading-tight mt-2 font-bold">Level 9.2</h3>
            <h4 className="text-gray-400 text-[26px] md:text-[24px] min-[900px]:text-[24px] mb-10 font-bold">Rating</h4>
            <p className="text-gray-600 text-[18px] min-[480px]:text-[21px] min-[1000px]:text-[24px] leading-relaxed mt-2">
              The community rates CampusCircle as an outstanding and truly engaging experience.
            </p>
          </div>

        </div>
      </section>



      <section className="w-full bg-[#F0F3FC] py-20">

        <div className="text-center mb-12">
          <h2 className="text-gray-700 text-[42px] min-[480px]:text-[52px] min-[1000px]:text-[60px] leading-tight mt-2 font-bold">
            Partner Universities
          </h2>
        </div>

        <div className="w-full overflow-hidden">
          <img
            src="/src/Assets/Universities.gif"
            alt="Partner Universities Logos"
            className="w-full h-[100px]  md:h-auto object-cover md:object-contain"
          />
        </div>
      </section>



      <section className="w-full my-5">
        <div className="relative w-full h-[2px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-[3px]"></div>
        </div>
      </section>



      <section className="w-full bg-[#F0F3FC] py-16 pb-32 flex flex-col items-center">

        <div className="w-full max-w-5xl overflow-hidden mb-12">
          <img
            src="/src/Assets/CTA.png"
            alt="Sample"
            className="w-full h-auto object-contain"
          />
        </div>
        <Button
          variant="hero"
          className={
            "bg-gradient-to-r from-[#31E8B0] via-[#4EB2FF] to-[#CFAEFF] text-white font-semibold rounded-full " +
            "transition-all duration-300 h-15 py-5 px-10 sm:px-12 md:px-12 " +
            "border-2  hover:border-white focus:outline-none"}>
          Join now
        </Button>
      </section>

    </section>

  );
}
