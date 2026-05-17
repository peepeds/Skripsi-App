import React from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Star } from "lucide-react";
import { useLogoValidation } from "@/features/companies/hooks/useLogoValidation";
import { slugify } from "../utils/reviewTextUtils";

const pickLabel = (...values) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

const resolveCompanySlug = (company, companySlug, slug) =>
  pickLabel(
    companySlug,
    company?.companySlug,
    company?.slug,
    company?.company?.companySlug,
    company?.company?.slug,
    company?.internshipHeader?.company?.companySlug,
    company?.internshipHeader?.company?.slug,
    slug
  );

const resolveReviewId = (reviewId, internshipDetailId, internshipHeaderId, id, detailId) =>
  [
    internshipDetailId,
    id,
    detailId,
    reviewId,
    internshipHeaderId,
    reviewId?.internshipDetailId,
    reviewId?.internshipDetail?.internshipDetailId,
    reviewId?.internshipDetail?.id,
    reviewId?.internshipHeader?.internshipDetailId,
    reviewId?.internshipHeader?.id,
    reviewId?.reviewId,
    reviewId?.internshipReviewId,
    reviewId?.reviewID,
    reviewId?.review_id,
    reviewId?.headerId,
    reviewId?.internshipHeaderId,
    reviewId?.internshipDetailId,
  ].find(
    (value) => value !== null && value !== undefined && String(value).trim().length > 0
  );

const hasValidId = (value) => value !== null && value !== undefined && String(value).trim().length > 0;

const REVIEW_ID_KEYS = [
  "internshipDetailId",
  "detailId",
  "reviewId",
  "internshipReviewId",
  "reviewID",
  "review_id",
  "id",
  "internshipHeaderId",
  "headerId",
];

const extractDeepReviewId = (value, depth = 0) => {
  if (depth > 3 || value == null) return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractDeepReviewId(item, depth + 1);
      if (hasValidId(found)) return found;
    }
    return null;
  }

  if (typeof value !== "object") {
    return hasValidId(value) ? value : null;
  }

  for (const key of REVIEW_ID_KEYS) {
    if (hasValidId(value[key])) return value[key];
  }

  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") {
      const found = extractDeepReviewId(nested, depth + 1);
      if (hasValidId(found)) return found;
    }
  }

  return null;
};

export const RecentReviewCard = ({
  testimony,
  createdBy,
  averageRating,
  companyName,
  companySubCategory,
  companySubcategory,
  subCategory,
  subcategory,
  subcategoryName,
  subCategoryName,
  company,
  resolvedCompanySlug,
  resolvedReviewId,
  subCategoryObj,
  subcategoryObj,
  companyWebsite,
  jobTitle,
  companySlug,
  reviewId,
  internshipDetailId,
  internshipHeaderId,
  internshipDetail,
  internshipHeader,
  id,
  detailId,
  reviewerSlug,
  clickVariant = "company",
  className = "",
  ...rest
}) => {
  const resolvedCompanyName =
    pickLabel(companyName, company?.companyName, company?.name, company?.companyAbbreviation) || "Company";
  const resolvedCompanyWebsite = pickLabel(companyWebsite, company?.website, company?.companyWebsite) || "";
  const { logoUrl, logoValid } = useLogoValidation(resolvedCompanyWebsite);
  const companyInitial = resolvedCompanyName?.charAt(0)?.toUpperCase() || "?";
  const resolvedSlug =
    pickLabel(resolvedCompanySlug, resolveCompanySlug(company, companySlug, company?.companySlug)) ||
    slugify(resolvedCompanyName);
  const resolvedId =
    resolvedReviewId ??
    resolveReviewId(
      reviewId,
      internshipDetailId,
      internshipHeaderId,
      id,
      detailId
    ) ??
    company?.internshipDetailId ??
    company?.internshipHeaderId ??
    company?.internshipHeader?.internshipDetailId ??
    company?.internshipHeader?.internshipDetail?.internshipDetailId ??
    company?.internshipHeader?.internshipDetail?.id ??
    company?.internshipHeader?.id ??
    company?.internshipDetail?.internshipDetailId ??
    company?.internshipDetail?.id ??
    company?.internshipHeader?.internshipHeaderId ??
    company?.internshipHeader?.headerId ??
    company?.internshipDetail?.headerId ??
    internshipDetail?.internshipDetailId ??
    internshipDetail?.id ??
    internshipDetail?.reviewId ??
    internshipHeader?.internshipDetailId ??
    internshipHeader?.internshipDetail?.internshipDetailId ??
    internshipHeader?.internshipDetail?.id ??
    internshipHeader?.id ??
    internshipHeader?.internshipHeaderId ??
    internshipHeader?.reviewId ??
    extractDeepReviewId({
      reviewId,
      internshipDetailId,
      internshipHeaderId,
      internshipDetail,
      internshipHeader,
      company,
      id,
      detailId,
      ...rest,
    });

  const createdByLabel =
    createdBy || company?.createdByName || company?.createdBy || company?.user?.name || "Anonymous";
  const resolvedReviewerSlug = reviewerSlug || slugify(createdByLabel);
  const detailPath =
    clickVariant === "author"
      ? resolvedReviewerSlug && hasValidId(resolvedId)
        ? `/reviews/user/${resolvedReviewerSlug}/${resolvedId}`
        : resolvedReviewerSlug
        ? `/reviews/user/${resolvedReviewerSlug}/latest`
        : null
      : resolvedSlug && hasValidId(resolvedId)
      ? `/company/${resolvedSlug}/review/${resolvedId}`
      : resolvedReviewerSlug && hasValidId(resolvedId)
      ? `/reviews/user/${resolvedReviewerSlug}/${resolvedId}`
      : resolvedReviewerSlug
      ? `/reviews/user/${resolvedReviewerSlug}/latest`
      : null;

  const companySubCategoryLabel =
    pickLabel(
      companySubCategory,
      companySubcategory,
      subCategory,
      subcategory,
      subcategoryName,
      subCategoryName,
      company?.subcategoryName,
      company?.subCategoryName,
      company?.subcategory?.subCategoryName,
      company?.subCategory?.subCategoryName,
      company?.subcategory?.name,
      company?.subCategory?.name,
      subCategoryObj?.subCategoryName,
      subCategoryObj?.name,
      subcategoryObj?.subCategoryName,
      subcategoryObj?.name
    ) || "-";

  const resolvedTestimony = testimony || company?.testimony || company?.review || "-";

  const reviewScore =
    typeof averageRating === "number"
      ? averageRating
      : typeof company?.averageRating === "number"
      ? company.averageRating
      : null;


  const jobTitleLabel =
    jobTitle || company?.jobTitle || company?.role || company?.position || "Intern";

  const initialsValue = createdByLabel
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  const CardContainer = detailPath ? Link : "div";
  const cardProps = detailPath ? { to: detailPath } : {};

  return (
    <CardContainer
      {...cardProps}
      className={`self-start flex h-auto min-h-[184px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        detailPath ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-[#EA580C] text-[11px] font-semibold text-white">
            {initialsValue || <User className="h-4 w-4 text-white" />}
          </div>
          <div className="min-w-0 space-y-1">
            <h4 className="font-plus-jakarta truncate text-sm font-semibold leading-tight text-slate-900">
              {createdByLabel}
            </h4>
            <p className="font-inter truncate text-[11px] leading-tight text-slate-600">
              {jobTitleLabel}
            </p>
          </div>
        </div>
        <div className="font-inter flex shrink-0 items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">
          <Star className="mr-1 h-3 w-3 fill-[#F97316] text-[#F97316]" />
          {typeof reviewScore === "number" ? reviewScore.toFixed(1).replace(".", ",") : "-"}
        </div>
      </div>

      <blockquote className="font-inter line-clamp-3 text-[13px] leading-[1.5] text-slate-700">
        "{resolvedTestimony}"
      </blockquote>

      <div className="mt-auto border-t border-slate-100 pt-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-50">
            {logoValid === true ? (
              <img src={logoUrl} alt={resolvedCompanyName} className="h-full w-full object-contain" />
            ) : logoValid === false ? (
              <span className="font-inter text-[10px] font-semibold text-slate-600">{companyInitial}</span>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>

          <div className="min-w-0 leading-tight">
            <p className="font-plus-jakarta truncate text-xs font-semibold text-slate-900">{resolvedCompanyName}</p>
            <p className="font-inter truncate text-[11px] text-slate-500">{companySubCategoryLabel}</p>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};
