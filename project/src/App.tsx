import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";
import Post from "./Pages/post/Post";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3FC]">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal (ocupa todo el espacio libre) */}
      <main className="flex-grow">
        <Post/>
      </main>

      {/* Footer fijo al final */}
      <Footer />
    </div>
  );
}
