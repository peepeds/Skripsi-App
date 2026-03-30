import React, { useState, useEffect } from "react";
import { CompanyBioSection } from "./CompanyBioSection";
import { InformationTabContent } from "./InformationTabContent";
import { TabNavigation } from "./TabNavigation";
import { EmptyStateCard } from "./EmptyStateCard";
import { COMPANY_DETAIL_TABS } from "../constants/tabs";
import { getReviewSummary } from "@/api/reviewApi";

export const CompanyTabsPanel = ({ companyId, companySlug, bio }) => {
  const [activeTab, setActiveTab] = useState("informasi");
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companySlug || activeTab !== "informasi") return;

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
  }, [companySlug, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "informasi":
        return (
          <InformationTabContent
            bio={bio}
            summaryData={summaryData}
            loading={loading}
            error={error}
          />
        );

      case "testimonial":
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Testimoni Mahasiswa
            </h3>
            <div className="space-y-4">
              <EmptyStateCard message="Belum ada testimoni untuk perusahaan ini." />
            </div>
          </div>
        );

      case "recruitment":
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Rekrutmen
            </h3>
            <div className="space-y-4">
              <EmptyStateCard message="Belum ada informasi rekrutmen untuk perusahaan ini." />
            </div>
          </div>
        );

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
