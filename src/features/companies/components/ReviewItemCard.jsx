import React, { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { getInitials, getAvatarColor } from "@/utils/avatar";
import { Share2, ThumbsUp } from "lucide-react";

const RATING_ROWS = [
  [
    { key: "workCulture", label: "Budaya Kerja" },
    { key: "learningOpp", label: "Belajar" },
  ],
  [
    { key: "mentorship", label: "Mentorship" },
    { key: "benefit", label: "Benefit" },
  ],
  [{ key: "workLifeBalance", label: "Work-Life Balance" }],
];

const computeOverallRating = (ratings = {}) => {
  const values = Object.values(ratings).filter((v) => typeof v === "number");
  if (!values.length) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SectionLabel = ({ children }) => (
  <p className="mb-1 font-inter text-xs font-semibold uppercase tracking-wide text-gray-500">
    {children}
  </p>
);

const InfoBadge = ({ children }) => (
  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 font-inter text-xs text-gray-700">
    {children}
  </span>
);

export const ReviewItemCard = ({ review }) => {
  const [copied, setCopied] = useState(false);

  const {
    createdByName,
    jobTitle,
    durationMonths,
    year,
    type,
    workScheme,
    subCategories = [],
    ratings = {},
    testimony,
    pros,
    cons,
    createdAt,
  } = review;

  const displayName = createdByName ?? "Anonim";
  const overallRating = computeOverallRating(ratings);
  const helpfulCount = review.helpfulCount ?? review.helpful ?? 0;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(displayName)}`}
          >
            {getInitials(displayName)}
          </div>
          <div>
            <p className="font-plus-jakarta text-[26px] font-semibold text-slate-900 md:text-[22px]">{displayName}</p>
            <p className="font-inter text-sm text-slate-600">{jobTitle ?? "-"}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {durationMonths && (
                <InfoBadge>{durationMonths} bulan</InfoBadge>
              )}
              {year && <InfoBadge>{year}</InfoBadge>}
              {type && <InfoBadge>{type}</InfoBadge>}
              {workScheme && <InfoBadge>{workScheme}</InfoBadge>}
            </div>
          </div>
        </div>

        {overallRating != null && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-3 py-1">
            <svg className="h-4 w-4 fill-orange-500 text-orange-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-inter text-2xl font-semibold text-orange-500 md:text-[24px]">
              {overallRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {subCategories.map((cat) => (
            <span
              key={cat}
              className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-200"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {RATING_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-2 gap-x-6 gap-y-2">
            {row.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="font-inter text-sm text-slate-600 whitespace-nowrap">{label}</span>
                <StarRating rating={ratings[key] ?? 0} size="sm" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {testimony && <p className="font-inter text-base leading-relaxed text-slate-800">"{testimony}"</p>}

      {(pros || cons) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pros && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <SectionLabel>Kelebihan (Pros)</SectionLabel>
              <p className="font-inter text-sm leading-relaxed text-emerald-800">{pros}</p>
            </div>
          )}
          {cons && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <SectionLabel>Kekurangan (Cons)</SectionLabel>
              <p className="font-inter text-sm leading-relaxed text-rose-800">{cons}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-inter text-sm font-semibold text-slate-600 hover:bg-slate-50"
          type="button"
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful ({helpfulCount})
        </button>

        <div className="flex items-center gap-2">
          {createdAt && (
            <p className="font-inter text-xs text-slate-400">{formatDate(createdAt)}</p>
          )}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={handleShare}
            type="button"
            title={copied ? "Copied" : "Share"}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
