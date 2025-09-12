import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { useSelector } from 'react-redux';
import { Button } from "../../ui/button";
import { useExperienceInfo } from '../../../hooks/useExperienceInfo';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaClipboardList, FaPlus } from 'react-icons/fa';

const ExperienceStep = () => {
  const {
    loading,
    error,
    saving,
    createExperience,
    updateExperience: updateApiExperience,
    deleteExperience,
    updateExperienceField
  } = useExperienceInfo();

  // Get experiences from Redux (single source of truth)
  const experiences = useSelector(state => state.profileForm.resume.experience || []);

  // Auto-save with debounce using useRef to avoid stale closures
  const debounceTimeout = useRef(null);
  const optimisticUpdates = useRef({});
  const [autoSaveError, setAutoSaveError] = React.useState(null);

  const handleAddExperience = useCallback(async () => {
    try {
      // Create empty experience in API
      await createExperience({
        title: "",
        company: "",
        location: "",
        duration: "",
        description: ""
      });
    } catch (error) {
      console.error('Failed to create experience:', error);
      setAutoSaveError('Failed to add experience. Please try again.');
    }
  }, [createExperience]);

  const handleRemoveExperience = useCallback(async (id) => {
    try {
      if (id && typeof id === 'number') {
        // Remove from API
        await deleteExperience(id);
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      setAutoSaveError('Failed to remove experience. Please try again.');
    }
  }, [deleteExperience]);

  const handleFieldChange = useCallback((id, field, value) => {
    // Update Redux state immediately for navigation and UI feedback
    updateExperienceField(id, field, value);

    // Store optimistic update in ref to avoid stale closures
    if (!optimisticUpdates.current[id]) {
      optimisticUpdates.current[id] = {};
    }
    optimisticUpdates.current[id][field] = value;

    // Clear existing timeout and auto-save error
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setAutoSaveError(null);

    // Auto-save to API after 1 second of no changes
    debounceTimeout.current = setTimeout(async () => {
      try {
        if (id && typeof id === 'number') {
          // Get current experience from Redux
          const currentExp = experiences.find(exp => exp.id === id);
          if (currentExp) {
            // Merge current data with optimistic updates
            const optimisticExp = optimisticUpdates.current[id] || {};
            const experienceData = {
              title: optimisticExp.title !== undefined ? optimisticExp.title : currentExp.title || '',
              company: optimisticExp.company !== undefined ? optimisticExp.company : currentExp.company || '',
              location: optimisticExp.location !== undefined ? optimisticExp.location : currentExp.location || '',
              duration: optimisticExp.duration !== undefined ? optimisticExp.duration : currentExp.duration || '',
              description: optimisticExp.description !== undefined ? optimisticExp.description : currentExp.description || ''
            };
            await updateApiExperience(id, experienceData);

            // Clear optimistic update after successful save
            delete optimisticUpdates.current[id];
          }
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveError('Auto-save failed. Your changes are preserved locally.');
        // Keep optimistic updates on error so user doesn't lose their changes
      }
    }, 1000);
  }, [updateExperienceField, updateApiExperience, experiences]);

  // Memoize sorted experiences
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => a.id - b.id);
  }, [experiences]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading experiences...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <div className="text-red-800">Error loading experiences: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-foreground">Work Experience</h3>
        <Button
          type="button"
          onClick={handleAddExperience}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          size="sm"
          disabled={saving}
        >
          <FaPlus className="mr-2" />
          {saving ? 'Adding...' : 'Add Experience'}
        </Button>
      </div>

      {autoSaveError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <div className="text-yellow-800 text-sm">{autoSaveError}</div>
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No experience added yet. Click "Add Experience" to get started.</p>
        </div>
      ) : (
        sortedExperiences.map((exp, index) => {
          // Get optimistic updates from ref
          const optimisticExp = optimisticUpdates.current[exp.id] || {};
          const displayExp = { ...exp, ...optimisticExp };

          return (
            <div
              key={exp.id || index}
              className="border border-border rounded-lg p-4 mb-6 bg-background"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-foreground">
                  Experience #{index + 1}
                </h4>
                <Button
                  type="button"
                  onClick={() => handleRemoveExperience(exp.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 border-red-600"
                  disabled={saving}
                >
                  {saving ? 'Removing...' : 'Remove'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1 flex items-center">
                    <FaBriefcase className="mr-2 text-gray-500" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={displayExp.title || ""}
                    onChange={(e) => handleFieldChange(exp.id, "title", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-gray-500" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={displayExp.company || ""}
                    onChange={(e) => handleFieldChange(exp.id, "company", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., Example Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={displayExp.location || ""}
                    onChange={(e) => handleFieldChange(exp.id, "location", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-500" />
                    Duration
                  </label>
                  <input
                    type="text"
                    value={displayExp.duration || ""}
                    onChange={(e) => handleFieldChange(exp.id, "duration", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., 01/2020 - 12/2022"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2 flex items-center">
                  <FaClipboardList className="mr-2 text-gray-500" />
                  Job Description (Bullet Points)
                </label>
                <textarea
                  value={displayExp.description || ""}
                  onChange={(e) => handleFieldChange(exp.id, "description", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                  placeholder={
                    "Each line will become a bullet point\nE.g.\n• Led team of 4 engineers\n• Shipped feature X improving KPI by 30%"
                  }
                  rows={5}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ExperienceStep;
