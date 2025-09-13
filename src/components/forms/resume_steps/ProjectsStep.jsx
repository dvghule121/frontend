import React, { useMemo, useRef } from "react";
import { useSelector } from 'react-redux';
import { Button } from "../../ui/button";
import { useProjectsInfo } from '../../../hooks/useProjectsInfo';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaClipboardList, FaPlus, FaCodeBranch, FaLink, FaClock, FaLaptopCode } from 'react-icons/fa';
import SaveIndicator from '../../common/SaveIndicator';

const ProjectsStep = () => {
  const projects = useSelector(state => state.profileForm.resume.projects || []);
  const { 
    loading, 
    error, 
    saving, 
    addProjectEntry, 
    removeProjectEntry, 
    saveProjectField 
  } = useProjectsInfo();
  
  // Refs for optimistic updates
  const optimisticUpdatesRef = useRef(new Map());
  
  // Memoized sorted projects for performance
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      // Sort by creation time (newer first)
      return (b.id || 0) - (a.id || 0);
    });
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-foreground">Projects</h3>
        <SaveIndicator isSaving={saving} hasError={error} errorMessage={error}/>
        <Button
          type="button"
          onClick={addProjectEntry}
          className="bg-primary hover:bg-primary-dark text-primary-foreground"
          size="sm"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Add Project'}
        </Button>
      </div>

      {/* Error Message */}
      {/* {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-md text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )} */}
      
      {/* Auto-save Status */}
      {/* {saving && (
        <div className="mb-4 p-2 bg-blue-100 border border-blue-200 rounded-md text-blue-700">
          <p className="text-sm">Saving changes...</p>
        </div>
      )} */}

      {sortedProjects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        sortedProjects.map((project, index) => {
          // Handle field changes with optimistic updates and auto-save
          const handleFieldChange = (field, value) => {
            // Store optimistic update
            const updateKey = `${project.id}-${field}`;
            optimisticUpdatesRef.current.set(updateKey, value);
            
            // Save to Redux and API
            saveProjectField(project.id, field, value);
          };
          
          return (
          <div
            key={project.id || index}
            className="mb-6 p-4 border border-border rounded-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-foreground">
                Project #{index + 1}
              </h4>
              <Button
                  type="button"
                  onClick={() => removeProjectEntry(project.id)}
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive-dark"
                  disabled={saving}
                >
                  Remove
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-foreground mb-2 flex items-center">
                  <FaCodeBranch className="mr-2 text-muted-foreground" /> Project Name *
                </label>
                <input
                  type="text"
                  value={project.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                  placeholder="e.g., E-commerce Website"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2 flex items-center">
                  <FaClock className="mr-2 text-muted-foreground" /> Duration
                </label>
                <input
                  type="text"
                  value={project.duration || ""}
                  onChange={(e) => handleFieldChange("duration", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                  placeholder="e.g., Jan 2023 - Mar 2023"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2 flex items-center">
                  <FaLink className="mr-2 text-muted-foreground" /> Project Link
                </label>
                <input
                  type="url"
                  value={project.link || ""}
                  onChange={(e) => handleFieldChange("link", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2 flex items-center">
                  <FaLaptopCode className="mr-2 text-muted-foreground" /> Technologies Used
                </label>
                <input
                  type="text"
                  value={project.technologies || ""}
                  onChange={(e) => handleFieldChange("technologies", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                value={project.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground min-h-[100px] resize-vertical"
                placeholder="Describe the project, your role, and key achievements..."
                rows={4}
              />
            </div>
          </div>
          );
        })
      )}
    </div>
  );
};

export default ProjectsStep;
