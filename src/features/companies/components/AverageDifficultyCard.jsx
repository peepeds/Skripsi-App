import React from "react";
import { CircleCheckBig, Smile, Meh, Frown, OctagonAlert } from "lucide-react";

const DIFFICULTY_MAP = {
  1: { label: "Very Easy", Icon: CircleCheckBig, color: "text-green-600" },
  2: { label: "Easy", Icon: Smile, color: "text-green-600" },
  3: { label: "Moderate", Icon: Meh, color: "text-amber-500" },
  4: { label: "Hard", Icon: Frown, color: "text-orange-600" },
  5: { label: "Very Hard", Icon: OctagonAlert, color: "text-red-600" },
};

const getDifficultyLevel = (rating) => {
  if (rating <= 1.5) return DIFFICULTY_MAP[1];
  if (rating <= 2.5) return DIFFICULTY_MAP[2];
  if (rating <= 3.5) return DIFFICULTY_MAP[3];
  if (rating <= 4.5) return DIFFICULTY_MAP[4];
  return DIFFICULTY_MAP[5];
};

export const AverageDifficultyCard = ({ difficulty }) => {
  if (!difficulty) return null;

  const { rating, count } = difficulty;
  const level = getDifficultyLevel(rating);
  const DifficultyIcon = level.Icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Average Difficulty</h3>
      <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-yellow-100 bg-yellow-50 text-slate-500">
          <DifficultyIcon className="h-8 w-8" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-base text-gray-400 font-normal">/ 5.0</span>
          </div>
          <p className={`text-sm font-semibold ${level.color}`}>{level.label}</p>
          <p className="mt-0.5 text-xs text-gray-400">Based on {count} reviews</p>
        </div>
      </div>
    </div>
  );
};
