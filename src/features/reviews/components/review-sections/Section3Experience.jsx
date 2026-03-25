import React from "react";

/**
 * Section 3: Pengalaman Magang
 * Displays: Recruitment Process, Interview Difficulty, Testimony, Duration Statement, and Weaknesses
 */
export const Section3Experience = ({ formData, onFormDataChange, lookupData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updated = [...(formData.recruitmentProcess || [])];

    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((item) => item !== value);
    }

    onFormDataChange({ recruitmentProcess: updated });
  };

  const handleInterviewDifficultyChange = (rating) => {
    onFormDataChange({ interviewDifficulty: rating });
  };

  const recruitmentOptions = lookupData?.RECRUITMENT_STEPS ?? [];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleInterviewDifficultyChange(star)}
            className={`text-3xl transition-colors hover:scale-110 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            type="button"
            title={`${star} bintang`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Proses Rekrutmen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Proses Rekrutmen Yang Dialami
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recruitmentOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`recruitment-${option.value}`}
                value={option.label}
                checked={
                  formData.recruitmentProcess?.includes(option.label) || false
                }
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
              />
              <label
                htmlFor={`recruitment-${option.value}`}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Tingkat Kesulitan Interview */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tingkat Kesulitan Interview
        </label>
        <div className="flex items-center justify-between">
          {renderStars(formData.interviewDifficulty || 0)}
          <span className="text-sm font-semibold text-gray-700 ml-3">
            {formData.interviewDifficulty || 0}/5
          </span>
        </div>
      </div>

      {/* Testimonial */}
      <div>
        <label htmlFor="testimony" className="block text-sm font-medium text-gray-700 mb-2">
          Testimoni Kegiatan Magang
        </label>
        <textarea
          id="testimony"
          name="testimony"
          value={formData.testimony || ""}
          onChange={handleInputChange}
          placeholder="Ceritakan secara singkat kegiatan dan pengalaman Anda selama magang..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.testimony || "").length}/1000 karakter
        </p>
      </div>

      {/* Duration Statement */}
      <div>
        <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2">
          Selama Magang
        </label>
        <textarea
          id="pros"
          name="pros"
          value={formData.pros || ""}
          onChange={handleInputChange}
          placeholder="Jelaskan apa yang Anda alami dan pelajari selama periode magang..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.pros || "").length}/1500 karakter
        </p>
      </div>

      {/* Weaknesses */}
      <div>
        <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2">
          Kelemahan Perusahaan Selama Magang
        </label>
        <textarea
          id="cons"
          name="cons"
          value={formData.cons || ""}
          onChange={handleInputChange}
          placeholder="Sebutkan area atau hal yang perlu ditingkatkan di perusahaan ini..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.cons || "").length}/1000 karakter
        </p>
      </div>
    </div>
  );
};
