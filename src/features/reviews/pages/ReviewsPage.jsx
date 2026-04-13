import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { getRecentReviews } from "@/api/reviewApi";
import { getCompanies } from "@/api/companyApi";
import { RecentReviewCard } from "../components/RecentReviewCard";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

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

const getReviewCompanyName = (review) =>
  review?.companyName ?? review?.company?.companyName ?? review?.company?.name;

const getReviewWebsite = (review) =>
  review?.companyWebsite ?? review?.company?.website ?? review?.website;

const enrichReviews = (list, companyByName, companyByHost) =>
  list.map((review) => {
    const directSlug =
      review?.companySlug ??
      review?.company?.companySlug ??
      review?.company?.slug ??
      review?.internshipHeader?.company?.companySlug;

    const host = getHost(getReviewWebsite(review));
    const byName = normalizeText(getReviewCompanyName(review));
    const resolvedCompanySlug =
      directSlug ||
      (host ? companyByHost.get(host) : null) ||
      (byName ? companyByName.get(byName) : null) ||
      slugify(getReviewCompanyName(review));

    return {
      ...review,
      resolvedReviewId: getReviewId(review),
      resolvedCompanySlug,
    };
  });

const ReviewGridSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className="h-[230px] rounded-2xl" />
    ))}
  </div>
);

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slugMaps, setSlugMaps] = useState({
    byName: new Map(),
    byHost: new Map(),
  });

  const fetchMore = async (cursor = null, append = false) => {
    const response = await getRecentReviews({ limit: 24, cursor });
    const { success, message, data } = handleApiResponse(response);

    if (!success) {
      throw new Error(message || "Gagal memuat review terbaru");
    }

    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    const enriched = enrichReviews(items, slugMaps.byName, slugMaps.byHost);

    setReviews((prev) => {
      if (!append) return enriched;

      const existing = new Set(
        prev.map((item, idx) => String(item?.resolvedReviewId ?? item?.reviewId ?? idx))
      );
      const uniqueNew = enriched.filter(
        (item, idx) => !existing.has(String(item?.resolvedReviewId ?? item?.reviewId ?? idx))
      );
      return [...prev, ...uniqueNew];
    });

    const resolvedNextCursor = response?.meta?.nextCursor ?? data?.nextCursor ?? null;
    const resolvedHasMore =
      typeof response?.meta?.hasMore === "boolean"
        ? response.meta.hasMore
        : Boolean(resolvedNextCursor);

    setNextCursor(resolvedNextCursor);
    setHasMore(resolvedHasMore);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const companiesResponse = await getCompanies(null, 300);
        const companies = Array.isArray(companiesResponse?.result) ? companiesResponse.result : [];

        const byName = new Map();
        const byHost = new Map();

        companies.forEach((company) => {
          const slug = company?.companySlug || company?.slug;
          if (!slug) return;

          const name = normalizeText(company?.companyName);
          if (name) byName.set(name, slug);

          const host = getHost(company?.website);
          if (host) byHost.set(host, slug);
        });

        setSlugMaps({ byName, byHost });

        const response = await getRecentReviews({ limit: 24 });
        const { success, message, data } = handleApiResponse(response);

        if (!success) {
          setError(message || "Gagal memuat review terbaru");
          return;
        }

        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setReviews(enrichReviews(items, byName, byHost));

        const resolvedNextCursor = response?.meta?.nextCursor ?? data?.nextCursor ?? null;
        const resolvedHasMore =
          typeof response?.meta?.hasMore === "boolean"
            ? response.meta.hasMore
            : Boolean(resolvedNextCursor);

        setNextCursor(resolvedNextCursor);
        setHasMore(resolvedHasMore);
      } catch (err) {
        setError(normalizeErrorMessage(err, "Gagal memuat review terbaru"));
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      await fetchMore(nextCursor, true);
    } catch (err) {
      setError(normalizeErrorMessage(err, "Gagal memuat review berikutnya"));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-slate-50/70 py-10 md:py-14">
      <Container>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.12em] text-orange-600">
              Reviews Feed
            </p>
            <h1 className="font-plus-jakarta text-3xl font-bold tracking-[-0.03em] text-slate-900 md:text-[38px]">
              Semua review terbaru
            </h1>
            <p className="max-w-2xl font-inter text-sm leading-6 text-slate-600 md:text-base">
              Jelajahi ulasan terbaru dari para intern dan buka detail review untuk melihat pengalaman lengkapnya.
            </p>
          </div>

          <Link
            to="/companies"
            className="font-inter inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-700"
          >
            Lihat companies
          </Link>
        </div>

        {loading && <ReviewGridSkeleton />}
        {!loading && error && <ErrorMessage message={error} />}
        {!loading && !error && reviews.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-inter text-sm text-slate-500">Belum ada review yang tersedia.</p>
          </div>
        )}
        {!loading && !error && reviews.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, index) => (
                <RecentReviewCard
                  key={
                    review.resolvedReviewId ??
                    review.reviewId ??
                    review.internshipDetailId ??
                    review.internshipHeaderId ??
                    review.id ??
                    index
                  }
                  {...review}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-full border-slate-200 px-6"
                >
                  {loadingMore ? "Memuat..." : "Muat lebih banyak review"}
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};