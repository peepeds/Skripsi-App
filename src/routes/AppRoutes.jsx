// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/login/pages/LoginPage";
import RegisterPage from "@/features/auth/register/pages/RegisterPage";
import PingPage from "@/pages/PingPage";
import TestPage from "@/pages/TestPage";
import MinioUploadTestPage from "@/pages/MinioUploadTestPage";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/profile/Profile";
import InboxDetail from "@/features/inbox/pages/InboxDetailPage";
import StorageFilePage from "@/pages/StorageFilePage";

export const appRoutes = [
  { path: "/", element: <HomePage />, showNavbar: true },
  { path: "/login", element: <LoginPage />, showNavbar: false },
  { path: "/register", element: <RegisterPage />, showNavbar: false },
  { path: "/profile", element: <ProfilePage />, showNavbar: true },
  { path: "/inbox/:id", element: <InboxDetail />, showNavbar: true },
  { path: "/test", element: <TestPage />, showNavbar: false },
  { path: "/ping", element: <PingPage />, showNavbar: true },
  { path: "/test-minio", element: <MinioUploadTestPage />, showNavbar: true },
  { path: "/storage/*", element: <StorageFilePage />, showNavbar: false },
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
