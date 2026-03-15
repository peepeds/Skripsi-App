import React from "react";

/**
 * Component untuk menampilkan biography/deskripsi perusahaan
 * 
 * @param {string} bio - Bio/deskripsi perusahaan
 */
export const CompanyBioSection = ({ bio }) => {
  if (!bio) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {bio}
      </div>
    </div>
  );
};
