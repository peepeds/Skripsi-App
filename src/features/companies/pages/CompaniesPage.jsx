import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/features/home/sections/HeroSection";
import { CompanyCardHorizontal, CompanyCardSkeleton } from "../components";
import useCompanies from "../hooks/useCompanies";
import { isValidSearchQuery } from "@/helpers/validations";

const CompaniesPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [activeTab, setActiveTab] = useState("semua");

  const { companies, loading, hasMore, error, fetchCompanies, setPage, page } = useCompanies(searchQuery);

  const observer = useRef(null);
  const hasFetchedInitial = useRef(false);

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "teratas", label: "Teratas" },
    { id: "populer", label: "Populer" },
    { id: "terbaru", label: "Terbaru" },
  ];

  useEffect(() => {
    if (activeTab === "semua") {
      hasFetchedInitial.current = true;
    } else {
      hasFetchedInitial.current = false;
    }
  }, [activeTab]);

  const lastElementRef = useRef(null);

  useEffect(() => {
    if (loading || isValidSearchQuery(searchQuery)) {
      if (observer.current) {
        observer.current.disconnect();
      }
      return;
    }

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          fetchCompanies(nextPage);
          setPage(nextPage);
        }
      },
      { threshold: 0.5 }
    );

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, searchQuery, setPage]);

  return (
    <div>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "semua" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.length === 0 && loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <CompanyCardSkeleton key={index} />
                ))
              ) : companies.length === 0 && !loading ? (
                error ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {error}
                  </div>
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {isValidSearchQuery(searchQuery) ? "No companies found for this search." : "No companies available."}
                  </div>
                )
              ) : (
                <>
                  {companies.map((company, index) => {
                    if (companies.length === index + 1) {
                      return (
                        <div ref={lastElementRef} key={company.companyId}>
                          <CompanyCardHorizontal
                            companyName={company.companyName}
                            companyAbbreviation={company.companyAbbreviation}
                            website={company.website}
                            isPartner={company.isPartner}
                            companySlug={company.companySlug}
                          />
                        </div>
                      );
                    }

                    return (
                      <CompanyCardHorizontal
                        key={company.companyId}
                        companyName={company.companyName}
                        companyAbbreviation={company.companyAbbreviation}
                        website={company.website}
                        isPartner={company.isPartner}
                        companySlug={company.companySlug}
                      />
                    );
                  })}

                  {loading &&
                    companies.length > 0 &&
                    Array.from({ length: 2 }).map((_, index) => (
                      <CompanyCardSkeleton key={`loading-${index}`} />
                    ))}

                  {!hasMore && !searchQuery && (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No more companies
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;