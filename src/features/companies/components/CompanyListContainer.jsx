import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CompanyCardHorizontal, CompanyCardSkeleton } from "./index";


export const CompanyListContainer = ({
  companies,
  loading,
  error,
  hasMore,
  searchQuery,
  lastElementRef,
}) => {
  const navigate = useNavigate();
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

    if (searchQuery) {
      return (
        <div className="borde rounded-lg bg-gray-50 shadow-sm py-16 px-8 flex flex-col items-center text-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Company Not Found</h2>
          <p className="text-gray-500 max-w-sm">
            We don&apos;t have any reviews for &quot;{searchQuery}&quot; yet. Help other
            students by adding this company!
          </p>
          <Button
            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full px-10 py-5 text-base font-semibold"
            onClick={() => navigate("/companies/add")}
          >
            Add Company
          </Button>
        </div>
      );
    }

    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Tidak ada perusahaan tersedia.
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
            subcategoryName={company.subcategoryName}
            rating={company.rating}
            totalReviews={company.totalReviews}
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
