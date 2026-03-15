import React from "react";
import { CompanyCardHorizontal, CompanyCardSkeleton } from "./index";

/**
 * Container untuk menampilkan list companies
 */
export const CompanyListContainer = ({
  companies,
  loading,
  error,
  hasMore,
  searchQuery,
  lastElementRef,
}) => {
  const isEmpty = companies.length === 0;
  const isLoading = isEmpty && loading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CompanyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isEmpty && !loading) {
    if (error) {
      return (
        <div className="col-span-full text-center py-8 text-gray-500">
          {error}
        </div>
      );
    }

    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        {searchQuery
          ? "Tidak ada perusahaan yang sesuai dengan pencarian."
          : "Tidak ada perusahaan tersedia."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {companies.map((company, index) => {
        const isLastElement = companies.length === index + 1;

        const card = (
          <CompanyCardHorizontal
            key={company.companyId}
            companyName={company.companyName}
            companyAbbreviation={company.companyAbbreviation}
            website={company.website}
            isPartner={company.isPartner}
            companySlug={company.companySlug}
          />
        );

        return isLastElement ? (
          <div ref={lastElementRef} key={company.companyId}>
            {card}
          </div>
        ) : (
          card
        );
      })}

      {loading && companies.length > 0 && (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <CompanyCardSkeleton key={`loading-${index}`} />
          ))}
        </>
      )}

      {!hasMore && companies.length > 0 && !searchQuery && (
        <div className="col-span-full text-center py-4 text-gray-500">
          Tidak ada perusahaan lagi
        </div>
      )}
    </div>
  );
};
