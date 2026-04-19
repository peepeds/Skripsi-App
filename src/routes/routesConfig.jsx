import React from "react";
import { HomePage } from "@/features/home/pages/HomePage";
import { LoginPage } from "@/features/auth/login/pages/LoginPage";
import { RegisterPage } from "@/features/auth/register/pages/RegisterPage";
import { MinioUploadTestPage } from "@/features/minio/pages/MinioUploadTestPage";
import { NotFound } from "@/features/not-found/pages/NotFound";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { InboxDetailPage } from "@/features/inbox/pages/InboxDetailPage";
import { StorageFilePage } from "@/features/storage/pages/StorageFilePage";
import { CategoriesPage, SubCategoryCompaniesPage } from "@/features/categories";
import { CompaniesPage } from "@/features/companies/pages/CompaniesPage";
import { CompanyDetailPage } from "@/features/companies/pages/CompanyDetailPage";
import { CompareCompaniesPage } from "@/features/companies/pages/CompareCompaniesPage";
import { CompareLandingPage } from "@/features/companies/pages/CompareLandingPage";
import { AddCompanyPage } from "@/features/companies/pages/AddCompanyPage";
import { ContactUsPage, FaqPage } from "@/features/help";
import {
  RecruitmentProcessDetailPage,
  ReviewDetailPage,
  ReviewerReviewsDetailPage,
  ReviewsPage,
  ReviewWritePage,
} from "@/features/reviews";

export const appRoutes = [
  { path: "/", element: <HomePage />, showNavbar: true },
  { path: "/login", element: <LoginPage />, showNavbar: false },
  { path: "/register", element: <RegisterPage />, showNavbar: false },
  { path: "/profile", element: <ProfilePage />, showNavbar: true },
  { path: "/inbox/:id", element: <InboxDetailPage />, showNavbar: true },
  { path: "/categories", element: <CategoriesPage />, showNavbar: true },
  { path: "/subcategory/:subCategoryName/companies", element: <SubCategoryCompaniesPage />, showNavbar: true },
  { path: "/companies", element: <CompaniesPage />, showNavbar: true },
  { path: "/compare", element: <CompareLandingPage />, showNavbar: true },
  { path: "/reviews", element: <ReviewsPage />, showNavbar: true },
  { path: "/faq", element: <FaqPage />, showNavbar: true },
  { path: "/contact", element: <ContactUsPage />, showNavbar: true },
  { path: "/reviews/user/:reviewerSlug/:reviewId", element: <ReviewerReviewsDetailPage />, showNavbar: true },
  { path: "/companies/add", element: <AddCompanyPage />, showNavbar: true },
  { path: "/company/:companySlug", element: <CompanyDetailPage />, showNavbar: true },
  { path: "/compare/:leftCompanySlug/:rightCompanySlug", element: <CompareCompaniesPage />, showNavbar: true },
  { path: "/review/:companySlug", element: <ReviewWritePage />, showNavbar: true },
  { path: "/company/:companySlug/review/:reviewId", element: <ReviewDetailPage />, showNavbar: true },
  {
    path: "/company/:companySlug/recruitment/:internshipDetailId",
    element: <RecruitmentProcessDetailPage />,
    showNavbar: true,
  },
  { path: "/test-minio", element: <MinioUploadTestPage />, showNavbar: true },
  { path: "/storage/*", element: <StorageFilePage />, showNavbar: false },
  { path: "*", element: <NotFound />, showNavbar: false },
];
