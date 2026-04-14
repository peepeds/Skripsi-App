import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentReviews } from '@/api/reviewApi';
import { getCompanies } from '@/api/companyApi';
import { RecentReviewCard } from '@/features/reviews/components/RecentReviewCard';

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getHost = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
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

const getReviewerName = (review) =>
  review?.createdBy ?? review?.createdByName ?? review?.authorName ?? review?.name ?? "Anonim";

const getReviewWebsite = (review) =>
  review?.companyWebsite ?? review?.company?.website ?? review?.website;

const getReviewCompanySlug = (review, companyByName, companyByHost) => {
  const directSlug =
    review?.companySlug ??
    review?.company?.companySlug ??
    review?.company?.slug ??
    review?.internshipHeader?.company?.companySlug;

  if (directSlug) return directSlug;

  const host = getHost(getReviewWebsite(review));
  if (host && companyByHost.has(host)) {
    return companyByHost.get(host);
  }

  const byName = normalizeText(getReviewCompanyName(review));
  if (byName && companyByName.has(byName)) {
    return companyByName.get(byName);
  }

  return slugify(getReviewCompanyName(review));
};

export function HighlightReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const [recentResponse, companiesResponse] = await Promise.all([
          getRecentReviews({ limit: 16 }),
          getCompanies(null, 200),
        ]);

        if (!recentResponse?.success) {
          setReviews([]);
          return;
        }

        const items = Array.isArray(recentResponse?.result?.items)
          ? recentResponse.result.items
          : Array.isArray(recentResponse?.result)
          ? recentResponse.result
          : [];

        const companies = Array.isArray(companiesResponse?.result) ? companiesResponse.result : [];
        const companyByName = new Map();
        const companyByHost = new Map();

        companies.forEach((company) => {
          const slug = company?.companySlug || company?.slug;
          if (!slug) return;

          const name = normalizeText(company?.companyName);
          if (name) companyByName.set(name, slug);

          const host = getHost(company?.website);
          if (host) companyByHost.set(host, slug);
        });

        const enriched = items.map((review) => ({
          ...review,
          resolvedReviewId: getReviewId(review),
          resolvedCompanySlug: getReviewCompanySlug(review, companyByName, companyByHost),
          resolvedReviewerSlug: slugify(getReviewerName(review)),
        }));

        setReviews(enriched);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  return (
    <section className="bg-slate-50 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-plus-jakarta mb-1 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Recent Reviews</h2>
            <p className="font-inter text-sm text-slate-500">Cerita nyata dari mereka yang telah magang</p>
          </div>
          <Link to="/reviews" className="font-inter flex items-center gap-1 text-sm font-semibold text-[#F97316] transition hover:opacity-80">
            Read more reviews <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="hide-scrollbar overflow-x-auto pb-2">
          <div className="flex min-w-max items-start snap-x snap-mandatory gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-[320px] shrink-0 rounded-xl sm:w-[340px]">
                    <Skeleton className="h-[210px] rounded-xl" />
                  </div>
                ))
              : reviews.map((review, i) => (
                  <RecentReviewCard
                    key={review.resolvedReviewId ?? review.reviewId ?? review.internshipDetailId ?? i}
                    {...review}
                    clickVariant="author"
                    reviewerSlug={review.resolvedReviewerSlug}
                    className="w-[320px] shrink-0 snap-start sm:w-[340px]"
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
