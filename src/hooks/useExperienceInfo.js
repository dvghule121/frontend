import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../services/api";
import {
  setExperiences,
  updateExperience,
} from "../store/slices/profileFormSlice";
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing experience data with API integration
 * @returns {Object} - { experiences, loading, error, saving, fetchExperiences, createExperience, updateExperienceApi, deleteExperience }
 */
export const useExperienceInfo = () => {
  const dispatch = useDispatch();
  const experiences = useSelector(
    (state) => state.profileForm.resume.experience || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.experience.getAll();
      // Handle paginated response - extract results array
      const experiencesData = response.results || response || [];
      const validExperiences = Array.isArray(experiencesData)
        ? experiencesData
        : [];
      dispatch(setExperiences(validExperiences));
    } catch (err) {
      setError(err.message);
      dispatch(setExperiences([])); // Set to empty array on error or no data
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createExperience = useCallback(
    async (experienceData) => {
      setSaving(true);
      setError(null);
      try {
        const response = await apiService.experience.create(experienceData);
        dispatch(setExperiences([...experiences, response]));
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [dispatch, experiences]
  );

  const updateExperienceApi = useCallback(
    async (id, experienceData) => {
      setSaving(true);
      setError(null);
      try {
        const response = await apiService.experience.update(id, experienceData);
        const updatedExperiences = experiences.map((exp) =>
          exp.id === id ? response : exp
        );
        dispatch(setExperiences(updatedExperiences));
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [dispatch, experiences]
  );

  const deleteExperience = useCallback(
    async (id) => {
      setSaving(true);
      setError(null);
      try {
        await apiService.experience.delete(id);
        const filteredExperiences = experiences.filter((exp) => exp.id !== id);
        dispatch(setExperiences(filteredExperiences));
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [dispatch, experiences]
  );

  // Debounced save function for auto-save
  const debouncedSave = useDebounce(async (id, experienceData) => {
    try {
      if (typeof id === 'number' && id > 1000000000000) {
        // This is a temporary ID, create new entry
        await createExperience({ ...experienceData, id });
      } else {
        // This is a real ID, update existing entry
        await updateExperienceApi(id, experienceData);
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
      setError('Auto-save failed. Please try again.');
    }
  }, 1000);

  // Auto-save when experience data changes
  const saveExperienceField = useCallback((id, field, value) => {
    // Update Redux immediately for optimistic UI
    dispatch(updateExperience({ id, field, value }));
    
    // Find the experience entry and prepare data for API
    const experienceEntry = experiences.find(exp => exp.id === id);
    if (experienceEntry) {
      const updatedEntry = { ...experienceEntry, [field]: value };
      debouncedSave(id, updatedEntry);
    }
  }, [experiences, debouncedSave, dispatch]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return {
    experiences,
    loading,
    error,
    saving,
    fetchExperiences,
    createExperience,
    updateExperience: updateExperienceApi,
    deleteExperience,
    saveExperienceField,
    // Redux action dispatchers for immediate UI updates
    updateExperienceField: (id, field, value) =>
      dispatch(updateExperience({ id, field, value })),
  };
};
