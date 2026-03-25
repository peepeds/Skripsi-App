import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { CompanyListContainer } from "../components/CompanyListContainer";
import { TabNavigation } from "../components/TabNavigation";
import { useCompanies } from "../hooks/useCompanies";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { COMPANY_COMPARE_TABS } from "../constants/tabs";
import { isValidSearchQuery } from "@/helpers/validations";

export const CompaniesPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [activeTab, setActiveTab] = useState("semua");

  const { companies, loading, hasMore, error, fetchCompanies, setPage, page } =
    useCompanies(searchQuery);

  const pageRef = useRef(0);

  // Handle pagination trigger
  const handleLoadMore = useCallback(() => {
    pageRef.current += 1;
    fetchCompanies(pageRef.current);
  }, [fetchCompanies]);

  // Intersection observer for infinite scroll
  const lastElementRef = useIntersectionObserver(
    loading && isValidSearchQuery(searchQuery),
    hasMore && !isValidSearchQuery(searchQuery),
    handleLoadMore,
    0.5
  );

  // Reset active tab and page when search changes
  useEffect(() => {
    setActiveTab("semua");
    pageRef.current = 0;
  }, [searchQuery]);

  return (
    <div>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <TabNavigation
          tabs={COMPANY_COMPARE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content */}
        <div className="mt-8">
          {activeTab === "semua" && (
            <CompanyListContainer
              companies={companies}
              loading={loading}
              error={error}
              hasMore={hasMore}
              searchQuery={searchQuery}
              lastElementRef={lastElementRef}
            />
          )}

          {/* TODO: Implement filtering for teratas, populer, terbaru tabs */}
          {activeTab !== "semua" && (
            <div className="text-center py-8 text-gray-500">
              Fitur filter sedang dalam pengembangan
            </div>
          )}
        </div>
      </div>
    </div>
  );
};