import React from "react";

const DIFFICULTY_MAP = {
  1: { label: "Sangat Mudah", emoji: "😊", color: "text-green-600" },
  2: { label: "Mudah", emoji: "🙂", color: "text-green-600" },
  3: { label: "Sedang", emoji: "😐", color: "text-amber-500" },
  4: { label: "Sulit", emoji: "🤯", color: "text-orange-600" },
  5: { label: "Sangat Sulit", emoji: "🤬", color: "text-red-600" },
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

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Average Difficulty</h3>
      <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
        <div className="w-16 h-16 bg-yellow-50 border border-yellow-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
          {level.emoji}
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-base text-gray-400 font-normal">/ 5.0</span>
          </div>
          <p className={`text-sm font-semibold ${level.color}`}>{level.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">Berdasarkan {count} ulasan</p>
        </div>
      </div>
    </div>
  );
};
