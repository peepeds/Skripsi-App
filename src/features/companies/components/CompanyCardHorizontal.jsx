import React from "react";
import { Link } from "react-router-dom";
import { StarRating } from "@/components/ui/StarRating";
import { CompanyLogo } from "@/components/common/CompanyLogo";

const RatingStars = ({ rating, totalReviews }) => {
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={rating} size="sm" />
      <span className="font-inter text-[15px] font-semibold text-slate-900">
        {rating !== null ? rating.toFixed(1).replace(".", ",") : "—"}
      </span>
      <span className="font-inter text-[15px] text-slate-500">({totalReviews || 0})</span>
    </div>
  );
};

export const CompanyCardHorizontal = ({
  companyName,
  companyAbbreviation,
  website,
  isPartner,
  companySlug,
  subcategoryName,
  rating,
  totalReviews,
}) => {
  return (
    <Link to={`/company/${companySlug}`} className="block h-full">
      <div className="flex h-full min-h-[186px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <a
          href={website ? `https://${website}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mb-3 h-11 w-11 shrink-0"
        >
          <CompanyLogo
            website={website}
            companyName={companyName}
            companyAbbreviation={companyAbbreviation}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2"
            imgClassName="h-full w-full object-contain"
            fallbackClassName="rounded bg-gray-100 font-semibold text-gray-600"
          />
        </a>

        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex items-start gap-2">
            <h3 className="font-plus-jakarta line-clamp-2 text-[20px] font-semibold leading-tight text-slate-900">
              {companyAbbreviation ? `${companyName} (${companyAbbreviation})` : companyName}
            </h3>
            {isPartner && (
              <svg className="h-4.5 w-4.5 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          <div className="mb-1">
            <RatingStars rating={rating} totalReviews={totalReviews} />
          </div>

          <div className="pt-0.5">
            {subcategoryName && (
              <span className="font-inter inline-block w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {subcategoryName}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
