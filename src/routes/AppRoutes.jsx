// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home/Home";
import LoginPage from "@/pages/auth/login/Login";
import RegisterPage from "@/pages/auth/register/Register";
import PingPage from "@/pages/PingPage";
import TestPage from "@/pages/TestPage";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/profile/Profile";

export const appRoutes = [
  { path: "/", element: <HomePage />, showNavbar: true },
  { path: "/login", element: <LoginPage />, showNavbar: false },
  { path: "/register", element: <RegisterPage />, showNavbar: false },
  { path: "/profile", element: <ProfilePage />, showNavbar: true },
  { path: "/test", element: <TestPage />, showNavbar: false },
  { path: "/ping", element: <PingPage />, showNavbar: true },
  { path: "*", element: <NotFound />, showNavbar: false },
];

export default function AppRoutes() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
