import React from "react";
import { Clock } from "lucide-react";

const parsePercent = (str) => parseFloat(str?.replace("%", "")) || 0;

const ProgressBar = ({ label, value }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-800">{label}</span>
      <span className="text-sm text-gray-400 tabular-nums">{value}</span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-slate-800 rounded-full transition-all"
        style={{ width: value }}
      />
    </div>
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{children}</p>
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
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Recruitment Statistics</h3>

      {/* Jalur Pendaftaran Populer */}
      {admissionEntries.length > 0 && (
        <div>
          <SectionLabel>Jalur Pendaftaran Populer</SectionLabel>
          <div className="space-y-3">
            {admissionEntries.map(([track, pct]) => (
              <ProgressBar key={track} label={track} value={pct} />
            ))}
          </div>
        </div>
      )}

      {/* Durasi Proses Seleksi */}
      {recruitmentDuration && (
        <div className="border-t border-gray-100 pt-6">
          <SectionLabel>Durasi Proses Seleksi</SectionLabel>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <Clock size={18} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900">{recruitmentDuration}</p>
              <p className="text-xs text-gray-400">Rata-rata durasi seleksi</p>
            </div>
          </div>
        </div>
      )}

      {/* Tahapan Paling Umum */}
      {selectionEntries.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <SectionLabel>Tahapan Paling Umum</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {selectionEntries.map(([step, pct]) => (
              <span
                key={step}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-800"
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
