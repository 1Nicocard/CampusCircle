import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Feed from "../Pages/feed/Feed";
import SignIn from "../Pages/auth/SignIn";
import SignUp from "../Pages/auth/SignUp";
import Profile from "../Pages/profile/Profile";
import EditProfile from "../Pages/profile/EditProfile";
import { getCurrentUser } from "../lib/auth";

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/signin" replace />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
