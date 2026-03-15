import React from "react";

/**
 * StepIndicator Component
 * Visual progress indicator showing current step and completion status
 * 
 * @param {number} currentStep - Current active step (1-4)
 * @param {number} totalSteps - Total number of steps
 */
export const StepIndicator = ({ currentStep = 1, totalSteps = 4 }) => {
  const steps = [
    { number: 1, label: "Informasi Magang", icon: "ℹ️" },
    { number: 2, label: "Rating", icon: "⭐" },
    { number: 3, label: "Pengalaman", icon: "💼" },
    { number: 4, label: "Submit", icon: "✓" },
  ];

  return (
    <div className="w-full mb-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-orange-500 text-white ring-4 ring-orange-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </div>
                <p
                  className={`text-xs mt-2 text-center font-medium transition-colors ${
                    isActive
                      ? "text-orange-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    step.number < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                  style={{ marginTop: "-2rem" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Description */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">
            Step {currentStep} of {totalSteps}:
          </span>{" "}
          {steps[currentStep - 1]?.label}
        </p>
      </div>
    </div>
  );
};
