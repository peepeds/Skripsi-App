import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { BriefcaseBusiness, Clock3, MapPin, Package } from "lucide-react";

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

  const InformationField = ({ icon, label, value }) => {
    const FieldIcon = icon;

    return (
      <div className="flex min-h-[88px] gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <FieldIcon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-plus-jakarta text-lg font-bold text-slate-900">
            {label}
          </p>
          <div className="mt-1 font-inter text-sm text-slate-600">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-plus-jakarta text-lg font-bold text-slate-900">
          Internship Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Work Scheme */}
          <InformationField
            icon={MapPin}
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
            icon={Clock3}
            label="Avg. Duration"
            value={duration ? duration : <span className="text-gray-400">N/A</span>}
          />

          {/* Categories */}
          <InformationField
            icon={BriefcaseBusiness}
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
            icon={Package}
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
