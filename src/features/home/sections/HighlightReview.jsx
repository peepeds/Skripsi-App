import React, { useState, useEffect } from 'react';
import { User, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentReviews } from '@/api/reviewApi';
import { useLogoValidation } from '@/features/companies/hooks/useLogoValidation';

const RecentReviewCard = ({
  testimony,
  createdBy,
  averageRating,
  companyName,
  companyCategory,
  companySubCategory,
  companySubcategory,
  subCategory,
  subcategory,
  subcategoryName,
  subCategoryName,
  company,
  subCategoryObj,
  subcategoryObj,
  companyWebsite,
  jobTitle,
}) => {
  const pickLabel = (...values) =>
    values.find(value => typeof value === 'string' && value.trim().length > 0)?.trim();

  const initials = createdBy
    ? createdBy
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(name => name[0]?.toUpperCase())
        .join('')
    : '';
  const resolvedCompanyName =
    pickLabel(companyName, company?.companyName, company?.name, company?.companyAbbreviation) || 'Perusahaan';
  const resolvedCompanyWebsite =
    pickLabel(companyWebsite, company?.website, company?.companyWebsite) || '';

  const { logoUrl, logoValid } = useLogoValidation(resolvedCompanyWebsite);
  const companyInitial = resolvedCompanyName?.charAt(0)?.toUpperCase() || '?';
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
    ) || '-';

  return (
    <div className="flex w-[320px] shrink-0 snap-start flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-[340px]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EA580C] text-xs font-semibold text-white">
            {initials || <User className="w-4 h-4 text-white" />}
          </div>
          <div className="min-w-0 space-y-0.5">
            <h4 className="font-plus-jakarta truncate text-sm font-semibold leading-tight text-slate-900">{createdBy || 'Anonim'}</h4>
            <p className="font-inter truncate text-[11px] leading-tight text-slate-600">{jobTitle || 'Intern'}</p>
          </div>
        </div>
        <div className="font-inter flex shrink-0 items-center rounded-lg bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
          <Star className="mr-1 h-3 w-3 fill-[#F97316] text-[#F97316]" />
          {averageRating?.toFixed(1).replace('.', ',')}
        </div>
      </div>

      <blockquote className="font-inter line-clamp-4 text-[13px] leading-relaxed text-slate-700">
        "{testimony}"
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
            <p className="font-inter mt-0.5 truncate text-[11px] text-slate-500">{companySubCategoryLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function HighlightReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentReviews()
      .then(data => { if (data.success) setReviews(data.result.items); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-slate-50 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-plus-jakarta mb-1 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Recent Reviews</h2>
            <p className="font-inter text-sm text-slate-500">Cerita nyata dari mereka yang telah magang</p>
          </div>
          <a href="#" className="font-inter flex items-center gap-1 text-sm font-semibold text-[#F97316] transition hover:opacity-80">
            Read more reviews <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="hide-scrollbar overflow-x-auto pb-2">
          <div className="flex min-w-max snap-x snap-mandatory gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[320px] shrink-0 rounded-xl sm:w-[340px]">
                  <Skeleton className="h-[210px] rounded-xl" />
                </div>
              ))
            : reviews.map((review, i) => <RecentReviewCard key={i} {...review} />)
          }
          </div>
        </div>
      </div>
    </section>
  );
}
