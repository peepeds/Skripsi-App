import React from "react";

/**
 * Section 4: Submit with Summary
 * Displays complete review summary and submit button
 */
export const Section4Submit = ({ company, formData, onSubmit, loading, lookupData, categories }) => {

  const ratingCategories = [
    { key: "workCulture", label: "Budaya Kerja" },
    { key: "learningOpp", label: "Kesempatan Belajar" },
    { key: "mentorship", label: "Mentorship" },
    { key: "benefit", label: "Benefit" },
    { key: "workLifeBalance", label: "Work-Life Balance" },
  ];

  const renderStars = (rating) => {
    return (
      <span>
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </span>
    );
  };

  const averageRating = formData.ratings
    ? (
        (Object.values(formData.ratings).reduce((a, b) => a + b, 0) / 5) *
        1
      ).toFixed(1)
    : "0";

  return (
    <div className="space-y-5">
      {/* Summary Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Ringkasan Review Anda
        </h3>
        <p className="text-sm text-blue-800">
          Periksa kembali detail review sebelum mengirimkan
        </p>
      </div>

      {/* Company & Internship Info */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Informasi Perusahaan</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            {company?.companyLogo && (
              <img
                src={company.companyLogo}
                alt={company.companyName}
                className="w-12 h-12 object-contain"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">
                {company?.companyName}
              </p>
              <p className="text-sm text-gray-600">
                {company?.companyAbbreviation || ""}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Tipe Internship</p>
              <p className="font-semibold text-gray-900">
                {lookupData?.INTERNSHIP_TYPE?.find(opt => opt.value === formData.internshipType)?.label || formData.internshipType || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Skema Kerja</p>
              <p className="font-semibold text-gray-900">
                {lookupData?.SCHEME?.find(opt => opt.value === formData.workScheme)?.label || formData.workScheme || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Durasi</p>
              <p className="font-semibold text-gray-900">
                {formData.duration || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Tahun</p>
              <p className="font-semibold text-gray-900">
                {formData.year || "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 mb-1">Posisi</p>
              <p className="font-semibold text-gray-900">
                {formData.jobTitle || "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 mb-2">Subkategori</p>
              <div className="flex flex-wrap gap-1">
                {formData.subcategories?.length > 0
                  ? formData.subcategories.map((id) => {
                      const sub = categories
                        .flatMap((c) => c.subCategories)
                        .find((s) => s.subCategoryId === Number(id));
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          {sub?.subCategoryName || id}
                        </span>
                      );
                    })
                  : <span className="text-gray-500 text-sm">-</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Summary */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-4">Rating Pengalaman</h4>
        <div className="space-y-4">
          {ratingCategories.map((category) => (
            <div key={category.key} className="flex justify-between items-center">
              <p className="text-gray-700">{category.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-yellow-500">
                  {renderStars(formData.ratings?.[category.key] || 0)}
                </span>
                <span className="text-sm text-gray-600 min-w-max">
                  {formData.ratings?.[category.key] || 0}/5
                </span>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 mt-3 flex justify-between items-center">
            <p className="font-semibold text-gray-900">Rata-rata</p>
            <p className="font-semibold text-lg text-orange-500">
              {averageRating} / 5
            </p>
          </div>
        </div>
      </div>

      {/* Recruitment Process Summary */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-3">
          Proses Rekrutmen
        </h4>
        <div className="flex flex-wrap gap-2">
          {formData.recruitmentProcess?.length > 0 ? (
            formData.recruitmentProcess.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-gray-600 text-sm">Tidak ada proses dipilih</p>
          )}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-gray-600 mb-1">Tingkat Kesulitan Interview</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-500">
              {renderStars(formData.interviewDifficulty || 0)}
            </span>
            <span className="text-sm text-gray-600">
              {formData.interviewDifficulty || 0}/5
            </span>
          </div>
        </div>
      </div>

      {/* Testimony & Details */}
      <div className="space-y-3">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-2">
            Testimoni Kegiatan Magang
          </h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {formData.testimony || "-"}
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-2">Selama Magang</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {formData.pros || "-"}
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-2">
            Kelemahan Perusahaan Selama Magang
          </h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {formData.cons || "-"}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6 border-t border-gray-100">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Mengirim..." : "Kirim Review"}
        </button>
      </div>

      {/* Warning Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          ⓘ Review Anda akan melalui proses verifikasi sebelum dipublikasikan.
          Pastikan isi review sudah sesuai dengan kebijakan kami.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center">
        Dengan mengirim review ini, Anda menyetujui syarat dan kebijakan privasi kami.
      </p>
    </div>
  );
};
