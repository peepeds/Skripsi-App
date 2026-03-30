import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { StarRating } from "@/components/ui/StarRating";

export const ReviewRatingsCard = ({ data }) => {
  if (!data) {
    return null;
  }

  const ratingFields = [
    { key: "workCulture", label: "Work Culture" },
    { key: "learningOpp", label: "Learning Opportunities" },
    { key: "mentorship", label: "Mentorship" },
    { key: "benefit", label: "Benefits" },
    { key: "workLifeBalance", label: "Work-Life Balance" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ratingFields.map(({ key, label }) => {
          const rating = data[key];

          return (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{label}</p>
              {rating !== undefined && rating !== null ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                  <StarRating rating={rating} size="sm" />
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
