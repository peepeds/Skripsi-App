import React from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Star } from "lucide-react";
import { useLogoValidation } from "@/features/companies/hooks/useLogoValidation";

const pickLabel = (...values) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

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
  [reviewId, internshipDetailId, internshipHeaderId, id, detailId].find(
    (value) => value !== null && value !== undefined && String(value).trim().length > 0
  );

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
  id,
  detailId,
  reviewerSlug,
  clickVariant = "company",
  className = "",
}) => {
  const resolvedCompanyName =
    pickLabel(companyName, company?.companyName, company?.name, company?.companyAbbreviation) || "Perusahaan";
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
    company?.internshipHeader?.internshipHeaderId;

  const createdByLabel =
    createdBy || company?.createdByName || company?.createdBy || company?.user?.name || "Anonim";
  const resolvedReviewerSlug = reviewerSlug || slugify(createdByLabel);
  const detailPath =
    clickVariant === "author"
      ? resolvedReviewerSlug
        ? `/reviews/user/${resolvedReviewerSlug}/${resolvedId ?? "latest"}`
        : null
      : resolvedSlug && resolvedId
      ? `/company/${resolvedSlug}/review/${resolvedId}`
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
      className={`self-start flex h-[170px] min-h-[170px] max-h-[170px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        detailPath ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-[#EA580C] text-[11px] font-semibold text-white">
            {initialsValue || <User className="h-4 w-4 text-white" />}
          </div>
          <div className="min-w-0 space-y-0.5">
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

      <blockquote className="font-inter line-clamp-3 text-[13px] leading-[1.45] text-slate-700">
        "{resolvedTestimony}"
      </blockquote>

      <div className="mt-auto border-t border-slate-100 pt-1.5">
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