import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { BackButton } from "@/components/common/BackButton";
import { Bookmark, BriefcaseBusiness, Share2 } from "lucide-react";

export const CompanyGeneralInfoSection = ({
  companySlug,
  companyName,
  companyAbbreviation,
  website,
  isPartner,
  subcategoryName,
  rating,
  totalReviews,
}) => {
  const navigate = useNavigate();
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleShareClick = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-500 via-slate-600 to-slate-700 py-10 md:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_45%)]" />

      <Container className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <BackButton variant="ghost" className="text-white/90 hover:bg-white/15 hover:text-white" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareClick}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/70 bg-white px-4 font-inter text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              title="Copy link to clipboard"
            >
              <Share2 className="h-4 w-4" />
              {copiedUrl ? "Copied!" : "Share"}
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/70 bg-white px-4 font-inter text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Bookmark className="h-4 w-4" />
              Save
            </button>
            <Button
              onClick={() => navigate(`/review/${companySlug}`)}
              className="h-10 rounded-xl bg-orange-500 px-5 font-inter text-sm font-semibold text-white hover:bg-orange-600"
            >
              Write Review
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-5 md:gap-8">
          <div className="shrink-0">
            <CompanyLogo
              website={website}
              companyName={companyName}
              companyAbbreviation={companyAbbreviation}
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-white shadow-lg"
              imgClassName="h-20 w-20 object-contain"
              fallbackClassName="text-blue-600 font-bold text-3xl"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-3 flex flex-wrap items-start gap-3">
              <h1 className="font-plus-jakarta text-4xl font-bold leading-tight text-white md:text-[42px]">
                {companyName}
              </h1>
              {isPartner && (
                <div className="group relative mt-2 shrink-0">
                  <svg
                    className="h-6 w-6 cursor-help text-blue-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Mitra Binus Enrichment Program
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {subcategoryName && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/20 px-4 py-1.5 font-inter text-sm text-white/95">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {subcategoryName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-inter text-[28px] font-semibold leading-none text-white md:text-[30px]">
                  {rating !== null && rating !== undefined
                    ? rating.toFixed(1).replace(".", ",")
                    : "—"}
                </span>
                <StarRating rating={rating} size="md" />
              </div>
              <span className="font-inter text-sm text-white/90">
                {totalReviews || 0} {totalReviews === 1 ? 'ulasan' : 'ulasan'}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
