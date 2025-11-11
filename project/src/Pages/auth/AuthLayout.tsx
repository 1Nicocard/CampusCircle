import heroWeb from "../../Assets/auth/Hero- Web.png";
import heroMobile from "../../Assets/auth/Hero - Mobile.png";
import sparkIcon from "../../Assets/icons/spark.svg";

export default function AuthLayout({
  title, subtitle, topRightLink, children,
}:{
  title: string;
  subtitle: string;
  topRightLink?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen w-full bg-white">
      {/* Top link: sólo en XL (dos columnas) */}
      <div className="hidden xl:block">
        <div className="container">
          <div className="flex justify-end pt-6 text-[#5A5E68] font-sarala text-[16px]">
            {topRightLink}
          </div>
        </div>
      </div>

      {/* Desktop XL (>=1280px): grid 2 columnas */}
      <div className="hidden xl:block">
        <div className="container py-10">
          <div className="grid grid-cols-12 gap-10 items-center">
            {/* Izquierda: panel ilustrado */}
            <div className="col-span-6">
              <div className="rounded-[32px] overflow-hidden border border-[#E6E8EE] shadow-[0_12px_40px_rgba(0,119,255,.25)]">
                <img
                  src={heroWeb}
                  alt="CampusCircle"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Derecha: card centrada y ancho fijo */}
            <div className="col-span-6 flex justify-center">
              <div className="bg-white rounded-[24px] border border-[#E6E8EE]
                              shadow-[0_8px_28px_rgba(24,72,167,.12)]
                              p-6 sm:p-8 w-full max-w-[420px]">
                <Header title={title} subtitle={subtitle} />
                <div className="mt-6">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
{/* Mobile/Tablet (<1280px): hero arriba + card superpuesta full-width */}
<div className="xl:hidden overflow-x-hidden">
  {/* HERO */}
  <div className="relative z-0 w-full bg-[#0B7CF2]">
    {/* Altura fluída: no “zoomea” ni queda cortado en transiciones */}
    <img
      src={heroMobile}
      alt="CampusCircle"
      className="
        w-full
        h-[clamp(420px,55vh,580px)]   
        object-cover                   
        object-[50%_28%]               
        sm:object-[50%_30%]
        md:object-[50%_32%]
      "
    />
    {/* curva blanca inferior del hero */}
    <div
      className="absolute left-0 right-0 h-6 bg-white rounded-t-[32px] z-[1] pointer-events-none"
      style={{ bottom: '-24px' }}
    />
  </div>

  
  <div
    className="flex justify-center relative z-10"
    style={{ marginTop: 'calc(-1 * clamp(180px, 22vh, 240px))' }}  
  >
    <div
      className="
        relative z-10
        w-screen max-w-none mx-0
        bg-white rounded-[24px] border border-[#E6E8EE]
        shadow-[0_8px_28px_rgba(24,72,167,.12)]
        px-5 sm:px-6 md:px-8 pt-6 pb-8
      "
    >
      <div className="max-w-[420px] mx-auto">
        <Header title={title} subtitle={subtitle} />
        <div className="mt-6">{children}</div>

        {/* link inferior en mobile */}
        <div className="mt-6 text-center text-[#5A5E68] font-sarala">
          {topRightLink}
        </div>
      </div>
    </div>
  </div>
</div>


    </section>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <img src={sparkIcon} alt="" className="w-7 h-7" />
        <h1 className="font-satoshi font-bold text-[32px] sm:text-[40px] text-[#1E90FF] leading-[1.1]">
          {title}
        </h1>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E6E8EE] to-transparent mt-2" />
      <p className="mt-3 text-[16px] sm:text-[18px] text-[#7B8794] font-sarala">
        {subtitle}
      </p>
    </>
  );
}

