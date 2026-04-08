import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TwoColumnLayout } from "@/components/layout";
import { CompanyBioSection } from "./CompanyBioSection";
import { InformationDetailsCard } from "./InformationDetailsCard";
import { ReviewRatingsCard } from "./ReviewRatingsCard";
import { CompanyInternedCTACard } from "./CompanyInternedCTACard";

export const InformationTabContent = ({
  bio,
  summaryData,
  loading,
  error,
  companySlug,
  companyName,
}) => {
  if (loading) {
    return (
      <TwoColumnLayout
        left={<><Skeleton className="h-40 rounded-lg" /><Skeleton className="h-48 rounded-lg" /></>}
        right={<><Skeleton className="h-56 rounded-lg" /><Skeleton className="h-48 rounded-lg" /></>}
      />
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <TwoColumnLayout
      left={
        <>
          <CompanyBioSection bio={bio} />
          {summaryData?.informationDetails && (
            <InformationDetailsCard data={summaryData.informationDetails} />
          )}
        </>
      }
      right={
        <>
          {summaryData?.ratings && <ReviewRatingsCard data={summaryData.ratings} />}
          <CompanyInternedCTACard companySlug={companySlug} companyName={companyName} />
        </>
      }
    />
  );
};
