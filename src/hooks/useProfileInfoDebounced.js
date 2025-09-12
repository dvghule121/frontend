import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for managing personal information with debouncing and validation
 * Provides CRUD operations with optimized API calls
 */
export const useProfileInfoDebounced = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Debounce timer ref
  const debounceTimer = useRef(null);
  const DEBOUNCE_DELAY = 1000; // 1 second

  // Validation function
  const validateProfileData = useCallback((profileData) => {
    const errors = {};
    
    // Check required fields
    if (!profileData.full_name?.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (!profileData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!profileData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!profileData.location?.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!profileData.professional_title?.trim()) {
      errors.professional_title = 'Professional title is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Fetch personal information
  const fetchProfileInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.personalInfo.get();
      setData(response || {
        full_name: '',
        professional_title: '',
        email: '',
        phone: '',
        location: ''
      });
    } catch (err) {
      setError(err.message);
      // Set empty data structure if no profile exists
      if (err.message.includes('404') || err.message.includes('Not found')) {
        setData({
          full_name: '',
          professional_title: '',
          email: '',
          phone: '',
          location: ''
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to filter out empty values
  const filterEmptyValues = useCallback((data) => {
    const filtered = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'string' && value.trim() !== '') {
          filtered[key] = value.trim();
        } else if (typeof value !== 'string') {
          filtered[key] = value;
        }
      }
    });
    return filtered;
  }, []);

  // Debounced save function
  const debouncedSave = useCallback(async (profileData) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer
    debounceTimer.current = setTimeout(async () => {
      // Filter out empty values
      const filteredData = filterEmptyValues(profileData);
      
      // Check if there's content to save
      if (Object.keys(filteredData).length === 0) {
        console.log('Skipping save - no valid content to save');
        return;
      }
      
      // Validate the filtered data
      const validation = validateProfileData(filteredData);
      
      setSaving(true);
      setError(null);
      try {
        let response;
        if (data && data.id) {
          // Update existing
          response = await apiService.personalInfo.update(data.id, filteredData);
        } else {
          // Create new
          response = await apiService.personalInfo.create(filteredData);
        }
        setData(response);
        setHasUnsavedChanges(false);
        console.log('Profile info saved successfully');
      } catch (err) {
        setError(err.message);
        console.error('Failed to save profile info:', err);
      } finally {
        setSaving(false);
      }
    }, DEBOUNCE_DELAY);
  }, [data, validateProfileData, filterEmptyValues]);

  // Update local data and trigger debounced save
  const updateProfileInfo = useCallback((updates) => {
    setData(prev => {
      const newData = { ...prev, ...updates };
      setHasUnsavedChanges(true);
      
      // Trigger debounced save
      debouncedSave(newData);
      
      return newData;
    });
  }, [debouncedSave]);

  // Force save immediately (for blur events)
  const saveImmediately = useCallback(async (updates = {}) => {
    // Clear debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    const dataToSave = { ...data, ...updates };
    
    // Filter out empty values
    const filteredData = filterEmptyValues(dataToSave);
    
    // Check if there's content to save
    if (Object.keys(filteredData).length === 0) {
      console.log('Skipping immediate save - no valid content');
      return;
    }
    
    // Validate the filtered data
    const validation = validateProfileData(filteredData);
    
    setSaving(true);
    setError(null);
    try {
      let response;
      if (data && data.id) {
        response = await apiService.personalInfo.update(data.id, filteredData);
      } else {
        response = await apiService.personalInfo.create(filteredData);
      }
      setData(response);
      setHasUnsavedChanges(false);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [data, validateProfileData, filterEmptyValues]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchProfileInfo();
  }, [fetchProfileInfo]);

  return {
    data,
    loading,
    error,
    saving,
    hasUnsavedChanges,
    fetchProfileInfo,
    updateProfileInfo,
    saveImmediately,
    validateProfileData,
    // Helper to check if profile is complete
    isComplete: data ? validateProfileData(data).isValid : false,
    // Helper to get validation errors
    getValidationErrors: data ? validateProfileData(data).errors : {}
  };
};

export default useProfileInfoDebounced;