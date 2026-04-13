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
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">Reviews Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {ratingFields.map(({ key, label }) => {
          const rating = data[key];
          const ratingPercentage = rating ? (rating / 5) * 100 : 0;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                {rating !== undefined && rating !== null ? (
                  <span className="text-sm font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">N/A</span>
                )}
              </div>
              {rating !== undefined && rating !== null && (
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
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
