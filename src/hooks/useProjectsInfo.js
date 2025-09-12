import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import { setProjects, addProject, updateProject, removeProject } from '../store/slices/profileFormSlice';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing projects data with Redux integration
 * Provides CRUD operations and auto-save functionality
 */
export const useProjectsInfo = () => {
  const dispatch = useDispatch();
  const projects = useSelector(state => {
    const projectsData = state.profileForm.resume.projects;
    return Array.isArray(projectsData) ? projectsData : [];
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch projects data from API and sync with Redux
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.projects.getAll();
      // Extract results array from paginated response
      const projectsData = response?.results || response || [];
      dispatch(setProjects(projectsData));
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Create new project entry
  const createProject = useCallback(async (projectData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.projects.create(projectData);
      // Update Redux with the server response (which includes the real ID)
      dispatch(updateProject({ id: projectData.id, field: 'id', value: response.id }));
      // Update all fields with server data
      Object.keys(response).forEach(field => {
        if (field !== 'id') {
          dispatch(updateProject({ id: response.id, field, value: response[field] }));
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

  // Update existing project entry
  const updateProjectEntry = useCallback(async (id, projectData) => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiService.projects.update(id, projectData);
      // Update Redux with server response
      Object.keys(response).forEach(field => {
        dispatch(updateProject({ id, field, value: response[field] }));
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [dispatch]);

  // Delete project entry
  const deleteProject = useCallback(async (id) => {
    setSaving(true);
    setError(null);
    try {
      await apiService.projects.delete(id);
      dispatch(removeProject(id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [dispatch]);

  // Add new project entry to Redux (for immediate UI feedback)
  const addProjectEntry = useCallback(() => {
    dispatch(addProject());
  }, [dispatch]);

  // Update project field in Redux (for optimistic updates)
  const updateProjectField = useCallback((id, field, value) => {
    dispatch(updateProject({ id, field, value }));
  }, [dispatch]);

  // Remove project entry from Redux and API
  const removeProjectEntry = useCallback(async (id) => {
    // If it's a temporary ID (new entry not saved yet), just remove from Redux
    if (typeof id === 'number' && id > 1000000000000) {
      dispatch(removeProject(id));
      return;
    }
    
    // For saved entries, delete from API and Redux
    try {
      await deleteProject(id);
    } catch (err) {
      console.error('Failed to delete project:', err);
      // Even if API call fails, remove from Redux for better UX
      dispatch(removeProject(id));
    }
  }, [dispatch, deleteProject]);

  // Debounced save function for auto-save
  const debouncedSave = useDebounce(async (id, projectData) => {
    try {
      if (typeof id === 'number' && id > 1000000000000) {
        // This is a temporary ID, create new entry
        await createProject({ ...projectData, id });
      } else {
        // This is a real ID, update existing entry
        await updateProjectEntry(id, projectData);
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
      setError('Auto-save failed. Please try again.');
    }
  }, 1000);

  // Auto-save when project data changes
  const saveProjectField = useCallback((id, field, value) => {
    // Update Redux immediately for optimistic UI
    updateProjectField(id, field, value);
    
    // Find the project entry and prepare data for API
    const projectEntry = projects.find(proj => proj.id === id);
    if (projectEntry) {
      const updatedEntry = { ...projectEntry, [field]: value };
      debouncedSave(id, updatedEntry);
    }
  }, [projects, updateProjectField, debouncedSave]);

  // Load data on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    saving,
    fetchProjects,
    createProject,
    updateProjectEntry,
    deleteProject,
    addProjectEntry,
    updateProjectField,
    removeProjectEntry,
    saveProjectField,
    // Helper properties
    hasProjects: Array.isArray(projects) && projects.length > 0,
    savedEntries: Array.isArray(projects) ? projects.filter(project => typeof project.id === 'number' && project.id < 1000000000000) : []
  };
};

export default useProjectsInfo;