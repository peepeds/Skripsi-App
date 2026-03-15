import React from "react";
import { Link } from "react-router-dom";
import { useLogoValidation } from "../hooks/useLogoValidation";

export const CompanyCardHorizontal = ({
  companyName,
  companyAbbreviation,
  website,
  isPartner,
  companySlug,
}) => {
  const { logoUrl, logoValid } = useLogoValidation(website);

  const initial =
    companyAbbreviation?.charAt(0) ||
    companyName?.charAt(0) ||
    "?";

  return (
    <Link to={`/company/${companySlug}`} className="block">
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
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
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-lg">{companyName}</h3>
            {isPartner && (
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {companyAbbreviation || "N/A"}
          </p>

          {website && (
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {website}
            </a>
          )}
        </div>
      </div>
    </Link>
  );
};