import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import { setSkills } from '../store/slices/profileFormSlice';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing skills data with Redux integration
 * Skills are stored as a single text field with comma-separated values
 */
export const useSkillsInfo = () => {
  const dispatch = useDispatch();
  const rawSkills = useSelector(state => state.profileForm.resume.skills);

  const skills = useMemo(() => {
    // Skills can be either an array or a string, normalize to array
    if (Array.isArray(rawSkills)) return rawSkills;
    if (typeof rawSkills === 'string') return rawSkills.split(',').map(s => s.trim()).filter(s => s);
    return [];
  }, [rawSkills]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [skillsId, setSkillsId] = useState(null);

  // Fetch skills data from API and sync with Redux
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.skills.get();
      if (response) {
        dispatch(setSkills(response.skills || ''));
        setSkillsId(response.id);
      } else {
        dispatch(setSkills(''));
        setSkillsId(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch skills:', err);
      // If no skills exist, set empty data structure
      if (err.message.includes('404') || err.message.includes('Not found')) {
        dispatch(setSkills(''));
        setSkillsId(null);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Save skills data (always update since there's only one skills record)
  const saveSkills = useCallback(async (skillsText) => {
    setSaving(true);
    setError(null);
    try {
      const skillsData = { skills: skillsText };
      const response = await apiService.skills.update(skillsData);
      
      dispatch(setSkills(response.skills || ''));
      setSkillsId(response.id);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [dispatch]);

  // Update skills in Redux (for optimistic updates)
  const updateSkillsField = useCallback((value) => {
    dispatch(setSkills(value));
  }, [dispatch]);

  // Debounced save function
  const debouncedSave = useDebounce(async (skillsText) => {
    try {
      await saveSkills(skillsText);
    } catch (err) {
      console.error('Auto-save failed:', err);
      setError('Auto-save failed. Please try again.');
    }
  }, 2000);

  // Save skills field with auto-save functionality
  const saveSkillsField = useCallback((skillsText) => {
    // Update Redux immediately for responsive UI
    dispatch(setSkills(skillsText));
    
    // Debounced save to API
    debouncedSave(skillsText);
  }, [dispatch, debouncedSave]);

  // Load data on mount
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Add individual skill
  const addSkill = useCallback((newSkill) => {
    if (!newSkill || !newSkill.trim()) return;
    
    const trimmedSkill = newSkill.trim();
    const currentSkills = Array.isArray(skills) ? skills : [];
    
    // Check if skill already exists
    if (currentSkills.includes(trimmedSkill)) return;
    
    const updatedSkills = [...currentSkills, trimmedSkill];
    const skillsText = updatedSkills.join(', ');
    
    // Update Redux and save to API
    saveSkillsField(skillsText);
  }, [skills, saveSkillsField]);

  // Remove individual skill
  const removeSkill = useCallback((skillToRemove) => {
    if (!skillToRemove) return;
    
    const currentSkills = Array.isArray(skills) ? skills : [];
    const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove);
    const skillsText = updatedSkills.join(', ');
    
    // Update Redux and save to API
    saveSkillsField(skillsText);
  }, [skills, saveSkillsField]);

  return {
    skills,
    loading,
    error,
    saving,
    skillsId,
    fetchSkills,
    saveSkills,
    updateSkillsField,
    saveSkillsField,
    addSkill,
    removeSkill,
    // Helper properties
    skillsArray: skills,
    hasSkills: Array.isArray(skills) && skills.length > 0
  };
};

export default useSkillsInfo;