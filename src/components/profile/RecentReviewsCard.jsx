import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonLine } from "@/components/ui/skeleton";

const pickFirstString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getReviewCompanySlug = (review) =>
  pickFirstString(
    review?.companySlug,
    review?.company?.companySlug,
    review?.company?.slug,
    review?.internshipHeader?.company?.companySlug,
    review?.internshipHeader?.company?.slug,
    review?.internshipDetail?.company?.companySlug,
    review?.internshipDetail?.company?.slug
  ) || slugify(getCompanyName(review));

const getReviewId = (review) =>
  review?.internshipDetailId ??
  review?.reviewId ??
  review?.internshipHeaderId ??
  review?.id ??
  review?.detailId ??
  review?.headerId ??
  review?.reviewID ??
  review?.review_id ??
  review?.internshipDetail?.internshipDetailId ??
  review?.internshipDetail?.id ??
  review?.internshipHeader?.id ??
  review?.internshipHeader?.internshipHeaderId;

const getReviewDetailPathId = (review) =>
  review?.reviewId ??
  review?.internshipDetailId ??
  review?.id ??
  review?.detailId ??
  review?.internshipHeaderId ??
  review?.headerId ??
  review?.reviewID ??
  review?.review_id ??
  review?.internshipDetail?.internshipDetailId ??
  review?.internshipDetail?.id ??
  review?.internshipHeader?.internshipDetailId ??
  review?.internshipHeader?.id;

const getReviewText = (review) =>
  pickFirstString(review?.testimony, review?.review, review?.content) || "-";

const getReviewAuthorName = (review) =>
  pickFirstString(review?.createdByName, review?.createdBy, review?.authorName, review?.name) ||
  "user";

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

export const RecentReviewsCard = ({ reviews, loading, error, unavailable = false }) => {
  return (
    <Card className="rounded-2xl border border-slate-200">
      <CardHeader className="space-y-1 pb-3">
        <h2 className="font-plus-jakarta text-xl font-bold text-slate-900">
          Review ({reviews.length})
        </h2>
        <p className="font-inter text-sm text-slate-500">Your review history</p>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="space-y-3">
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
              const reviewDetailId = getReviewDetailPathId(review);
              const companySlug = getReviewCompanySlug(review);
              const reviewerSlug = slugify(getReviewAuthorName(review));
              const reviewPath = companySlug && reviewDetailId
                ? `/company/${companySlug}/review/${reviewDetailId}`
                : reviewerSlug && reviewId
                ? `/reviews/user/${reviewerSlug}/${reviewId}`
                : reviewerSlug
                ? `/reviews/user/${reviewerSlug}/latest`
                : null;
              const content = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-plus-jakarta text-base font-semibold text-slate-900">
                        {getCompanyName(review)}
                      </p>
                      <p className="font-inter text-sm text-slate-500">{getJobTitle(review)}</p>
                    </div>
                  </div>

                  <p className="font-inter mt-2 line-clamp-2 text-sm text-slate-700">
                    "{getReviewText(review)}"
                  </p>
                </>
              );

              if (reviewPath) {
                return (
                  <Link
                    key={reviewId ?? index}
                    to={reviewPath}
                    className="block rounded-xl border border-slate-200 p-4 transition hover:border-orange-300 hover:shadow-sm"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div key={reviewId ?? index} className="rounded-xl border border-slate-200 p-4">
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
