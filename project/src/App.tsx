import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";
import Loader from "./Pages/loader/Loader";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3FC]">
     

      {/* Contenido principal (ocupa todo el espacio libre) */}
      <main className="flex-grow">

        < Loader />
      </main>

      {/* Footer fijo al final */}
      <Footer />
    </div>
  );
}
