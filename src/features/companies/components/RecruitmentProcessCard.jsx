import React, { useState } from "react";
import { Clock, Lightbulb, MessageCircle, Share2, ThumbsUp } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

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
  const helpfulCount = data.helpfulCount ?? data.helpful ?? 0;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(displayName)}`}
        >
          {getInitials(displayName)}
        </div>
        <div>
          <p className="font-plus-jakarta text-[26px] font-semibold text-slate-900 md:text-[22px]">{displayName}</p>
          <p className="font-inter text-sm text-slate-600">{jobTitle}</p>
          {durationMonths && (
            <p className="font-inter text-xs text-slate-400">Magang {durationMonths} bulan</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {admissionTrack && (
          <span className="inline-flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-100/70 px-3 py-1.5 font-inter text-sm font-semibold text-sky-700">
            🌐 {admissionTrack}
          </span>
        )}
        {difficulty && (
          <span className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 font-inter text-sm font-semibold ${difficulty.className}`}>
            {difficulty.emoji} {difficulty.label}
          </span>
        )}
        {recruitmentDuration && (
          <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-1.5 font-inter text-sm font-semibold text-slate-600">
            <Clock size={12} /> {recruitmentDuration}
          </span>
        )}
      </div>

      {recruitmentSteps.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 font-inter text-xs font-semibold uppercase tracking-wide text-slate-500">Tahapan Seleksi</p>
          <div className="flex flex-wrap gap-2">
            {recruitmentSteps.map((step, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 font-inter text-sm text-slate-700"
              >
                <span className="text-orange-400">○</span> {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectionProcess && (
        <div>
          <p className="mb-2 font-inter text-xs font-semibold uppercase tracking-wide text-slate-500">Pengalaman Seleksi</p>
          <p className="font-inter text-base leading-relaxed text-slate-700 whitespace-pre-line">{selectionProcess}</p>
        </div>
      )}

      {exampleQuestions && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-wide text-slate-500">
            <MessageCircle size={13} /> Contoh Pertanyaan Wawancara
          </p>
          <p className="font-inter text-base leading-relaxed text-slate-700 whitespace-pre-line">{exampleQuestions}</p>
        </div>
      )}

      {tipsTricks && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-wide text-amber-700">
            <Lightbulb size={13} /> Tips Lolos Seleksi
          </p>
          <p className="font-inter text-base leading-relaxed text-amber-800 whitespace-pre-line">{tipsTricks}</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-inter text-sm font-semibold text-slate-600 hover:bg-slate-50"
          type="button"
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful ({helpfulCount})
        </button>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          onClick={handleShare}
          type="button"
          title={copied ? "Copied" : "Share"}
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
