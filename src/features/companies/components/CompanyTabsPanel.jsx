import React, { useState } from "react";
import { CompanyBioSection } from "./CompanyBioSection";
import { TabNavigation } from "./TabNavigation";
import { EmptyStateCard } from "./EmptyStateCard";
import { COMPANY_DETAIL_TABS } from "../constants/tabs";

export const CompanyTabsPanel = ({ companyId, bio }) => {
  const [activeTab, setActiveTab] = useState("informasi");

  const renderTabContent = () => {
    switch (activeTab) {
      case "informasi":
        return <CompanyBioSection bio={bio} />;

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
