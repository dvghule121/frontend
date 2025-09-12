import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResumeForm from './forms/ResumeForm';
import ProfilePreview from './preview/ProfilePreview';
import { getResumeData } from '../services/api';
import { setResumeProgress, updateResume } from '../store/slices/profileFormSlice';
import { Loader2 } from "lucide-react";

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
  // Get resume data from Redux store
  const resume = useSelector(state => state.profileForm);
  const dispatch = useDispatch();
  const [showPreviewOnly, setShowPreviewOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [hasError, setHasError] = useState(false); // New error state

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        setHasError(false); // Reset error state
        const data = await getResumeData();
        if (data) {
          dispatch(setResumeProgress(data.progress));
          dispatch(updateResume({
            full_name: data.personal_info.full_name,
            email: data.personal_info.email,
            phone: data.personal_info.phone,
            location: data.personal_info.location,
            professional_title: data.personal_info.professional_title,
            experience: data.experiences,
            education: data.education,
            skills: data.skills[0]?.skills || "",
            projects: data.projects,
          }));

          // Check if all sections are 100% complete
          const allSectionsComplete = Object.values(data.progress).every(progress => progress === 100);
          if (allSectionsComplete) {
            setShowPreviewOnly(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch resume data:", error);
        setHasError(true); // Set error state if fetching fails
      } finally {
        setIsLoading(false); // Set loading to false after fetching (success or failure)
      }
    };
    fetchProgress();
  }, [dispatch]);

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