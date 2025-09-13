import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getResumeData } from '../services/api';
import { setResumeProgress, updateResume } from '../store/slices/profileFormSlice';

const useResumeData = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPreviewOnly, setShowPreviewOnly] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await getResumeData();
        if (data) {
          dispatch(setResumeProgress(data.progress));
          dispatch(updateResume({
            full_name: data.personal_info?.full_name || '',
            email: data.personal_info?.email || '',
            phone: data.personal_info?.phone || '',
            location: data.personal_info?.location || '',
            professional_title: data.personal_info?.professional_title || '',
            experience: data.experiences,
            education: data.education,
            skills: data.skills[0]?.skills || "",
            projects: data.projects,
          }));

          const allSectionsComplete = Object.values(data.progress).every(progress => progress === 100);
          if (allSectionsComplete) {
            setShowPreviewOnly(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch resume data:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [dispatch]);

  return { isLoading, hasError, showPreviewOnly, setShowPreviewOnly };
};

export default useResumeData;