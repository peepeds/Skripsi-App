import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export const InformationDetailsCard = ({ data }) => {
  if (!data) {
    return null;
  }

  const { type, workScheme, duration, subCategories } = data;

  const getInternshipTypeLabel = (type) => {
    const typeMap = {
      P: "Part-time",
      F: "Full-time",
      I: "Internship",
    };
    return typeMap[type] || type;
  };

  const InformationField = ({ icon: Icon, label, value }) => (
    <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
      <div className="shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 mb-0.5">{label}</p>
        <div className="text-sm text-gray-600">{value}</div>
      </div>
    </div>
  );

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">Internship Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Work Scheme */}
          <InformationField
            icon={WorkSchemeIcon}
            label="Work Scheme"
            value={
              workScheme && workScheme.length > 0 ? (
                workScheme.join(", ")
              ) : (
                <span className="text-gray-400">N/A</span>
              )
            }
          />

          {/* Duration */}
          <InformationField
            icon={DurationIcon}
            label="Avg. Duration"
            value={duration ? duration : <span className="text-gray-400">N/A</span>}
          />

          {/* Categories */}
          <InformationField
            icon={CategoriesIcon}
            label="Populer Categories"
            value={
              subCategories && subCategories.length > 0 ? (
                subCategories.join(", ")
              ) : (
                <span className="text-gray-400">N/A</span>
              )
            }
          />

          {/* Type */}
          <InformationField
            icon={TypeIcon}
            label="Type Internship"
            value={
              type ? getInternshipTypeLabel(type) : (
                <span className="text-gray-400">N/A</span>
              )
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

const WorkSchemeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const DurationIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.414a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 10l1.293-1.414z" clipRule="evenodd" />
  </svg>
);

const CategoriesIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const TypeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a2 2 0 002 2h8a2 2 0 002-2V7H6v5z" clipRule="evenodd" />
  </svg>
);
