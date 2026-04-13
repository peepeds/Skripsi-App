import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export const ReviewRatingsCard = ({ data }) => {
  if (!data) {
    return null;
  }

  const ratingFields = [
    { key: "workCulture", label: "Budaya Kerja" },
    { key: "learningOpp", label: "Kesempatan Belajar" },
    { key: "mentorship", label: "Mentorship" },
    { key: "benefit", label: "Benefit" },
    { key: "workLifeBalance", label: "Work-Life Balance" },
  ];

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="font-plus-jakarta text-lg font-bold text-slate-900">Reviews Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {ratingFields.map(({ key, label }) => {
          const rating = data[key];
          const ratingPercentage = rating ? (rating / 5) * 100 : 0;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-inter text-sm font-medium text-slate-700">{label}</p>
                {rating !== undefined && rating !== null ? (
                  <span className="font-inter text-sm font-semibold text-slate-900">
                    {rating.toFixed(1)}
                  </span>
                ) : (
                  <span className="font-inter text-sm text-slate-400">N/A</span>
                )}
              </div>
              {rating !== undefined && rating !== null && (
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${ratingPercentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
