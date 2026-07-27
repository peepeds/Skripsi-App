import React, { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TwoColumnLayout } from "@/components/layout";
import { ReviewItemCard } from "../cards/ReviewItemCard";
import { ReviewRatingsCard } from "../cards/ReviewRatingsCard";
import { CompanyInternedCTACard } from "../cards/CompanyInternedCTACard";
import { EmptyStateCard } from "../cards/EmptyStateCard";
import { useCompanyReviews } from "../../hooks/useCompanyReviews";

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
  const {
    items,
    loading,
    error,
    hasMore,
    loadMore,
  } = useCompanyReviews(companySlug);
  const loadMoreRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !isFetchingRef.current) {
          isFetchingRef.current = true;
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    const current = loadMoreRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    if (!loading) {
      isFetchingRef.current = false;
    }
  }, [loading]);

  const reviewListContent = (
    <>
      {loading && items.length === 0 && <ReviewListSkeleton />}
      {!loading && error && items.length === 0 && <ErrorMessage message={error} />}
      {!loading && !error && items.length === 0 && (
        <EmptyStateCard message="There are no reviews for this company yet." />
      )}
      {items.length > 0 && (
        <>
          <div className="space-y-4">
            {items.map((review) => (
              <ReviewItemCard
                key={review.internshipDetailId ?? review.id}
                review={review}
                companySlug={companySlug}
              />
            ))}
          </div>

          {hasMore && (
            <div
              ref={loadMoreRef}
              className="flex justify-center py-6"
            >
              {loading && (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              )}
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <h2 className="font-plus-jakarta text-2xl font-bold tracking-[-0.02em] text-slate-900">All Reviews</h2>
      <TwoColumnLayout
        leftClassName="space-y-4"
        rightClassName="space-y-4"
        left={(
          <div className="min-h-65">{reviewListContent}</div>
        )}
        right={
          <>
            {summaryData?.ratings && <ReviewRatingsCard data={summaryData.ratings} />}
            <CompanyInternedCTACard companySlug={companySlug} companyName={companyName} />
          </>
        }
      />
    </div>
  );
};
