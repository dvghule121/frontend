import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import { setEducation, addEducation, updateEducation, removeEducation } from '../store/slices/profileFormSlice';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing education data with Redux integration
 * Provides CRUD operations and auto-save functionality
 */
export const useEducationInfo = () => {
  const dispatch = useDispatch();
  const education = useSelector(state => {
    const educationData = state.profileForm.resume.education;
    return Array.isArray(educationData) ? educationData : [];
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch education data from API and sync with Redux
  const fetchEducation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.education.getAll();
      // Extract results array from paginated response
      const educationData = response?.results || response || [];
      dispatch(setEducation(educationData));
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch education:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Create new education entry
  const createEducation = useCallback(async (educationData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.education.create(educationData);
      // Update Redux with the server response (which includes the real ID)
      dispatch(updateEducation({ id: educationData.id, field: 'id', value: response.id }));
      // Update all fields with server data
      Object.keys(response).forEach(field => {
        if (field !== 'id') {
          dispatch(updateEducation({ id: response.id, field, value: response[field] }));
        }
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [dispatch]);

  // Update existing education entry
  const updateEducationEntry = useCallback(async (id, educationData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.education.update(id, educationData);
      // Update Redux with server response
      Object.keys(response).forEach(field => {
        dispatch(updateEducation({ id, field, value: response[field] }));
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [dispatch]);

  // Delete education entry
  const deleteEducation = useCallback(async (id) => {
    setSaving(true);
    setError(null);
    try {
      await apiService.education.delete(id);
      dispatch(removeEducation(id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [dispatch]);

  // Add new education entry to Redux (for immediate UI feedback)
  const addEducationEntry = useCallback(() => {
    dispatch(addEducation());
  }, [dispatch]);

  // Update education field in Redux (for optimistic updates)
  const updateEducationField = useCallback((id, field, value) => {
    dispatch(updateEducation({ id, field, value }));
  }, [dispatch]);

  // Remove education entry from Redux and API
  const removeEducationEntry = useCallback(async (id) => {
    // If it's a temporary ID (new entry not saved yet), just remove from Redux
    if (typeof id === 'number' && id > 1000000000000) {
      dispatch(removeEducation(id));
      return;
    }
    
    // For saved entries, delete from API and Redux
    try {
      await deleteEducation(id);
    } catch (err) {
      console.error('Failed to delete education:', err);
      // Even if API call fails, remove from Redux for better UX
      dispatch(removeEducation(id));
    }
  }, [dispatch, deleteEducation]);

  // Debounced save function for auto-save
  const debouncedSave = useDebounce(async (id, educationData) => {
    try {
      if (typeof id === 'number' && id > 1000000000000) {
        // This is a temporary ID, create new entry
        await createEducation({ ...educationData, id });
      } else {
        // This is a real ID, update existing entry
        await updateEducationEntry(id, educationData);
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
      setError('Auto-save failed. Please try again.');
    }
  }, 2000);

  // Auto-save when education data changes
  const saveEducationField = useCallback((id, field, value) => {
    // Update Redux immediately for optimistic UI
    updateEducationField(id, field, value);
    
    // Find the education entry and prepare data for API
    const educationEntry = education.find(edu => edu.id === id);
    if (educationEntry) {
      const updatedEntry = { ...educationEntry, [field]: value };
      debouncedSave(id, updatedEntry);
    }
  }, [education, updateEducationField, debouncedSave]);

  // Load data on mount
  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  return {
    education,
    loading,
    error,
    saving,
    fetchEducation,
    createEducation,
    updateEducationEntry,
    deleteEducation,
    addEducationEntry,
    updateEducationField,
    removeEducationEntry,
    saveEducationField,
    // Helper properties
    hasEducation: Array.isArray(education) && education.length > 0,
    savedEntries: Array.isArray(education) ? education.filter(edu => typeof edu.id === 'number' && edu.id < 1000000000000) : []
  };
};

export default useEducationInfo;