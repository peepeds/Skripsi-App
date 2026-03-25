// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home/pages/HomePage";
import { LoginPage } from "@/features/auth/login/pages/LoginPage";
import { RegisterPage } from "@/features/auth/register/pages/RegisterPage";
import { PingPage } from "@/features/ping/pages/PingPage";
import { TestPage } from "@/features/test/pages/TestPage";
import { MinioUploadTestPage } from "@/features/minio/pages/MinioUploadTestPage";
import { NotFound } from "@/features/not-found/pages/NotFound";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { InboxDetailPage } from "@/features/inbox/pages/InboxDetailPage";
import { StorageFilePage } from "@/features/storage/pages/StorageFilePage";
import { CategoriesPage, SubCategoryCompaniesPage } from "@/features/categories";
import { CompaniesPage } from "@/features/companies/pages/CompaniesPage";
import { CompanyDetailPage } from "@/features/companies/pages/CompanyDetailPage";
import { ReviewWritePage } from "@/features/reviews";

export const appRoutes = [
  { path: "/", element: <HomePage />, showNavbar: true },
  { path: "/login", element: <LoginPage />, showNavbar: false },
  { path: "/register", element: <RegisterPage />, showNavbar: false },
  { path: "/profile", element: <ProfilePage />, showNavbar: true },
  { path: "/inbox/:id", element: <InboxDetailPage />, showNavbar: true },
  { path: "/categories", element: <CategoriesPage />, showNavbar: true },
  { path: "/subcategory/:id/companies", element: <SubCategoryCompaniesPage />, showNavbar: true },
  { path: "/companies", element: <CompaniesPage />, showNavbar: true },
  { path: "/company/:companySlug", element: <CompanyDetailPage />, showNavbar: true },
  { path: "/review/:companySlug", element: <ReviewWritePage />, showNavbar: true },
  { path: "/test", element: <TestPage />, showNavbar: false },
  { path: "/ping", element: <PingPage />, showNavbar: true },
  { path: "/test-minio", element: <MinioUploadTestPage />, showNavbar: true },
  { path: "/storage/*", element: <StorageFilePage />, showNavbar: false },
  { path: "*", element: <NotFound />, showNavbar: false },
];

export function AppRoutes() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
