import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyBioSection } from "./CompanyBioSection";
import { InformationDetailsCard } from "./InformationDetailsCard";
import { ReviewRatingsCard } from "./ReviewRatingsCard";
import { RecruitmentProcessesCard } from "./RecruitmentProcessesCard";

export const InformationTabContent = ({ bio, summaryData, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 max-lg:col-span-12 space-y-6">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
        <div className="col-span-4 max-lg:col-span-12 space-y-6">
          <Skeleton className="h-56 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column (8 cols - 2/3) */}
      <div className="col-span-8 max-lg:col-span-12 space-y-6">
        <CompanyBioSection bio={bio} />
        {summaryData?.informationDetails && (
          <InformationDetailsCard data={summaryData.informationDetails} />
        )}
      </div>

      {/* Right Column (4 cols - 1/3) */}
      <div className="col-span-4 max-lg:col-span-12 space-y-6">
        {summaryData?.ratings && (
          <ReviewRatingsCard data={summaryData.ratings} />
        )}
        {summaryData?.recruitmentProcesses && (
          <RecruitmentProcessesCard data={summaryData.recruitmentProcesses} />
        )}
      </div>
    </div>
  );
};
