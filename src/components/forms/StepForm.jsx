import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';

/**
 * StepForm Component
 * 
 * A reusable component that provides step-by-step form functionality
 * with progress indicators and conditional rendering.
 * Now uses Redux directly - no more prop drilling!
 * 
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects with {id, title, description, fields}
 * @param {Function} props.renderStep - Function to render each step's content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onFinish - Callback when finishing last step
 * @returns {JSX.Element} The StepForm component
 */
const StepForm = ({
  steps,
  renderStep,
  className = '',
  onFinish,
}) => {
  // Get form data from Redux store
  const formData = useSelector((state) => state.profileForm.resume);
  const resumeProgress = useSelector((state) => state.profileForm.resumeProgress);
  const [currentStep, setCurrentStep] = useState(1);

  // Simplified step completion check
  const isStepCompleted = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || !step.fields) return true; // If no required fields, consider completed

    // Helper function to check if a value has content
    const hasContent = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0 && value.some(item => {
          if (typeof item === 'object' && item !== null) {
            return Object.values(item).some(val => 
              typeof val === 'string' ? val.trim() !== '' : Boolean(val)
            );
          }
          return typeof item === 'string' ? item.trim() !== '' : Boolean(item);
        });
      }
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return Boolean(value);
    };

    return step.fields.every(field => {
      const value = formData[field];
      return hasContent(value);
    });
  };



  // Check if user can access a step
  const canAccessStep = (stepId) => {
    if (stepId === 1) return true;
    return isStepCompleted(stepId - 1);
  };



  // Handle step click from progress indicator
  const handleStepClick = (stepId) => {
    if (canAccessStep(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const getSectionProgress = (stepId) => {
    if (!resumeProgress) return 0;
    return isStepCompleted(stepId) ? 100 : 0;
  };

  return (
    <div className={`relative h-full flex flex-col  space-y-6 ${className}`}>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 px-6 py-3 border-b ">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = canAccessStep(step.id);
          const sectionProgress = getSectionProgress(step.id);

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex flex-col items-center cursor-pointer ${isAccessible ? 'hover:opacity-80' : 'cursor-not-allowed'
                  }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-semibold transition-all duration-200 ease-in-out shadow-md ${sectionProgress === 100
                  ? 'bg-purple-500 text-white'
                  : isCurrent
                    ? 'bg-blue-600 text-white scale-105'
                    : isAccessible
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                  {sectionProgress === 100 ? '✓' : step.id}
                </div>
                <span className={`text-xs mt-2 text-center max-w-20 ${isCurrent
                  ? 'text-blue-700 font-bold'
                  : sectionProgress === 100
                    ? 'text-purple-600'
                    : 'text-gray-500'
                  }`}>
                  {step.title}
                </span>
                {sectionProgress > 0 && sectionProgress < 100 && (
                  <span className="text-xs text-gray-500 mt-1">{sectionProgress}%</span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${getSectionProgress(step.id) === 100 ? 'bg-purple-500' : 'bg-gray-200'
                  }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-6">
        {renderStep(currentStep)}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 bottom-0 left-0 right-0 bg-white px-6 pb-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6"
        >
          Previous
        </Button>

        <div className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </div>

        <Button

          onClick={() => {
            if (currentStep < steps.length) {
              setCurrentStep(currentStep + 1);
            }
            else {
              if (typeof onFinish === 'function') onFinish();
            }
          }}
          disabled={!isStepCompleted(currentStep)}
          className="px-6"
        >
          {currentStep === steps.length ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default StepForm;