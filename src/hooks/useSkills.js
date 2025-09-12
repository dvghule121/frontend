import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for managing skills data
 * Skills are stored as a single text field with comma-separated values
 */
export const useSkills = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch skills data
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.skills.getAll();
      // Skills API returns an array, but we typically only have one skills entry
      const skillsData = response && response.length > 0 ? response[0] : null;
      setData(skillsData);
    } catch (err) {
      setError(err.message);
      // If no skills exist, set empty data structure
      if (err.message.includes('404') || err.message.includes('Not found')) {
        setData({ skills: '' });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Save skills data (create or update)
  const saveSkills = useCallback(async (skillsText) => {
    setSaving(true);
    setError(null);
    try {
      const skillsData = { skills: skillsText };
      let response;
      
      if (data && data.id) {
        // Update existing
        response = await apiService.skills.update(data.id, skillsData);
      } else {
        // Create new
        response = await apiService.skills.create(skillsData);
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
  const updateLocalSkills = useCallback((skillsText) => {
    setData(prev => prev ? { ...prev, skills: skillsText } : { skills: skillsText });
  }, []);

  // Helper function to convert skills string to array
  const getSkillsArray = useCallback(() => {
    if (!data || !data.skills) return [];
    return data.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }, [data]);

  // Helper function to convert array to skills string
  const setSkillsFromArray = useCallback((skillsArray) => {
    const skillsText = skillsArray.join(', ');
    updateLocalSkills(skillsText);
    return skillsText;
  }, [updateLocalSkills]);

  // Load data on mount
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    data,
    loading,
    error,
    saving,
    fetchSkills,
    saveSkills,
    updateLocalSkills,
    getSkillsArray,
    setSkillsFromArray,
    // Helper to check if skills data exists
    hasData: Boolean(data && data.skills && data.skills.trim()),
    // Helper to get skills text
    skillsText: data ? data.skills || '' : '',
    // Helper to check if skills are complete
    isComplete: Boolean(data && data.skills && data.skills.trim().length > 0)
  };
};

export default useSkills;