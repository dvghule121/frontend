import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for managing personal information
 * Provides CRUD operations with loading states and error handling
 */
export const useProfileInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch personal info
  const fetchProfileInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.personalInfo.get();
      setData(response);
    } catch (err) {
      setError(err.message);
      // If no personal info exists (404), set empty data structure
      if (err.message.includes('404') || err.message.includes('Not found')) {
        setData({
          full_name: '',
          email: '',
          phone: '',
          location: '',
          professional_title: ''
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Save personal info (create or update)
  const saveProfileInfo = useCallback(async (profileData) => {
    setSaving(true);
    setError(null);
    try {
      let response;
      if (data && data.id) {
        // Update existing
        response = await apiService.personalInfo.update(profileData);
      } else {
        // Create new
        response = await apiService.personalInfo.create(profileData);
      }
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [data]);

  // Update local data without API call (for real-time updates)
  const updateLocalData = useCallback((updates) => {
    setData(prev => prev ? { ...prev, ...updates } : updates);
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
    fetchProfileInfo,
    saveProfileInfo,
    updateLocalData,
    // Helper to check if data exists
    hasData: Boolean(data && data.id),
    // Helper to check if required fields are filled
    isComplete: Boolean(
      data &&
      data.full_name &&
      data.email &&
      data.phone &&
      data.location &&
      data.professional_title
    )
  };
};

export default useProfileInfo;