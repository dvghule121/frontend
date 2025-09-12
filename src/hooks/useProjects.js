import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for managing projects data
 * Provides CRUD operations for project entries
 */
export const useProjects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all project entries
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.projects.getAll();
      setData(response || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new project entry
  const createProject = useCallback(async (projectData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.projects.create(projectData);
      setData(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Update existing project entry
  const updateProject = useCallback(async (id, projectData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.projects.update(id, projectData);
      setData(prev => prev.map(item => item.id === id ? response : item));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Delete project entry
  const deleteProject = useCallback(async (id) => {
    setSaving(true);
    setError(null);
    try {
      await apiService.projects.delete(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Add new empty project entry locally (for form)
  const addEmptyProject = useCallback(() => {
    const newProject = {
      id: `temp_${Date.now()}`, // Temporary ID for local state
      project_name: '',
      project_description: '',
      project_technologies: '',
      project_link: '',
      isNew: true // Flag to identify new entries
    };
    setData(prev => [...prev, newProject]);
    return newProject;
  }, []);

  // Update local data without API call (for real-time updates)
  const updateLocalProject = useCallback((id, updates) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // Remove local project entry (for unsaved entries)
  const removeLocalProject = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  // Helper to get technologies as array
  const getTechnologiesArray = useCallback((project) => {
    if (!project || !project.project_technologies) return [];
    return project.project_technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);
  }, []);

  // Helper to set technologies from array
  const setTechnologiesFromArray = useCallback((id, techArray) => {
    const techString = techArray.join(', ');
    updateLocalProject(id, { project_technologies: techString });
    return techString;
  }, [updateLocalProject]);

  // Load data on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    data,
    loading,
    error,
    saving,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addEmptyProject,
    updateLocalProject,
    removeLocalProject,
    getTechnologiesArray,
    setTechnologiesFromArray,
    // Helper to check if there's any project data
    hasData: data.length > 0,
    // Helper to get saved entries only (exclude temp entries)
    savedEntries: data.filter(item => !item.isNew)
  };
};

export default useProjects;