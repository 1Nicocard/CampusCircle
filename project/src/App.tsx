import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";
import Feed from "./Pages/feed/Feed";
import Landing from "./Pages/landing/Landing"; {/* BORRARRR */}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3FC]">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal (ocupa todo el espacio libre) */}
      <main className="flex-grow">
        <  Landing />
      </main>

      {/* Footer fijo al final */}
      <Footer />
    </div>
  );
}
