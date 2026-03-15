import React from "react";

/**
 * Section 1: Informasi Magang
 * Displays company info (fixed from slug) + Tipe Internship + Skema Kerja + Duration + Year + Position
 */
export const Section1InformasiMagang = ({
  company,
  formData,
  onFormDataChange,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Company Info Card */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wide">
          Perusahaan
        </h3>
        <div className="flex items-center gap-4">
          {company?.companyLogo && (
            <img
              src={company.companyLogo}
              alt={company.companyName}
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {company?.companyName}
            </p>
            <p className="text-sm text-gray-600">
              {company?.companyAbbreviation || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Tipe Internship & Skema Kerja in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipe Internship */}
          <div>
            <label
              htmlFor="internshipType"
              className="flex items-center text-sm font-semibold text-gray-900 mb-3"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs mr-3">
                💼
              </span>
              Tipe Internship
            </label>
            <select
              id="internshipType"
              name="internshipType"
              value={formData.internshipType || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Pilih tipe internship</option>
              <option value="Paid Internship">Paid Internship</option>
              <option value="Unpaid Internship">Unpaid Internship</option>
            </select>
          </div>

          {/* Skema Kerja */}
          <div>
            <label
              htmlFor="workScheme"
              className="flex items-center text-sm font-semibold text-gray-900 mb-3"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs mr-3">
                🏢
              </span>
              Skema Kerja
            </label>
            <select
              id="workScheme"
              name="workScheme"
              value={formData.workScheme || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Pilih skema kerja</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Durasi Magang / Tahun Magang / Posisi Magang in Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Durasi Magang */}
          <div>
            <label
              htmlFor="duration"
              className="flex items-center text-sm font-semibold text-gray-900 mb-3"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs mr-3">
                📅
              </span>
              Durasi Magang
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Pilih durasi</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={`${month} bulan`}>
                  {month} bulan
                </option>
              ))}
            </select>
          </div>

          {/* Tahun Magang */}
          <div>
            <label
              htmlFor="year"
              className="flex items-center text-sm font-semibold text-gray-900 mb-3"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs mr-3">
                📆
              </span>
              Tahun Magang
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year || ""}
              onChange={handleInputChange}
              placeholder="YYYY"
              maxLength="4"
              pattern="\d{4}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            {formData.year && !/^\d{4}$/.test(formData.year) && (
              <p className="text-red-500 text-xs mt-1">Format harus YYYY (contoh: 2025)</p>
            )}
          </div>

          {/* Posisi Magang */}
          <div>
            <label
              htmlFor="position"
              className="flex items-center text-sm font-semibold text-gray-900 mb-3"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs mr-3">
                👤
              </span>
              Posisi Magang
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position || ""}
              onChange={handleInputChange}
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
