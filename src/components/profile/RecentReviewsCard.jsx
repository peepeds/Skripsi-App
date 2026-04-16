import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonLine } from "@/components/ui/skeleton";

const pickFirstString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();



const getReviewId = (review) =>
  review?.internshipDetailId ??
  review?.reviewId ??
  review?.internshipHeaderId ??
  review?.id ??
  review?.detailId ??
  review?.headerId ??
  review?.reviewID ??
  review?.review_id ??
  review?.internshipReviewId ??
  review?.internshipDetail?.internshipDetailId ??
  review?.internshipDetail?.id ??
  review?.internshipHeader?.id ??
  review?.internshipHeader?.internshipHeaderId;

const getReviewText = (review) =>
  pickFirstString(review?.testimony, review?.review, review?.content) || "-";

const getCompanyName = (review) =>
  pickFirstString(
    review?.companyName,
    review?.company?.companyName,
    review?.company?.name,
    review?.internshipHeader?.company?.companyName,
    review?.internshipHeader?.companyName,
    review?.internshipDetail?.company?.companyName,
    review?.internshipDetail?.companyName
  ) || "Perusahaan";

const getJobTitle = (review) => pickFirstString(review?.jobTitle, review?.role) || "-";

export const RecentReviewsCard = ({
  reviews,
  loading,
  error,
  unavailable = false,
}) => {
  return (
    <Card className="rounded-2xl border border-slate-200">
      <CardHeader className="space-y-1 pb-2">
        <h2 className="font-plus-jakarta text-xl font-bold text-slate-900">
          Review ({reviews.length})
        </h2>
        <p className="font-inter text-sm text-slate-500">Your review history</p>
      </CardHeader>

      <CardContent className="pt-2">
        {loading && (
          <div className="space-y-2.5">
            <SkeletonLine height="h-16" />
            <SkeletonLine height="h-16" />
          </div>
        )}

        {!loading && error && (
          <p className="font-inter text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && unavailable && (
          <p className="font-inter text-sm text-slate-500">
            Recent Reviews feature is still in development. Stay tuned for updates!
          </p>
        )}

        {!loading && !error && !unavailable && reviews.length === 0 && (
          <p className="font-inter text-sm text-slate-500">No reviews submitted yet.</p>
        )}

        {!loading && !error && !unavailable && reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review, index) => {
              const reviewId = getReviewId(review);
              return (
                <div key={reviewId ?? index} className="rounded-xl border border-slate-200 p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-plus-jakarta text-base font-semibold text-slate-900">
                        {getCompanyName(review)}
                      </p>
                      <p className="font-inter text-sm text-slate-500">{getJobTitle(review)}</p>
                    </div>
                  </div>

                  <p className="font-inter mt-1.5 line-clamp-2 text-sm text-slate-700">
                    "{getReviewText(review)}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
