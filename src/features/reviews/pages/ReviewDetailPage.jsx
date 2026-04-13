import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { BackButton } from "@/components/common/BackButton";
import { ReviewItemCard } from "@/features/companies/components/ReviewItemCard";
import { getCompanyReviews } from "@/api/reviewApi";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

export const ReviewDetailPage = () => {
  const { companySlug, reviewId } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reviewId) return;

    const fetchReview = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCompanyReviews(companySlug, { limit: 200 });
        const { success, message, data } = handleApiResponse(response);

        if (!success) {
          setError(message || "Gagal memuat detail review");
          return;
        }

        const list = Array.isArray(data) ? data : [];
        const foundReview = list.find((item) => {
          const detailId = item?.internshipDetailId ?? item?.reviewId ?? item?.id ?? item?.detailId;
          return String(detailId) === String(reviewId);
        });

        setReview(foundReview ?? null);
      } catch (err) {
        setError(normalizeErrorMessage(err, "Gagal memuat detail review"));
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [companySlug, reviewId]);

  return (
    <Container className="py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <BackButton variant="default" />
        <h1 className="font-plus-jakarta text-xl font-bold text-slate-900 md:text-2xl">
          Review Detail
        </h1>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && !review && (
        <ErrorMessage message="Review tidak ditemukan." />
      )}

      {!loading && !error && review && (
        <ReviewItemCard review={review} companySlug={companySlug} />
      )}
    </Container>
  );
};
