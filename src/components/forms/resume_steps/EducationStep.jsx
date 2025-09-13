import React, { useMemo, useRef } from "react";
import { useSelector } from 'react-redux';
import { Button } from "../../ui/button";
import { useEducationInfo } from '../../../hooks/useEducationInfo';
import { FaGraduationCap, FaUniversity, FaCalendarAlt, FaMapMarkerAlt, FaClipboardList, FaPlus } from 'react-icons/fa';
import SaveIndicator from "../../common/SaveIndicator";

const EducationStep = () => {
  const education = useSelector(state => state.profileForm.resume.education || []);
  const { 
    loading, 
    error, 
    saving, 
    addEducationEntry, 
    removeEducationEntry, 
    saveEducationField 
  } = useEducationInfo();
  
  // Refs for optimistic updates
  const optimisticUpdatesRef = useRef(new Map());
  
  // Memoized sorted education for performance
  const sortedEducation = useMemo(() => {
    return [...education].sort((a, b) => {
      // Sort by creation time (newer first)
      return (b.id || 0) - (a.id || 0);
    });
  }, [education]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-foreground">Education</h3>
        <SaveIndicator isSaving={saving} hasError={!!error} errorMessage={error} />
        <Button
          type="button"
          onClick={addEducationEntry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
          size="sm"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> {loading ? 'Loading...' : 'Add Education'}
        </Button>
      </div>

      {sortedEducation.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet. Click "Add Education" to get started.</p>
        </div>
      ) : (
        sortedEducation.map((edu, index) => {
          // Handle field changes with optimistic updates and auto-save
          const handleFieldChange = (field, value) => {
            // Store optimistic update
            const updateKey = `${edu.id}-${field}`;
            optimisticUpdatesRef.current.set(updateKey, value);
            
            // Save to Redux and API
            saveEducationField(edu.id, field, value);
          };
          
          return (
            <div
              key={edu.id || index}
              className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-foreground">
                  Education #{index + 1}
                </h4>
                <Button
                  type="button"
                  onClick={() => removeEducationEntry(edu.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                  disabled={saving}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center">
                    <FaGraduationCap className="mr-2 text-gray-500" /> Degree/Qualification *
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) => handleFieldChange("degree", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center">
                    <FaUniversity className="mr-2 text-gray-500" /> Institution *
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ""}
                    onChange={(e) => handleFieldChange("institution", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., University of California, Berkeley"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-500" /> Duration
                  </label>
                  <input
                    type="text"
                    value={edu.education_duration || ""}
                    onChange={(e) => handleFieldChange("education_duration", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., 2018 - 2022"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" /> Location
                  </label>
                  <input
                    type="text"
                    value={edu.education_location || ""}
                    onChange={(e) => handleFieldChange("education_location", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                    placeholder="e.g., Berkeley, CA"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-2 flex items-center">
                  <FaClipboardList className="mr-2 text-gray-500" /> Description (Optional)
                </label>
                <textarea
                  value={edu.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
                  placeholder="Relevant coursework, achievements, GPA, etc."
                  rows={3}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default EducationStep;
