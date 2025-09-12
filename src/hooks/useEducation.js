import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for managing education data
 * Provides CRUD operations for education entries
 */
export const useEducation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all education entries
  const fetchEducation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.education.getAll();
      setData(response || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new education entry
  const createEducation = useCallback(async (educationData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.education.create(educationData);
      setData(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Update existing education entry
  const updateEducation = useCallback(async (id, educationData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.education.update(id, educationData);
      setData(prev => prev.map(item => item.id === id ? response : item));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Delete education entry
  const deleteEducation = useCallback(async (id) => {
    setSaving(true);
    setError(null);
    try {
      await apiService.education.delete(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Add new empty education entry locally (for form)
  const addEmptyEducation = useCallback(() => {
    const newEducation = {
      id: `temp_${Date.now()}`, // Temporary ID for local state
      degree: '',
      institution: '',
      education_duration: '',
      education_location: '',
      isNew: true // Flag to identify new entries
    };
    setData(prev => [...prev, newEducation]);
    return newEducation;
  }, []);

  // Update local data without API call (for real-time updates)
  const updateLocalEducation = useCallback((id, updates) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // Remove local education entry (for unsaved entries)
  const removeLocalEducation = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  return {
    data,
    loading,
    error,
    saving,
    fetchEducation,
    createEducation,
    updateEducation,
    deleteEducation,
    addEmptyEducation,
    updateLocalEducation,
    removeLocalEducation,
    // Helper to check if there's any education data
    hasData: data.length > 0,
    // Helper to get saved entries only (exclude temp entries)
    savedEntries: data.filter(item => !item.isNew)
  };
};

export default useEducation;