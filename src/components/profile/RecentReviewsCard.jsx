import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonLine } from "@/components/ui/skeleton";

const pickFirstString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

const getReviewCompanySlug = (review) =>
  pickFirstString(
    review?.companySlug,
    review?.company?.companySlug,
    review?.company?.slug
  );

const getReviewId = (review) =>
  review?.internshipDetailId ?? review?.reviewId ?? review?.id ?? review?.detailId;

const getReviewText = (review) =>
  pickFirstString(review?.testimony, review?.review, review?.content) || "-";

const getCompanyName = (review) =>
  pickFirstString(
    review?.companyName,
    review?.company?.companyName,
    review?.company?.name
  ) || "Perusahaan";

const getJobTitle = (review) => pickFirstString(review?.jobTitle, review?.role) || "-";

export const RecentReviewsCard = ({ reviews, loading, error, unavailable = false }) => {
  return (
    <Card className="rounded-2xl border border-slate-200">
      <CardHeader className="space-y-1 pb-3">
        <h2 className="font-plus-jakarta text-xl font-bold text-slate-900">
          Recent Review ({reviews.length})
        </h2>
        <p className="font-inter text-sm text-slate-500">Riwayat review yang pernah kamu buat</p>
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
            Fitur Recent Reviews masih dalam tahap pengembangan. Nantikan update selanjutnya!
          </p>
        )}

        {!loading && !error && !unavailable && reviews.length === 0 && (
          <p className="font-inter text-sm text-slate-500">Belum ada review yang kamu kirim.</p>
        )}

        {!loading && !error && !unavailable && reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review, index) => {
              const reviewId = getReviewId(review);
              const companySlug = getReviewCompanySlug(review);
              const detailPath = reviewId && companySlug
                ? `/company/${companySlug}/review/${reviewId}`
                : null;

              return (
                <div key={reviewId ?? index} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-plus-jakarta text-base font-semibold text-slate-900">
                        {getCompanyName(review)}
                      </p>
                      <p className="font-inter text-sm text-slate-500">{getJobTitle(review)}</p>
                    </div>
                    {detailPath ? (
                      <Link
                        to={detailPath}
                        className="font-inter text-xs font-semibold text-orange-600 hover:text-orange-700"
                      >
                        Lihat detail
                      </Link>
                    ) : null}
                  </div>

                  <p className="font-inter mt-2 line-clamp-2 text-sm text-slate-700">
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
