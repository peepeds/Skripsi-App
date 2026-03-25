import React from "react";

/**
 * Section 2: Rating & Review Title
 * Displays 5 separate rating categories with star ratings (1-5) each
 * Categories: Work Culture, Learning Opportunities, Mentorship, Benefits, Work-Life Balance
 */
export const Section2Rating = ({ company, formData, onFormDataChange, lookupData }) => {

  const handleRatingChange = (categoryKey, rating) => {
    onFormDataChange({
      ratings: {
        ...formData.ratings,
        [categoryKey]: rating,
      },
    });
  };

  const ratingCategories = [
    {
      key: "workCulture",
      label: "Budaya Kerja",
      description: "Lingkungan Kerja Dan Budaya Perusahaan",
      icon: "🏢",
    },
    {
      key: "learningOpp",
      label: "Kesempatan Belajar",
      description: "Tugas Dan Skill Yang Didapat Selama Magang Dengan Ekspansi Anda",
      icon: "📚",
    },
    {
      key: "mentorship",
      label: "Mentorship",
      description: "Bimbingan Dari Mentor Atau Atasan Selama Magang",
      icon: "👨‍🏫",
    },
    {
      key: "benefit",
      label: "Benefit",
      description: "Kompensasi Atau Benefit Yang Berikan Perusahaan Selama Proses Magang",
      icon: "🎁",
    },
    {
      key: "workLifeBalance",
      label: "Work-Life Balance",
      description: "Jam Waktu Kerja Magang Dan Workload Yang Diberikan",
      icon: "⚖️",
    },
  ];

  const renderStars = (rating, categoryKey) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(categoryKey, star)}
            className={`text-2xl transition-colors hover:scale-110 ${
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
    <div className="space-y-6">
      {/* Company Info Card */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wide">
          Berikan Rating Perusahaan
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-semibold text-gray-900 mb-2">{company?.companyName}</p>
          <p className="text-sm text-gray-600 mb-2">
            {formData.year} | {formData.duration}
          </p>
          <p className="text-sm text-gray-600">
            {lookupData.INTERNSHIP_TYPE?.find(opt => opt.value === formData.internshipType)?.label || formData.internshipType} | {lookupData.SCHEME?.find(opt => opt.value === formData.workScheme)?.label || formData.workScheme} | {formData.jobTitle}
          </p>
        </div>
      </div>

      {/* Rating Section Card */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Rating Pengalaman Magang</h4>
          <p className="text-sm text-gray-600">Berikan Rating Untuk Berbagai Aspek Pengalaman Magang</p>
        </div>

        {/* Rating Categories */}
        <div className="space-y-4">
          {ratingCategories.map((category) => (
            <div
              key={category.key}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-1">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 text-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">
                      {category.label}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 ml-4">
                {renderStars(formData.ratings?.[category.key] || 0, category.key)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
