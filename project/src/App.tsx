// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";

import Loader from "./Pages/loader/Loader";
import Landing from "./Pages/landing/Landing";
import SignIn from "./Pages/auth/SignIn";
import SignUp from "./Pages/auth/SignUp";
import Feed from "./Pages/feed/Feed";
import Profile from "./Pages/profile/Profile";
import CreatePost from "./Pages/post/Post";
import EditProfile from "./Pages/profile/EditProfile";

import Nav from "./Components/Nav";
import Footer from "./Components/Footer";
import { getCurrentUser } from "./lib/auth";

// Layout para páginas privadas
const FeedLayout: React.FC = () => {
  

  return (
    <div className="min-h-screen flex flex-col">
      <Nav /> {/* Navbar visible */}
      <main className="flex-1 mt-[113px]">
        <Outlet /> {/* Renderiza Feed, Profile o CreatePost */}
      </main>
      <Footer /> {/* Footer visible */}
    </div>
  );
};

export default function App() {
  const user = getCurrentUser();

  return (
    <Routes>
      {/* Loader - sin Nav ni Footer */}
      <Route path="/" element={<Loader />} />

      {/* Landing - Nav y Footer visibles */}
      <Route
        path="/landing"
        element={
          <>
            <Nav />
            <Landing />
            <Footer />
          </>
        }
      />

      {/* SignIn y SignUp - sin Nav ni Footer */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Páginas privadas */}
      <Route
        path="/feed"
        element={user ? <FeedLayout /> : <Navigate to="/signin" replace />}
      >
        <Route index element={<Feed />} />                 {/* /feed */}
        <Route path="create-post" element={<CreatePost />} /> {/* /feed/create-post */}
  <Route path="profile" element={<Profile />} />     {/* /feed/profile */}
  <Route path="profile/edit" element={<EditProfile />} /> {/* /feed/profile/edit */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
