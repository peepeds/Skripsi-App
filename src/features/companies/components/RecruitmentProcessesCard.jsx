import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { StarRating } from "@/components/ui/StarRating";

export const RecruitmentProcessesCard = ({ data }) => {
  if (!data) {
    return null;
  }

  const { rating, steps } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruitment Process</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Difficulty Rating</p>
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

        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Process Steps</p>
          {steps && steps.length > 0 ? (
            <ol className="space-y-2">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="font-semibold text-gray-400">{index + 1}.</span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
