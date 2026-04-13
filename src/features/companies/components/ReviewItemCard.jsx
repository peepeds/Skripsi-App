import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getInitials, getAvatarColor } from "@/utils/avatar";

const InfoBadge = ({ children }) => (
  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 font-inter text-xs text-gray-700">
    {children}
  </span>
);

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const resolveCompanyName = (review) =>
  review?.companyName ??
  review?.company?.companyName ??
  review?.company?.name ??
  review?.internshipHeader?.company?.companyName ??
  review?.internshipHeader?.companyName ??
  review?.internshipDetail?.company?.companyName ??
  review?.internshipDetail?.companyName ??
  "Perusahaan";

const resolveCompanySlug = (review, companySlug) =>
  companySlug ??
  review?.companySlug ??
  review?.company?.companySlug ??
  review?.company?.slug ??
  review?.internshipHeader?.company?.companySlug ??
  review?.internshipHeader?.company?.slug ??
  review?.internshipDetail?.company?.companySlug ??
  review?.internshipDetail?.company?.slug ??
  slugify(resolveCompanyName(review));

const resolveReviewDetailId = (review) =>
  review?.internshipDetailId ??
  review?.reviewId ??
  review?.id ??
  review?.detailId ??
  review?.internshipDetail?.internshipDetailId ??
  review?.internshipDetail?.id ??
  review?.internshipHeader?.internshipDetailId ??
  review?.internshipHeader?.id;

export const ReviewItemCard = ({ review, companySlug, interactive = true }) => {
  const navigate = useNavigate();

  const displayName =
    review?.createdByName ??
    review?.createdBy ??
    review?.authorName ??
    review?.user?.name ??
    "Anonim";

  const jobTitle = review?.jobTitle ?? review?.role ?? review?.position ?? "-";
  const companyName = resolveCompanyName(review);
  const resolvedCompanySlug = resolveCompanySlug(review, companySlug);
  const durationMonths = review?.durationMonths;
  const year = review?.year;
  const type = review?.type;
  const workScheme = review?.workScheme;
  const subCategories =
    review?.subCategories ?? review?.subCategoryNames ?? review?.subcategories ?? [];
  const testimony = review?.testimony ?? review?.review ?? review?.content;

  const reviewDetailId = resolveReviewDetailId(review);

  const handleOpenDetail = () => {
    if (!interactive) return;

    if (!reviewDetailId) {
      toast.error("Review ID tidak ditemukan");
      return;
    }
    if (!resolvedCompanySlug) {
      toast.error("Slug company tidak ditemukan");
      return;
    }

    navigate(`/company/${resolvedCompanySlug}/review/${reviewDetailId}`);
  };


  return (
    <div
      onClick={interactive ? handleOpenDetail : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(event) => {
        if (!interactive) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenDetail();
        }
      }}
      className={`space-y-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition md:p-4 ${
        interactive ? "cursor-pointer hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(displayName)}`}
          >
            {getInitials(displayName)}
          </div>
          <div className="space-y-0.5">
            <p className="font-plus-jakarta text-[18px] font-semibold tracking-[-0.02em] text-slate-900 md:text-[19px]">{displayName}</p>
            <p className="font-inter text-sm text-slate-600">{jobTitle ?? "-"}</p>
            <p className="font-inter text-sm text-slate-500">{companyName}</p>
            <div className="mt-0.5 flex flex-wrap gap-1.5">
              {durationMonths && (
                <InfoBadge>{durationMonths} bulan</InfoBadge>
              )}
              {year && <InfoBadge>{year}</InfoBadge>}
              {type && <InfoBadge>{type}</InfoBadge>}
              {workScheme && <InfoBadge>{workScheme}</InfoBadge>}
            </div>
          </div>
        </div>

        {typeof review?.averageRating === "number" && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5">
            <svg className="h-3 w-3 fill-orange-500 text-orange-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-inter text-sm font-semibold text-orange-500 md:text-base">
              {review.averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {subCategories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 font-inter text-[11px] text-orange-700"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {testimony && <p className="font-inter text-[14px] leading-relaxed text-slate-800">"{testimony}"</p>}
    </div>
  );
};
