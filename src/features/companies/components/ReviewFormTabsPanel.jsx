import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { ReviewStepTabs } from "./ReviewStepTabs";
import { Section1InformasiMagang } from "./review-sections/Section1InformasiMagang";
import { Section2Rating } from "./review-sections/Section2Rating";
import { Section3Pengalaman } from "./review-sections/Section3Pengalaman";
import { Section4Submit } from "./review-sections/Section4Submit";

/**
 * ReviewFormTabsPanel
 * Step-based interface untuk review form dengan 4 sections
 * - Full-width step indicators dengan connectors
 * - User hanya bisa mundur ke step sebelumnya
 * - Validasi per-step untuk lanjut ke step berikutnya
 */
export const ReviewFormTabsPanel = ({
  company,
  formData,
  onFormDataChange,
  onSubmit,
  loading,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Validate current step fields before allowing next
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.internshipType &&
          formData.workScheme &&
          formData.duration &&
          formData.year &&
          formData.position
        );
      case 2:
        return (
          formData.ratings?.workCulture > 0 &&
          formData.ratings?.learningOpp > 0 &&
          formData.ratings?.mentorship > 0 &&
          formData.ratings?.benefit > 0 &&
          formData.ratings?.workLifeBalance > 0
        );
      case 3:
        return (
          formData.recruitmentProcess?.length > 0 &&
          formData.interviewDifficulty > 0 &&
          formData.testimony?.trim() &&
          formData.durationStatement?.trim() &&
          formData.weaknesses?.trim()
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleStepChange = (stepNumber) => {
    // User can only go back to previous steps
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      const newCompleted = [...completedSteps, currentStep];
      setCompletedSteps(newCompleted);
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Informasi Magang
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Isi informasi dasar tentang pengalaman magang Anda
            </p>
            <Section1InformasiMagang
              company={company}
              formData={formData}
              onFormDataChange={onFormDataChange}
            />
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Berikan Rating Pengalaman
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Berikan rating untuk setiap aspek pengalaman Anda
            </p>
            <Section2Rating
              company={company}
              formData={formData}
              onFormDataChange={onFormDataChange}
            />
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Detail Pengalaman Magang
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Jelaskan pengalaman, proses rekrutmen, dan saran Anda
            </p>
            <Section3Pengalaman
              formData={formData}
              onFormDataChange={onFormDataChange}
            />
          </>
        );

      case 4:
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Ringkasan & Kirim Review
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Periksa kembali semua detail sebelum mengirim review
            </p>
            <Section4Submit
              company={company}
              formData={formData}
              onSubmit={onSubmit}
              loading={loading}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Full-width Step Tabs */}
      <ReviewStepTabs
        currentStep={currentStep}
        onStepChange={handleStepChange}
        completedSteps={completedSteps}
      />

      {/* Step Content in Container */}
      <div className="bg-white py-8">
        <Container>
          <div className="space-y-6">
            {/* Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            {currentStep !== 4 && (
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kembali
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!validateCurrentStep()}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lanjut
                </button>
              </div>
            )}

            {/* Cancel Button (Only on First Step) */}
            {currentStep === 1 && onCancel && (
              <button
                onClick={onCancel}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};
