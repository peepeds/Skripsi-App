import React from "react";
import { Clock } from "lucide-react";

const parsePercent = (str) => parseFloat(str?.replace("%", "")) || 0;

const ProgressBar = ({ label, value }) => (
  <div className="space-y-1.5">
  <div className="flex items-center justify-between">
      <span className="text-sm text-gray-800">{label}</span>
      <span className="text-sm text-gray-400 tabular-nums">{value}</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full bg-slate-800 rounded-full transition-all"
        style={{ width: value }}
      />
    </div>
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</p>
);

export const RecruitmentStatisticsCard = ({ statistics }) => {
  if (!statistics) return null;

  const { admissionTrack, recruitmentDuration, frequentSelectionProcess } = statistics;

  const admissionEntries = Object.entries(admissionTrack ?? {}).sort(
    ([, a], [, b]) => parsePercent(b) - parsePercent(a)
  );
  const selectionEntries = Object.entries(frequentSelectionProcess ?? {}).sort(
    ([, a], [, b]) => parsePercent(b) - parsePercent(a)
  );

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">Recruitment Statistics</h3>

      {admissionEntries.length > 0 && (
        <div>
          <SectionLabel>Popular Application Tracks</SectionLabel>
          <div className="space-y-3">
            {admissionEntries.map(([track, pct]) => (
              <ProgressBar key={track} label={track} value={pct} />
            ))}
          </div>
        </div>
      )}

      {recruitmentDuration && (
        <div className="border-t border-gray-100 pt-6">
          <SectionLabel>Selection Duration</SectionLabel>
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
            <Clock size={18} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900">{recruitmentDuration}</p>
              <p className="text-xs text-gray-400">Average selection duration</p>
            </div>
          </div>
        </div>
      )}

      {selectionEntries.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <SectionLabel>Most Common Stages</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {selectionEntries.map(([step, pct]) => (
              <span
                key={step}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-800"
              >
                {step}
                <span className="text-gray-400 text-xs">({pct})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
