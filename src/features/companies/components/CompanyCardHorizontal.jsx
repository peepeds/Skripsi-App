import React from "react";
import { Link } from "react-router-dom";
import { useLogoValidation } from "../hooks/useLogoValidation";
import { StarRating } from "@/components/ui/StarRating";

const RatingStars = ({ rating, totalReviews }) => {
  const reviewText = totalReviews === 1 ? 'review' : 'reviews';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-gray-900">
          {rating !== null ? rating.toFixed(1).replace(".", ",") : "—"}
        </span>
        <StarRating rating={rating} size="sm" />
      </div>
      <span className="text-sm text-gray-600">· {totalReviews || 0} {reviewText}</span>
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
  const { logoUrl, logoValid } = useLogoValidation(website);

  const initial =
    companyAbbreviation?.charAt(0) ||
    companyName?.charAt(0) ||
    "?";

  return (
    <Link to={`/company/${companySlug}`} className="block">
      <div className="bg-white shadow-sm hover:shadow-md transition rounded-lg p-4 flex items-center gap-4">
        {/* Logo */}
        <a
          href={website ? `https://${website}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 w-10 h-10"
        >
          {logoValid ? (
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <img
                src={logoUrl}
                alt={companyName}
                loading="lazy"
                className="w-8 h-8 object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-semibold">
              {initial}
            </div>
          )}
        </a>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-1.5">
          {/* Company Name with Partner Icon */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-gray-900">
              {companyAbbreviation ? `${companyName} (${companyAbbreviation})` : companyName}
            </h3>
            {isPartner && (
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          {/* Rating Row */}
          <RatingStars rating={rating} totalReviews={totalReviews} />

          {/* Category Badge */}
          {subcategoryName && (
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full w-fit">
              {subcategoryName}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
