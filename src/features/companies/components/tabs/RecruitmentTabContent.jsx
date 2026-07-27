import React, { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TwoColumnLayout } from "@/components/layout";
import { RecruitmentProcessCard } from "../cards/RecruitmentProcessCard";
import { AverageDifficultyCard } from "../cards/AverageDifficultyCard";
import { RecruitmentStatisticsCard } from "../cards/RecruitmentStatisticsCard";
import { CompanyInternedCTACard } from "../cards/CompanyInternedCTACard";
import { EmptyStateCard } from "../cards/EmptyStateCard";
import { useCompanyRecruitmentProcess } from "../../hooks/useCompanyRecruitmentProcess";
import { useRecruitmentProcessSummary } from "../../hooks/useRecruitmentProcessSummary";

const CardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-16 rounded-xl" />
    <Skeleton className="h-20 rounded-xl" />
  </div>
);

const SidebarSkeleton = () => (
  <div className="space-y-4">
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-20 rounded-xl" />
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-full rounded-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-3/4 rounded-full" />
    </div>
  </div>
);

export const RecruitmentTabContent = ({ companySlug, companyName }) => {
  const { items, loading: listLoading, error: listError, hasMore, loadMore } = useCompanyRecruitmentProcess(companySlug);
  const { summary, loading: summaryLoading } = useRecruitmentProcessSummary(companySlug);
  const loadMoreRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
  if (!hasMore) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (
        entry.isIntersecting &&
        !listLoading &&
        !isFetchingRef.current
      ) {
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
}, [hasMore, listLoading, loadMore]);

useEffect(() => {
  if (!listLoading) {
    isFetchingRef.current = false;
  }
}, [listLoading]);

  const recruitmentListContent = (
    <>
      {listLoading && items.length === 0 && (
        <div className="space-y-4">
          {[1, 2].map((i) => <CardSkeleton key={i} />)}
        </div>
      )}
      {!listLoading && listError && items.length === 0 && (
        <ErrorMessage message={listError} />
      )}
      {!listLoading && !listError && items.length === 0 && (
        <EmptyStateCard message="There is no recruitment information for this company yet." />
      )}
      {items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <RecruitmentProcessCard
              key={item.internshipDetailId ?? item.id}
              data={item}
              companySlug={companySlug}
            />
          ))}
        </div>
      )}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex justify-center py-6"
        >
          {listLoading && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <h2 className="font-plus-jakarta text-2xl font-bold tracking-[-0.02em] text-slate-900">Alumni Recruitment Experience</h2>
      <TwoColumnLayout
        leftClassName="space-y-4"
        rightClassName="space-y-4"
        left={(
          <div className="min-h-65">{recruitmentListContent}</div>
        )}
        right={
          <>
            {summaryLoading && !summary && <SidebarSkeleton />}
            {summary && (
              <>
                <AverageDifficultyCard difficulty={summary.difficulty} />
                <RecruitmentStatisticsCard statistics={summary.statistics} />
              </>
            )}
            <CompanyInternedCTACard companySlug={companySlug} companyName={companyName} />
          </>
        }
      />
    </div>
  );
};
