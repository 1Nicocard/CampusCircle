import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal (ocupa todo el espacio libre) */}
      <main className="flex-grow">
        {/* Aquí va tu contenido */}
      </main>

      {/* Footer fijo al final */}
      <Footer />
    </div>
  );
}