import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useLogoValidation } from "../hooks/useLogoValidation";

export const CompanyGeneralInfoSection = ({
  companyId,
  companySlug,
  companyName,
  companyAbbreviation,
  website,
  isPartner,
}) => {
  const navigate = useNavigate();
  const { logoUrl, logoValid } = useLogoValidation(website);

  const initial =
    companyAbbreviation?.charAt(0) ||
    companyName?.charAt(0) ||
    "?";

  return (
    <section className="bg-gray-50 py-12">
      <Container>
        {/* Header dengan Logo dan Nama */}
        <div className="flex items-center space-x-6">
          {/* Logo / Avatar */}
          <div className="flex-shrink-0">
            {logoValid ? (
              <div className="w-24 h-24 bg-gray-50 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={logoUrl}
                  alt={companyName}
                  loading="lazy"
                  className="w-20 h-20 object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-3xl shadow-sm">
                {initial}
              </div>
            )}
          </div>

          {/* Nama dan Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
              {isPartner && (
                <div className="group relative">
                  <svg
                    className="w-6 h-6 text-blue-500 shrink-0 cursor-help"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Company ini bermitra dengan Binus Enrichment Program
                  </div>
                </div>
              )}
            </div>
            {companyAbbreviation && (
              <p className="text-gray-600 text-lg font-medium mb-3">
                {companyAbbreviation}
              </p>
            )}
            {website && (
              <a
                href={`https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {website}
              </a>
            )}
          </div>
        </div>

        {/* Button Tulis Review */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => {
              navigate(`/review/${companySlug}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Tulis Review
          </Button>
        </div>
      </Container>
    </section>
  );
};
