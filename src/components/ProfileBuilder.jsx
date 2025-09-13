import React from 'react';
import { useSelector } from 'react-redux';
import ResumeForm from './forms/ResumeForm';
import ProfilePreview from './preview/ProfilePreview';
import { Loader2 } from "lucide-react";
import useResumeData from '../hooks/useResumeData';

/**
 * ProfileBuilder Component
 * 
 * Resume builder with comprehensive sections:
 * - Personal Information
 * - Experience
 * - Education
 * - Skills
 * - Projects
 * 
 * Features 2-column layout with form on left and live preview on right
 * Now uses Redux directly - no more redundant state management!
 * 
 * @returns {JSX.Element} The ProfileBuilder component
 */
const ProfileBuilder = () => {
  const resume = useSelector(state => state.profileForm);
  const { isLoading, hasError, showPreviewOnly, setShowPreviewOnly } = useResumeData();

  return (
    <div className="h-full flex relative">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="ml-3 text-gray-600">Loading resume data...</p>
        </div>
      ) : hasError ? (
        <div className="flex items-center justify-center w-full h-full text-red-500">
          <p>Error loading resume data. Please try again later.</p>
        </div>
      ) : (
        <>
          {!showPreviewOnly && (
            <div className="w-2/3 flex flex-col h-full">
              {/* Header */}
              <div className="border-b border-border bg-card flex-shrink-0">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl text-foreground">Resume Builder</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create your professional resume with step-by-step guidance
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto bg-background min-h-0">
                <ResumeForm
                  onFinish={() => setShowPreviewOnly(true)}
                />
              </div>
            </div>
          )}

          {/* Preview Section - Right Half */}
          <div className={`${showPreviewOnly ? 'w-full' : 'w-1/2'} overflow-y-auto bg-muted h-full`}>
            {showPreviewOnly && (
              <div className="border-b border-border bg-card flex-shrink-0 mb-6">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl text-foreground">Resume Preview</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your completed resume
                    </p>
                  </div>
                  <button
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                    onClick={() => setShowPreviewOnly(false)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            <ProfilePreview data={resume} showPreviewOnly={showPreviewOnly} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileBuilder;