import React from "react";
import { Clock, MessageCircle, Lightbulb } from "lucide-react";

const AVATAR_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500",
  "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500",
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const DIFFICULTY_MAP = {
  1: { label: "Sangat Mudah", emoji: "😊", className: "bg-green-50 text-green-700 border-green-200" },
  2: { label: "Mudah", emoji: "🙂", className: "bg-green-50 text-green-700 border-green-200" },
  3: { label: "Sedang", emoji: "😐", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  4: { label: "Sulit", emoji: "🤯", className: "bg-orange-50 text-orange-700 border-orange-200" },
  5: { label: "Sangat Sulit", emoji: "🤬", className: "bg-red-50 text-red-700 border-red-200" },
};

export const RecruitmentProcessCard = ({ data }) => {
  const {
    jobTitle,
    durationMonths,
    admissionTrack,
    recruitmentDuration,
    interviewDifficulty,
    recruitmentSteps = [],
    selectionProcess,
    exampleQuestions,
    tipsTricks,
    createdByName,
  } = data;

  const displayName = createdByName ?? "Anonim";
  const difficulty = DIFFICULTY_MAP[interviewDifficulty];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold ${getAvatarColor(displayName)}`}
        >
          {getInitials(displayName)}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{displayName}</p>
          <p className="text-sm text-gray-600">{jobTitle}</p>
          {durationMonths && (
            <p className="text-xs text-gray-400">Magang {durationMonths} bulan</p>
          )}
        </div>
      </div>

      {/* Badge row */}
      <div className="flex flex-wrap gap-2">
        {admissionTrack && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium">
            🌐 {admissionTrack}
          </span>
        )}
        {difficulty && (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${difficulty.className}`}>
            {difficulty.emoji} {difficulty.label}
          </span>
        )}
        {recruitmentDuration && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium">
            <Clock size={12} /> {recruitmentDuration}
          </span>
        )}
      </div>

      {/* Tahapan Seleksi */}
      {recruitmentSteps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tahapan Seleksi</p>
          <div className="flex flex-wrap gap-2">
            {recruitmentSteps.map((step, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-700"
              >
                <span className="text-orange-400">○</span> {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pengalaman Seleksi */}
      {selectionProcess && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pengalaman Seleksi</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectionProcess}</p>
        </div>
      )}

      {/* Contoh Pertanyaan Wawancara */}
      {exampleQuestions && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            <MessageCircle size={13} /> Contoh Pertanyaan Wawancara
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exampleQuestions}</p>
        </div>
      )}

      {/* Tips Lolos Seleksi */}
      {tipsTricks && (
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
            <Lightbulb size={13} /> Tips Lolos Seleksi
          </p>
          <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-line">{tipsTricks}</p>
        </div>
      )}
    </div>
  );
};
