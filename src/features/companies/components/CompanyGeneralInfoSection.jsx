import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { BackButton } from "@/components/common/BackButton";

export const CompanyGeneralInfoSection = ({
  companyId,
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
    <section className="relative bg-linear-to-br from-slate-400 to-slate-600 py-12 md:py-16">
      {/* Hero Background Overlay */}
      <div className="absolute inset-0 bg-black/10" />
      
      <Container className="relative z-10">
        {/* Top Action Bar: Back Button + Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <BackButton variant="ghost" />
          
          {/* Action Buttons Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareClick}
              className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm shadow-sm"
              title="Copy link to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.589 12.438 10 11.165 10 9.75c0-1.933-.716-3.696-1.899-5M7 21h13a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {copiedUrl ? "Copied!" : "Share"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
              </svg>
              Save
            </button>
            <Button
              onClick={() => navigate(`/review/${companySlug}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Write Review
            </Button>
          </div>
        </div>

        {/* Main Hero Content: Logo + Info Layout */}
        <div className="flex gap-6 md:gap-8 items-start">
          {/* Logo Section */}
          <div className="shrink-0">
            <CompanyLogo
              website={website}
              companyName={companyName}
              companyAbbreviation={companyAbbreviation}
              className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden"
              imgClassName="w-20 h-20 object-contain"
              fallbackClassName="text-blue-600 font-bold text-3xl"
            />
          </div>

          {/* Company Info Section */}
          <div className="flex-1 min-w-0">
            {/* Company Name Row */}
            <div className="flex items-start gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-white wrap-break-word">
                {companyName}
              </h1>
              {isPartner && (
                <div className="group relative shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-blue-200 cursor-help"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Mitra Binus Enrichment Program
                  </div>
                </div>
              )}
            </div>

            {/* Location and Category Badges Row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {subcategoryName && (
                <span className="inline-flex items-center gap-1 text-sm text-white/90 bg-white/20 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L9.9 13.95a7 7 0 01-9.9-9.9zM9 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {subcategoryName}
                </span>
              )}
            </div>

            {/* Rating Row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-semibold text-white">
                  {rating !== null && rating !== undefined
                    ? rating.toFixed(1).replace(".", ",")
                    : "—"}
                </span>
                <StarRating rating={rating} size="md" />
              </div>
              <span className="text-sm text-white/90">
                {totalReviews || 0} {totalReviews === 1 ? 'ulasan' : 'ulasan'}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
