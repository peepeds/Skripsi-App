import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CompanyCardHorizontal = ({
  companyName,
  companyAbbreviation,
  website,
  isPartner,
  companySlug,
}) => {
  const [logoValid, setLogoValid] = useState(null);

  const logoUrl = website
    ? `https://www.google.com/s2/favicons?domain=${website}&sz=256`
    : null;

  useEffect(() => {
    if (!logoUrl) {
      setLogoValid(false);
      return;
    }

    const img = new Image();

    img.onload = () => {
      if (img.naturalWidth <= 16) {
        setLogoValid(false);
      } else {
        setLogoValid(true);
      }
    };

    img.onerror = () => setLogoValid(false);

    img.src = logoUrl;
  }, [logoUrl]);

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
          <h3 className="font-medium text-lg">{companyName}</h3>

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

          {isPartner && (
            <div className="text-green-500 text-xs mt-1">
              Partner
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CompanyCardHorizontal;