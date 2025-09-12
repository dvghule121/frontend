import React from "react";
import { useSelector } from 'react-redux';
import { useSkillsInfo } from '../../../hooks/useSkillsInfo';
import { FaCode } from 'react-icons/fa';

const SkillsStep = () => {
  const skills = useSelector(state => state.profileForm.resume.skills || []);
  const { 
    loading, 
    error, 
    saving, 
    saveSkillsField
  } = useSkillsInfo();
  
  // Convert skills array to comma-separated string for display
  const skillsText = Array.isArray(skills) ? skills.join(', ') : (skills || '');

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    saveSkillsField(value);
  };
  return (
    <div className="space-y-6">
      <h3 className="text-lg text-foreground mb-6">Skills</h3>
      <div className="mb-6">
        <label className="block text-sm text-muted-foreground mb-2 flex items-center">
          <FaCode className="mr-2 text-gray-500" /> Technical Skills *
        </label>
        <textarea
          value={skillsText}
          onChange={handleSkillsChange}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground min-h-[100px] resize-vertical"
          placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Python, Node.js, SQL)"
          disabled={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Auto-save Status */}
      {saving && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">Saving changes...</p>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mt-4">
        💡 Tip: Enter your skills separated by commas. Changes are automatically saved.
      </p>
    </div>
  );
};

export default SkillsStep;