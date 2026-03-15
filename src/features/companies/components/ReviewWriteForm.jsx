import React from "react";
import { ReviewFormTabsPanel } from "./ReviewFormTabsPanel";

/**
 * ReviewWriteForm Component
 * Tab-based form component untuk menulis review dengan 4 sections
 * 
 * @param {Object} company - Company object dengan companyId, companyName, logo, dll
 * @param {function} onSubmit - Callback function saat final submit
 * @param {boolean} loading - Loading state
 * @param {function} onCancel - Callback function untuk tombol batal
 */
export const ReviewWriteForm = ({
  company,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({});

  const handleFormDataChange = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const handleSubmit = (submittedData) => {
    onSubmit({
      ...formData,
      ...submittedData,
    });
  };

  return (
    <ReviewFormTabsPanel
      company={company}
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleSubmit}
      loading={loading}
      onCancel={onCancel}
    />
  );
};
