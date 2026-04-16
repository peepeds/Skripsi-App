import React, { useState, useEffect } from "react";
import { CheckSquare } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useLookup } from "@/hooks/useLookup";
import { getCategories } from "@/api/categoryApi";
import { ReviewStepTabs } from "./ReviewStepTabs";
import { Step1InternshipInfo } from "./review-steps/StepInfo";
import { Step2Rating } from "./review-steps/StepRating";
import { Step3Experience } from "./review-steps/StepExperience";
import { Step4Submit } from "./review-steps/StepSubmit";
import { useReviewWizard } from "../hooks/useReviewWizard";

export const ReviewFormTabsPanel = ({ company, onSubmit: onFinalSubmit, loading, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const { data: lookupData } = useLookup("INTERNSHIP_REVIEW");
  const { step, form, onNext, onBack, onSubmit, isLastStep } = useReviewWizard(onFinalSubmit);

  useEffect(() => {
    let cancelled = false;
    getCategories().then((res) => {
      if (!cancelled && res.success) setCategories(res.result);
    });
    return () => { cancelled = true; };
  }, []);

  const stepProps = { form, lookupData, categories, company };
  const isFirstStep = step === 0;

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Informasi Magang</h2>
            <p className="mb-6 text-sm text-gray-600">Isi informasi dasar tentang pengalaman magang Anda</p>
            <Step1InternshipInfo {...stepProps} />
          </>
        );
      case 1:
        return (
          <>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Penilaian & Ulasan</h2>
            <p className="mb-6 text-sm text-gray-600">Bagikan penilaian objektifmu tentang pengalaman magang di sana.</p>
            <Step2Rating {...stepProps} />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Proses Rekrutmen dan Cara Apply</h2>
            <p className="mb-6 text-sm text-gray-600">Bantu kandidat lain mendaftar di perusahaan yang mereka inginkan.</p>
            <Step3Experience {...stepProps} />
          </>
        );
      case 3:
        return (
          <>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Pemeriksaan Ulang (Konfirmasi)</h2>
            <p className="mb-6 text-sm text-gray-600">Pastikan semua data yang kamu isi sudah benar sebelum diunggah.</p>
            <Step4Submit {...stepProps} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ReviewStepTabs currentStep={step + 1} onStepChange={() => {}} highestReachedStep={step + 1} />

      <div className="bg-white py-8">
        <Container>
          <div className="space-y-6">
            {renderStepContent()}

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                onClick={isFirstStep ? onCancel : onBack}
                disabled={isFirstStep && !onCancel}
                className="px-8 py-3 border border-gray-200 rounded-xl font-semibold text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFirstStep ? "Batal" : "Kembali"}
              </button>

              {isLastStep ? (
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckSquare size={18} />
                  Unggah Ulasan
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Lanjut
                </button>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
