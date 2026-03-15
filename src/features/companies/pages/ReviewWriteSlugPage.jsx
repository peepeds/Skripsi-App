import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UnauthenticatedModal } from "@/components/common/UnauthenticatedModal";
import { useCompanyDetail } from "../hooks/useCompanyDetail";
import { LoadingWrapper } from "@/components/ui/LoadingWrapper";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewWriteForm } from "../components/ReviewWriteForm";
import { ReviewHeroSection } from "../components/ReviewHeroSection";

/**
 * ReviewWriteSlugPage
 * Halaman untuk menulis review dengan route berbasis slug perusahaan
 * Route: /review/:companySlug
 */
export const ReviewWriteSlugPage = () => {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { company, loading: companyLoading, error: companyError } = useCompanyDetail(companySlug);
  const [loading, setLoading] = useState(false);

  // Check authentication
  if (!isAuthenticated) {
    return <UnauthenticatedModal redirectPath={location.pathname} />;
  }

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    try {
      // TODO: Implement API call to submit review
      console.log("Review submission:", {
        companyId: company?.companyId,
        companySlug,
        ...formData,
      });
      // After successful submission
      navigate(`/company/${companySlug}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      // TODO: Add error handling/toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/company/${companySlug}`);
  };

  // Loading state
  if (companyLoading) {
    return <LoadingWrapper />;
  }

  // Error state
  if (companyError) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{companyError}</p>
        </div>
      </Container>
    );
  }

  // Company not found state
  if (!company) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Company Not Found</h1>
          <p className="text-gray-600">
            The company you're looking for does not exist.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <ReviewHeroSection company={company} />

      {/* Review Form with Step Tabs (full-width) */}
      <ReviewWriteForm
        company={company}
        onSubmit={handleFormSubmit}
        loading={loading}
        onCancel={handleCancel}
      />
    </>
  );
};
