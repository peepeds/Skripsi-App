import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TwoColumnLayout } from "@/components/layout";
import { RecruitmentProcessCard } from "./RecruitmentProcessCard";
import { AverageDifficultyCard } from "./AverageDifficultyCard";
import { RecruitmentStatisticsCard } from "./RecruitmentStatisticsCard";
import { CompanyInternedCTACard } from "./CompanyInternedCTACard";
import { EmptyStateCard } from "./EmptyStateCard";
import { useCompanyRecruitmentProcess } from "../hooks/useCompanyRecruitmentProcess";
import { useRecruitmentProcessSummary } from "../hooks/useRecruitmentProcessSummary";

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

  return (
    <TwoColumnLayout
      leftClassName="space-y-4"
      rightClassName="space-y-4"
      left={
        <>
          <div className="space-y-1">
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">Recruitment Process</p>
            <h2 className="font-plus-jakarta text-2xl font-bold tracking-[-0.02em] text-slate-900">Alumni Recruitment Experience</h2>
          </div>

          {listLoading && items.length === 0 && (
            <div className="space-y-4">
              {[1, 2].map((i) => <CardSkeleton key={i} />)}
            </div>
          )}
          {!listLoading && listError && items.length === 0 && (
            <ErrorMessage message={listError} />
          )}
          {!listLoading && !listError && items.length === 0 && (
            <EmptyStateCard message="Belum ada informasi rekrutmen untuk perusahaan ini." />
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
            <div className="flex justify-center pt-2">
              <button
                onClick={loadMore}
                disabled={listLoading}
                className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {listLoading ? "Memuat..." : "Muat Lebih Banyak"}
              </button>
            </div>
          )}
        </>
      }
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
  );
};
