import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for managing experience data
 * Provides CRUD operations for experience entries
 */
export const useExperience = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all experience entries
  const fetchExperience = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.experience.getAll();
      setData(response || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new experience entry
  const createExperience = useCallback(async (experienceData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.experience.create(experienceData);
      setData(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Update existing experience entry
  const updateExperience = useCallback(async (id, experienceData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.experience.update(id, experienceData);
      setData(prev => prev.map(item => item.id === id ? response : item));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Delete experience entry
  const deleteExperience = useCallback(async (id) => {
    setSaving(true);
    setError(null);
    try {
      await apiService.experience.delete(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Add new empty experience entry locally (for form)
  const addEmptyExperience = useCallback(() => {
    const newExperience = {
      id: `temp_${Date.now()}`, // Temporary ID for local state
      title: '',
      company: '',
      location: '',
      duration: '',
      description: '',
      isNew: true // Flag to identify new entries
    };
    setData(prev => [...prev, newExperience]);
    return newExperience;
  }, []);

  // Update local data without API call (for real-time updates)
  const updateLocalExperience = useCallback((id, updates) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // Remove local experience entry (for unsaved entries)
  const removeLocalExperience = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  return {
    data,
    loading,
    error,
    saving,
    fetchExperience,
    createExperience,
    updateExperience,
    deleteExperience,
    addEmptyExperience,
    updateLocalExperience,
    removeLocalExperience,
    // Helper to check if there's any experience data
    hasData: data.length > 0,
    // Helper to get saved entries only (exclude temp entries)
    savedEntries: data.filter(item => !item.isNew)
  };
};

export default useExperience;