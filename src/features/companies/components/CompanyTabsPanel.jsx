import React, { useState, useEffect } from "react";
import { InformationTabContent } from "./InformationTabContent";
import { ReviewsTabContent } from "./ReviewsTabContent";
import { RecruitmentTabContent } from "./RecruitmentTabContent";
import { TabNavigation } from "./TabNavigation";
import { COMPANY_DETAIL_TABS } from "../constants/tabs";
import { getReviewSummary } from "@/api/reviewApi";

export const CompanyTabsPanel = ({ companyId, companySlug, companyName, bio }) => {
  const [activeTab, setActiveTab] = useState("informasi");
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companySlug) return;

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getReviewSummary(companySlug);
        if (response.success) {
          setSummaryData(response.result);
        } else {
          setError(response.message || "Failed to load review summary");
        }
      } catch (err) {
        setError(err.message || "Failed to load review summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [companySlug]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "informasi":
        return (
          <InformationTabContent
            bio={bio}
            summaryData={summaryData}
            loading={loading}
            error={error}
            companySlug={companySlug}
            companyName={companyName}
          />
        );

      case "testimonial":
        return (
          <ReviewsTabContent
            companySlug={companySlug}
            companyName={companyName}
            summaryData={summaryData}
          />
        );

      case "recruitment":
        return <RecruitmentTabContent companySlug={companySlug} companyName={companyName} />;

      default:
        return null;
    }
  };

  return (
    <div>
      <TabNavigation
        tabs={COMPANY_DETAIL_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-8">{renderTabContent()}</div>
    </div>
  );
};
