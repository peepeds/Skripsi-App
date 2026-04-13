import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { BackButton } from "@/components/common/BackButton";
import { getCompanyReviews, getRecentReviews } from "@/api/reviewApi";
import { getCompanies } from "@/api/companyApi";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";
import { ReviewItemCard } from "@/features/companies/components/ReviewItemCard";

const pickString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const getHost = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

const getReviewId = (review) =>
  review?.reviewId ??
  review?.internshipDetailId ??
  review?.internshipHeaderId ??
  review?.id ??
  review?.detailId ??
  review?.internshipDetail?.internshipDetailId ??
  review?.internshipDetail?.id ??
  review?.internshipHeader?.internshipHeaderId;

const collectReviewIds = (review) => {
  const ids = [
    review?.reviewId,
    review?.internshipDetailId,
    review?.internshipHeaderId,
    review?.id,
    review?.detailId,
    review?.headerId,
    review?.reviewID,
    review?.review_id,
    review?.internshipHeader?.internshipHeaderId,
    review?.internshipHeader?.id,
    review?.internshipDetail?.internshipDetailId,
    review?.internshipDetail?.id,
  ]
    .filter((value) => value !== null && value !== undefined && String(value).trim().length > 0)
    .map((value) => String(value));

  return Array.from(new Set(ids));
};

const getReviewerName = (review) =>
  pickString(review?.createdBy, review?.createdByName, review?.authorName, review?.name) || "Anonim";

const getCompanyName = (review) =>
  pickString(review?.companyName, review?.company?.companyName, review?.company?.name) || "Perusahaan";

const getReviewWebsite = (review) =>
  pickString(review?.companyWebsite, review?.company?.website, review?.website);

const enrichReviews = (list, companyByName, companyByHost) =>
  list.map((review) => {
    const directSlug =
      review?.companySlug ??
      review?.company?.companySlug ??
      review?.company?.slug ??
      review?.internshipHeader?.company?.companySlug;

    const host = getHost(getReviewWebsite(review));
    const byName = normalizeText(getCompanyName(review));

    const resolvedCompanySlug =
      directSlug ||
      (host ? companyByHost.get(host) : null) ||
      (byName ? companyByName.get(byName) : null) ||
      slugify(getCompanyName(review));

    const reviewerName = getReviewerName(review);

    return {
      ...review,
      resolvedReviewId: getReviewId(review),
      resolvedCompanySlug,
      resolvedReviewerName: reviewerName,
      resolvedReviewerSlug: slugify(reviewerName),
    };
  });

const DetailSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-24 rounded-xl" />
    <Skeleton className="h-80 rounded-xl" />
  </div>
);

const toReviewItemPayload = (item) => ({
  ...item,
  createdByName: item?.createdByName ?? item?.createdBy ?? item?.resolvedReviewerName,
  internshipDetailId: item?.internshipDetailId ?? item?.reviewId ?? item?.resolvedReviewId,
  internshipHeaderId:
    item?.internshipHeaderId ??
    item?.headerId ??
    item?.internshipReviewId ??
    item?.reviewID ??
    item?.review_id ??
    item?.internshipHeader?.internshipHeaderId ??
    item?.internshipHeader?.id ??
    item?.internshipDetail?.internshipHeaderId ??
    item?.internshipDetail?.internshipHeader?.internshipHeaderId,
  reviewId: item?.reviewId ?? item?.resolvedReviewId,
  id: item?.id ?? item?.resolvedReviewId,
  detailId: item?.detailId ?? item?.resolvedReviewId,
});

export const ReviewerReviewsDetailPage = () => {
  const { reviewerSlug, reviewId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reviewId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [reviewsResponse, companiesResponse] = await Promise.all([
          getRecentReviews({ limit: 200 }),
          getCompanies(null, 300),
        ]);

        const parsedReviews = handleApiResponse(reviewsResponse);
        if (!parsedReviews.success) {
          setError(parsedReviews.message || "Gagal memuat review user");
          return;
        }

        const rawItems = Array.isArray(parsedReviews.data?.items)
          ? parsedReviews.data.items
          : Array.isArray(parsedReviews.data)
          ? parsedReviews.data
          : [];

        const companies = Array.isArray(companiesResponse?.result) ? companiesResponse.result : [];
        const companyByName = new Map();
        const companyByHost = new Map();

        companies.forEach((company) => {
          const slug = company?.companySlug || company?.slug;
          if (!slug) return;

          const normalizedName = normalizeText(company?.companyName);
          if (normalizedName) companyByName.set(normalizedName, slug);

          const host = getHost(company?.website);
          if (host) companyByHost.set(host, slug);
        });

        const enriched = enrichReviews(rawItems, companyByName, companyByHost).sort((a, b) => {
          const aTime = new Date(a?.createdAt ?? a?.created_at ?? 0).getTime();
          const bTime = new Date(b?.createdAt ?? b?.created_at ?? 0).getTime();
          return bTime - aTime;
        });
        const companySlugs = Array.from(
          new Set(enriched.map((item) => item?.resolvedCompanySlug).filter(Boolean))
        );

        const detailMap = new Map();

        await Promise.all(
          companySlugs.map(async (slug) => {
            try {
              const companyReviewsResponse = await getCompanyReviews(slug, { limit: 300 });
              const parsedCompanyReviews = handleApiResponse(companyReviewsResponse);

              if (!parsedCompanyReviews.success) return;

              const items = Array.isArray(parsedCompanyReviews.data?.items)
                ? parsedCompanyReviews.data.items
                : Array.isArray(parsedCompanyReviews.data)
                ? parsedCompanyReviews.data
                : [];

              items.forEach((reviewItem) => {
                const ids = collectReviewIds(reviewItem);
                if (!ids.length) return;
                ids.forEach((id) => {
                  detailMap.set(`${slug}::${id}`, reviewItem);
                });
              });
            } catch {
              // Keep partial data when one company detail call fails.
            }
          })
        );

        const hydrated = enriched.map((item) => {
          const ids = collectReviewIds(item);
          if (item?.resolvedReviewId) {
            ids.push(String(item.resolvedReviewId));
          }

          const detailed = ids
            .map((id) => detailMap.get(`${item?.resolvedCompanySlug}::${id}`))
            .find(Boolean);

          if (!detailed) return item;

          return {
            ...item,
            ...detailed,
            resolvedCompanySlug: item?.resolvedCompanySlug,
            resolvedReviewId: item?.resolvedReviewId,
            resolvedReviewerName: item?.resolvedReviewerName,
            resolvedReviewerSlug: item?.resolvedReviewerSlug,
          };
        });

        setReviews(hydrated);
      } catch (err) {
        setError(normalizeErrorMessage(err, "Gagal memuat review user"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reviewId]);

  const selectedReview = useMemo(() => {
    const sameReviewer = reviews
      .filter((item) => item?.resolvedReviewerSlug === reviewerSlug)
      .sort((a, b) => {
        const aTime = new Date(a?.createdAt ?? a?.created_at ?? 0).getTime();
        const bTime = new Date(b?.createdAt ?? b?.created_at ?? 0).getTime();
        return bTime - aTime;
      });
    if (String(reviewId) === "latest") {
      return sameReviewer[0] ?? null;
    }

    return (
      sameReviewer.find((item) => String(item?.resolvedReviewId) === String(reviewId)) ??
      sameReviewer[0] ??
      null
    );
  }, [reviews, reviewId, reviewerSlug]);

  const activeReviewerSlug = useMemo(() => {
    if (selectedReview?.resolvedReviewerSlug) return selectedReview.resolvedReviewerSlug;
    return reviewerSlug || "unknown-reviewer";
  }, [selectedReview, reviewerSlug]);

  const reviewerName = useMemo(() => {
    if (selectedReview?.resolvedReviewerName) return selectedReview.resolvedReviewerName;

    const found = reviews.find((item) => item?.resolvedReviewerSlug === activeReviewerSlug);
    return found?.resolvedReviewerName || "Reviewer";
  }, [selectedReview, reviews, activeReviewerSlug]);

  const moreReviews = useMemo(() => {
    if (!selectedReview) return [];

    return reviews
      .filter((item) => item?.resolvedReviewerSlug === activeReviewerSlug)
      .filter((item) => String(item?.resolvedReviewId) !== String(selectedReview?.resolvedReviewId))
      .sort((a, b) => {
        const aTime = new Date(a?.createdAt ?? a?.created_at ?? 0).getTime();
        const bTime = new Date(b?.createdAt ?? b?.created_at ?? 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 2);
  }, [reviews, selectedReview, activeReviewerSlug]);

  return (
    <div className="bg-slate-50/70 py-8 md:py-10">
      <Container className="max-w-5xl">
        <div className="mb-4">
          <BackButton variant="default" label="Back" />
        </div>

        <div className="mb-5">
          <h1 className="font-plus-jakarta text-xl font-bold text-slate-900 md:text-2xl">
            Reviews by {reviewerName}
          </h1>
        </div>

        {loading && <DetailSkeleton />}
        {!loading && error && <ErrorMessage message={error} />}
        {!loading && !error && !selectedReview && (
          <ErrorMessage message="Review user tidak ditemukan." />
        )}

        {!loading && !error && selectedReview && (
          <>
            <ReviewItemCard
              review={toReviewItemPayload(selectedReview)}
              companySlug={selectedReview?.resolvedCompanySlug}
              interactive={false}
            />

            {moreReviews.length > 0 && (
              <section className="mt-8 space-y-4">
                <h2 className="font-plus-jakarta text-xl font-bold text-slate-900 md:text-2xl">
                  More Reviews from {reviewerName}
                </h2>
                <div className="space-y-4">
                  {moreReviews.map((item, index) => (
                    <ReviewItemCard
                      key={item?.resolvedReviewId ?? index}
                      review={toReviewItemPayload(item)}
                      companySlug={item?.resolvedCompanySlug}
                      interactive={false}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </Container>
    </div>
  );
};
