import React from "react";
import { Container } from "@/components/layout/Container";

/**
 * ReviewStepTabs Component
 * ===========================
 * Visual step indicator with tab navigation
 * - Full-width section with step connectors
 * - Numbered steps (1, 2, 3, 4) with labels
 * - User can only go backward (revert to previous steps)
 * - Completed steps show checkmark
 * 
 * @param {number} currentStep - Current active step (1-4)
 * @param {Function} onStepChange - Callback when user clicks a step
 * @param {Array} completedSteps - Array of completed step numbers
 */
export const ReviewStepTabs = ({
  currentStep = 1,
  onStepChange,
  completedSteps = [],
}) => {
  const steps = [
    { number: 1, label: "Informasi Magang" },
    { number: 2, label: "Rating" },
    { number: 3, label: "Pengalaman" },
    { number: 4, label: "Ringkasan & Kirim" },
  ];

  const handleStepClick = (stepNumber) => {
    // User can only go back to previous steps, not forward
    if (stepNumber < currentStep) {
      onStepChange(stepNumber);
    }
  };

  return (
    <section className="w-full bg-white border-b border-gray-200 py-4">
      <Container>
        {/* Step Indicators with Connectors */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const canClick = step.number < currentStep;

            return (
              <React.Fragment key={step.number}>
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={!canClick}
                  className={`flex flex-col items-center flex-1 transition-all ${
                    canClick ? "hover:opacity-80 cursor-pointer" : "cursor-not-allowed"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                  title={
                    canClick
                      ? `Go back to ${step.label}`
                      : `Step ${step.number}: ${step.label}`
                  }
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                      isCompleted
                        ? "bg-orange-500 text-white"
                        : isActive
                        ? "bg-orange-500 text-white ring-2 ring-orange-300"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isCompleted ? "✓" : step.number}
                  </div>
                  <p
                    className={`text-xs mt-1 text-center font-medium transition-colors ${
                      isActive
                        ? "text-orange-600 font-semibold"
                        : isCompleted
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center justify-center px-2">
                    <div
                      className={`flex-1 h-1 transition-colors ${
                        step.number < currentStep
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
