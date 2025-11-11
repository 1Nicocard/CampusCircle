import { useLocation } from "react-router-dom";
import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";
import AppRouter from "./routes/AppRouter";

export default function App(){
  const { pathname } = useLocation();
  const isAuth = pathname.startsWith("/signin") || pathname.startsWith("/signup");

  return (
    <div className="min-h-screen bg-white">
      {!isAuth && <Navbar />}
      <main className={!isAuth ? "pt-[120px]" : ""}>
        <AppRouter />
      </main>
      {!isAuth && <Footer />}
    </div>
  );
}

