import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewItemCard } from "./ReviewItemCard";
import { ReviewRatingsCard } from "./ReviewRatingsCard";
import { CompanyInternedCTACard } from "./CompanyInternedCTACard";
import { EmptyStateCard } from "./EmptyStateCard";
import { useCompanyReviews } from "../hooks/useCompanyReviews";

const ReviewListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);

export const ReviewsTabContent = ({ companySlug, companyName, summaryData }) => {
  const { reviews, loading, error } = useCompanyReviews(companySlug);

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 max-lg:col-span-12 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">All Reviews</h2>

        {loading && <ReviewListSkeleton />}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <EmptyStateCard message="Belum ada ulasan untuk perusahaan ini." />
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <ReviewItemCard key={review.reviewId ?? idx} review={review} />
            ))}
          </div>
        )}
      </div>

      <div className="col-span-4 max-lg:col-span-12 space-y-6">
        {summaryData?.ratings && (
          <ReviewRatingsCard data={summaryData.ratings} />
        )}
        <CompanyInternedCTACard companySlug={companySlug} companyName={companyName} />
      </div>
    </div>
  );
};
