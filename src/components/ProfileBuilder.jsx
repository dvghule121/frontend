import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import ResumeForm from './forms/ResumeForm';
import ProfilePreview from './preview/ProfilePreview';
import {
  setActiveSection,
  updateResume,
  checkSectionCompletion
} from '../store/slices/profileFormSlice';

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
 * 
 * @returns {JSX.Element} The ProfileBuilder component
 */
const ProfileBuilder = () => {
  const dispatch = useDispatch();
  const {
    resume,
    completedSections,
    activeSection
  } = useSelector(state => state.profileForm);

  const [showPreviewOnly, setShowPreviewOnly] = useState(false);

  // Check section completion whenever data changes
  useEffect(() => {
    dispatch(checkSectionCompletion('resume'));
  }, [resume, dispatch]);

  // Update handler for resume data
  const handleResumeUpdate = (data) => {
    dispatch(updateResume(data));
  };

  return (
    <div className="h-full flex relative">
      {/* Form Section - Left Half */}
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
              data={resume}
              onUpdate={handleResumeUpdate}
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
    </div>
  );
};

export default ProfileBuilder;