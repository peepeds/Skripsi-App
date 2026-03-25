import React, { useState, useEffect, useRef } from "react";
import { getJobOptions } from "@/api/reviewApi";

/**
 * Section 1: Informasi Magang
 * Displays company info (fixed from slug) + Tipe Internship + Skema Kerja + Duration + Year + Position (searchable) + Category + Subcategory
 */
export const Section1InternshipInfo = ({
  company,
  formData,
  onFormDataChange,
  lookupData,
  categories,
}) => {
  const [jobQuery, setJobQuery] = useState(formData.jobTitle || "");
  const [jobOptions, setJobOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  const handleJobSelect = (jobTitle) => {
    onFormDataChange({
      jobTitle,
    });
    setJobQuery(jobTitle);
    setShowDropdown(false);
  };

  const handleAddSubcategory = (id) => {
    const numId = Number(id);
    if (!numId || formData.subcategories.length >= 4) return;
    if (formData.subcategories.includes(numId)) return;
    onFormDataChange({ subcategories: [...formData.subcategories, numId] });
  };

  const handleRemoveSubcategory = (id) => {
    onFormDataChange({
      subcategories: formData.subcategories.filter((s) => s !== id),
    });
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value ? Number(e.target.value) : "";
    onFormDataChange({ category: categoryId });
  };

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (jobQuery.trim().length <= 3) {
        setJobOptions([]);
        return;
      }

      try {
        const response = await getJobOptions(jobQuery);
        // Response contains array of { jobTitle: "..." }
        // If empty array, user can still manually input
        setJobOptions((response.result || []).slice(0, 5));
      } catch (error) {
        console.error("Error fetching job options:", error);
        setJobOptions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [jobQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSubcategories = categories.flatMap((c) => c.subCategories);

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
      <div className="border border-gray-200 rounded-lg p-6 space-y-10">
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
              {(lookupData?.INTERNSHIP_TYPE ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
              {(lookupData?.SCHEME ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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

          {/* Posisi Magang - Searchable Dropdown */}
          <div ref={dropdownRef} className="relative">
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
              value={jobQuery}
              onChange={(e) => {
                const text = e.target.value;
                setJobQuery(text);
                setShowDropdown(true);
                onFormDataChange({
                  jobTitle: text,
                  category: "",
                  subcategories: [],
                });
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Cari posisi magang..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            {showDropdown && jobOptions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
                {jobOptions.map((job, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleJobSelect(job.jobTitle)}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {job.jobTitle}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Category & Subcategory in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category - Active Select */}
          <div>
            <label
              htmlFor="category"
              className="flex items-center text-sm font-semibold text-gray-900 mb-3"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs mr-3">
                🏷️
              </span>
              Category
            </label>
            <select
              id="category"
              value={formData.category || ""}
              onChange={handleCategoryChange}
              disabled={!formData.jobTitle || formData.subcategories.length >= 4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory - Dropdown only */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs mr-3">
                📂
              </span>
              Subkategori
              <span className="ml-2 text-xs text-gray-400 font-normal">maks. 4</span>
            </label>

            {/* Subcategory select — always rendered */}
            <select
              value=""
              onChange={(e) => handleAddSubcategory(e.target.value)}
              disabled={!formData.jobTitle || !formData.category || formData.subcategories.length >= 4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm text-gray-600"
            >
              <option value="">Pilih subkategori...</option>
              {(categories.find((c) => c.categoryId === formData.category)?.subCategories ?? [])
                .filter((s) => !formData.subcategories.includes(s.subCategoryId))
                .map((sub) => (
                  <option key={sub.subCategoryId} value={sub.subCategoryId}>
                    {sub.subCategoryName}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Selected badges — full-width row */}
        {formData.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.subcategories.map((id) => {
              const sub = allSubcategories.find((s) => s.subCategoryId === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                >
                  {sub?.subCategoryName || id}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategory(id)}
                    className="ml-1 leading-none hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
