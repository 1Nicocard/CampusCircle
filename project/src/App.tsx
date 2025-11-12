import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

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

const FeedLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 mt-[113px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const user = getCurrentUser();

  return (
    <Routes>
      {/* Loader */}
      <Route path="/" element={<Loader />} />

      {/* Landing */}
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

      {/* Auth */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Feed layout */}
      <Route
        path="/feed"
        element={user ? <FeedLayout /> : <Navigate to="/signin" replace />}
      >
        <Route index element={<Feed />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
