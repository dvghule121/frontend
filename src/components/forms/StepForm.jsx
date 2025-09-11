import React, { useState } from 'react';
import { Button } from '../ui/button';

/**
 * StepForm Component
 * 
 * A reusable component that provides step-by-step form functionality
 * with progress indicators and conditional rendering.
 * 
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects with {id, title, description, fields}
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onUpdate - Callback when form data changes
 * @param {Function} props.renderStep - Function to render each step's content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} The StepForm component
 */
const StepForm = ({
  steps,
  formData,
  onUpdate,
  renderStep,
  className = '',
  onFinish, // new optional callback when finishing last step
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Check if a step is completed based on required fields
  const isStepCompleted = (stepId) => {
    const step = steps.find(s => s.id === stepId);

    // Helper function to check if a value has content
    const hasContent = (value) => {
      if (Array.isArray(value)) {
        // For arrays, check if all elements have content, especially for experience and projects
        if (value.length === 0) return false;
        if (stepId === 3 || stepId === 6) { // Assuming step 3 is Experience and step 6 is Projects
          return value.every(item => {
            if (stepId === 3) { // Experience
              const descArray = Array.isArray(item.description) ? item.description : [];
              return hasContent(item.title) && (descArray.length === 0 || descArray.some(desc => hasContent(desc)));
            } else if (stepId === 6) { // Projects
              // Projects description is now a bullet list (array) via newline splitting
              const descArray = Array.isArray(item.description) ? item.description : [];
              return hasContent(item.name) && (descArray.length === 0 || descArray.some(desc => hasContent(desc)));
            }
            return true; // Fallback for other arrays
          });
        }
        return value.every(item => hasContent(item));
      }
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return Boolean(value);
    };

    if (!step || !step.fields || step.fields.length === 0) {
      // If no required fields specified, check if any form data exists for this step
      // This is a basic completion check - at least one field should have content
      const stepFields = getStepFields(stepId);
      return stepFields.some(field => {
        const value = formData[field];
        return hasContent(value);
      });
    }

    return step.fields.every(field => {
      const value = formData[field];
      return hasContent(value);
    });
  };

  // Get fields that belong to a specific step (this should be customized per form)
  const getStepFields = (stepId) => {
    // Default field mapping - forms can override this by providing step.fields
    const fieldMap = {
      1: Object.keys(formData).slice(0, Math.ceil(Object.keys(formData).length / 4)),
      2: Object.keys(formData).slice(Math.ceil(Object.keys(formData).length / 4), Math.ceil(Object.keys(formData).length / 2)),
      3: Object.keys(formData).slice(Math.ceil(Object.keys(formData).length / 2), Math.ceil(3 * Object.keys(formData).length / 4)),
      4: Object.keys(formData).slice(Math.ceil(3 * Object.keys(formData).length / 4))
    };
    return fieldMap[stepId] || [];
  };

  // Check if user can access a step
  const canAccessStep = (stepId) => {
    if (stepId === 1) return true;
    return isStepCompleted(stepId - 1);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    onUpdate(updatedData);
  };

  // Handle step click from progress indicator
  const handleStepClick = (stepId) => {
    if (canAccessStep(stepId)) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className={`relative h-full flex flex-col  space-y-6 ${className}`}>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 px-6 py-3 border-b ">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = canAccessStep(step.id);

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex flex-col items-center cursor-pointer ${isAccessible ? 'hover:opacity-80' : 'cursor-not-allowed'
                  }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-blue-500 text-white'
                    : isAccessible
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                  {isCompleted ? '✓' : step.id}
                </div>
                <span className={`text-xs mt-2 text-center max-w-20 ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${isStepCompleted(step.id) ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-6">
        {renderStep(currentStep, {
          formData,
          handleInputChange,
          isStepCompleted: () => isStepCompleted(currentStep)
        })}
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
            } else {
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