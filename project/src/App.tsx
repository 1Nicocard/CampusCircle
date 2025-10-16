import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";
import Feed from "./Pages/feed/Feed";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal (ocupa todo el espacio libre) */}
      <main className="flex-grow">
        <Feed />
      </main>

      {/* Footer fijo al final */}
      <Footer />
    </div>
  );
}
