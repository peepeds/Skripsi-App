import React from "react";

const DIFFICULTY_OPTIONS = [
  { value: 1, label: "Sangat Mudah", emoji: "😊" },
  { value: 2, label: "Mudah", emoji: "🙂" },
  { value: 3, label: "Sedang", emoji: "😐" },
  { value: 4, label: "Sulit", emoji: "🤯" },
  { value: 5, label: "Sangat Sulit", emoji: "🤬" },
];

export const Step4Submit = ({ form, lookupData, categories, company }) => {
  const values = form.getValues();

  const avg = values.ratings
    ? (Object.values(values.ratings).reduce((a, b) => a + b, 0) / 5).toFixed(1)
    : "0";

  const schemeLabel = lookupData?.SCHEME?.find((o) => o.value === values.workScheme)?.label ?? values.workScheme;
  const typeLabel = lookupData?.INTERNSHIP_TYPE?.find((o) => o.value === values.internshipType)?.label ?? values.internshipType;
  const admissionLabel = lookupData?.ADMISSION_TRACK?.find((o) => o.value === values.admissionTrack)?.label ?? values.admissionTrack;
  const durationLabel = lookupData?.RECRUITMENT_DURATION?.find((o) => o.value === values.recruitmentDurationCode)?.label ?? values.recruitmentDurationCode;
  const recruitmentStepOptions = lookupData?.RECRUITMENT_STEPS ?? [];
  const difficultyOption = DIFFICULTY_OPTIONS.find((o) => o.value === values.interviewDifficulty);
  const categoryName = categories.find((c) => c.categoryId === values.category)?.categoryName ?? "";
  const allSubcategories = categories.flatMap((c) => c.subCategories ?? []);
  const subcategoryNames = (values.SubCategoryIds ?? [])
    .map((id) => allSubcategories.find((s) => s.subCategoryId === id)?.subCategoryName)
    .filter(Boolean);

  const metaLine1 = [categoryName, ...subcategoryNames].filter(Boolean).join(" • ");
  const metaLine2 = [schemeLabel, typeLabel, values.duration && values.year ? `${values.duration} (${values.year})` : null]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <div className="bg-slate-800 rounded-2xl p-6 flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-xl mb-1">
            {values.jobTitle} di {company?.companyName}
          </p>
          {metaLine1 && <p className="text-slate-300 text-sm mb-0.5">{metaLine1}</p>}
          {metaLine2 && <p className="text-slate-300 text-sm">{metaLine2}</p>}
        </div>
        <div className="bg-slate-700 rounded-xl px-4 py-2 flex items-center gap-2 flex-shrink-0">
          <span className="text-[#F97316] text-lg">★</span>
          <span className="text-white font-bold text-2xl leading-none">{avg}</span>
          <span className="text-slate-400 text-sm">/ 5</span>
        </div>
      </div>

      {/* Ulasan Utama */}
      <div className="border border-gray-200 rounded-2xl p-6">
        <p className="font-bold text-lg text-gray-900 mb-4">Ulasan Utama</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-gray-700 italic text-sm">&ldquo;{values.testimony}&rdquo;</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="font-semibold text-green-700 text-sm mb-2">Kelebihan:</p>
            <p className="text-green-700 text-sm">{values.pros}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="font-semibold text-red-500 text-sm mb-2">Kekurangan:</p>
            <p className="text-red-500 text-sm">{values.cons}</p>
          </div>
        </div>
      </div>

      {/* Proses Rekrutmen */}
      <div className="border border-gray-200 rounded-2xl p-6 space-y-5">
        <p className="font-bold text-lg text-gray-900">Proses Rekrutmen</p>

        <div className="grid grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Jalur Pendaftaran</p>
            <p className="text-sm font-semibold text-gray-900">{admissionLabel || "-"}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tingkat Kesulitan</p>
            <p className="text-sm font-semibold text-gray-900">
              {difficultyOption ? `${difficultyOption.emoji} ${difficultyOption.label}` : "-"}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Durasi Seleksi</p>
            <p className="text-sm font-semibold text-gray-900">{durationLabel || "-"}</p>
          </div>
        </div>

        {values.recruitmentSteps?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tahapan Seleksi:</p>
            <div className="flex flex-wrap gap-2">
              {values.recruitmentSteps.map((id) => {
                const step = recruitmentStepOptions.find((s) => Number(s.value) === id);
                return (
                  <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700">
                    <span className="text-orange-500 text-xs">✓</span>
                    {step?.label || id}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {values.selectionProcess && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Pengalaman Proses Seleksi:</p>
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">{values.selectionProcess}</p>
            </div>
          </div>
        )}

        {values.exampleQuestions && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Contoh Pertanyaan Wawancara:</p>
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">{values.exampleQuestions}</p>
            </div>
          </div>
        )}

        {values.tipsTricks && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tips Lolos Seleksi:</p>
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">{values.tipsTricks}</p>
            </div>
          </div>
        )}
      </div>

      {/* Pernyataan Kejujuran */}
      <div className="border border-gray-200 rounded-2xl p-6">
        <p className="font-bold text-lg text-gray-900 mb-2">
          Pernyataan Kejujuran <span className="text-red-500">*</span>
        </p>
        <p className="text-sm text-gray-500">
          Saya menyatakan bahwa ulasan ini adalah pengalaman asli saya, ditulis dengan jujur,
          dan tidak mengandung unsur SARA atau ujaran kebencian.
        </p>
      </div>
    </div>
  );
};
