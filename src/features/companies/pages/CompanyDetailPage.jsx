import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompanyDetail } from "../hooks/useCompanyDetail";
import { LoadingWrapper } from "@/components/ui/LoadingWrapper";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { CompanyGeneralInfoSection } from "../components/CompanyGeneralInfoSection";
import { CompanyTabsPanel } from "../components/CompanyTabsPanel";

export const CompanyDetailPage = () => {
  const { companySlug } = useParams();
  const { company, loading, error } = useCompanyDetail(companySlug);

  if (loading) {
    return <LoadingWrapper />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Company Not Found</h1>
          <p className="text-gray-600">The company you're looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Section 1: General Information (Full-width Hero Style) */}
      <CompanyGeneralInfoSection
        companyId={company.companyId}
        companySlug={companySlug}
        companyName={company.companyName}
        companyAbbreviation={company.companyAbbreviation}
        website={company.website}
        isPartner={company.isPartner}
      />

      {/* Section 2: Tabs Panel (Inside Container) */}
      <Container className="py-8">
        <CompanyTabsPanel companyId={company.companyId} bio={company.bio} />
      </Container>
    </>
  );
};