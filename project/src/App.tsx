import { useLocation } from "react-router-dom";
import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";
import Post from "./Pages/post/Post";
import AppRouter from "./routes/AppRouter";

export default function App(){
  const { pathname } = useLocation();
  const isAuth = pathname.startsWith("/signin") || pathname.startsWith("/signup");

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3FC]">
      {/* Navbar */}
      {!isAuth && <Navbar />}

      {/* Contenido principal (ocupa todo el espacio libre) */}
      <main className="flex-grow">
        <Post/>
        <AppRouter />
      </main>
      {!isAuth && <Footer />}
    </div>
  );
}

