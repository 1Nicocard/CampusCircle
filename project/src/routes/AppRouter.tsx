import { Routes, Route, Navigate } from "react-router-dom";
import Feed from "../Pages/feed/Feed";
import SignIn from "../Pages/auth/SignIn";
import SignUp from "../Pages/auth/SignUp";
import Profile from "../Pages/profile/Profile";
import EditProfile from "../Pages/profile/EditProfile";
import Post from "../Pages/post/Post"; // ✅ asegúrate de tener este componente creado

function AppRouter() {
  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<Feed />} />

      {/* Autenticación */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Crear post */}
      <Route path="/post" element={<Post />} />

      {/* Perfil */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />

      {/* Redirección si no hay coincidencias */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
