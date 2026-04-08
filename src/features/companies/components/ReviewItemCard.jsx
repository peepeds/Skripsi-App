import React from "react";
import { StarRating } from "@/components/ui/StarRating";
import { getInitials, getAvatarColor } from "@/utils/avatar";

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
  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
    {children}
  </p>
);

const InfoBadge = ({ children }) => (
  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
    {children}
  </span>
);

export const ReviewItemCard = ({ review }) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
      {/* Header: avatar, name, job, meta */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold ${getAvatarColor(displayName)}`}
          >
            {getInitials(displayName)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{displayName}</p>
            <p className="text-sm text-gray-600">{jobTitle ?? "-"}</p>
            <div className="flex flex-wrap gap-1 mt-1">
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
          <div className="flex items-center gap-1 shrink-0">
            <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-orange-500">
              {overallRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Sub-categories */}
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

      {/* Ratings grid */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        {RATING_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-2 gap-x-6 gap-y-2">
            {row.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-600 whitespace-nowrap">{label}</span>
                <StarRating rating={ratings[key] ?? 0} size="sm" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Testimony */}
      {testimony && (
        <p className="text-sm text-gray-700 leading-relaxed italic">"{testimony}"</p>
      )}

      {/* Pros / Cons */}
      {(pros || cons) && (
        <div className="grid grid-cols-2 gap-4">
          {pros && (
            <div>
              <SectionLabel>Kelebihan</SectionLabel>
              <p className="text-sm text-green-700 leading-relaxed">{pros}</p>
            </div>
          )}
          {cons && (
            <div>
              <SectionLabel>Kekurangan</SectionLabel>
              <p className="text-sm text-red-700 leading-relaxed">{cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer date */}
      {createdAt && (
        <p className="text-xs text-gray-400 text-right">{formatDate(createdAt)}</p>
      )}
    </div>
  );
};
