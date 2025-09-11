import React from 'react';

const SkillsStep = ({ formData, handleInputChange }) => {
  return (
    <div
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technical Skills *
        </label>
        <textarea
          name="skills"
          value={formData.skills || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="List your skills separated by commas (e.g., JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker)"
          rows={6}
          required
        />
      </div>
      <p className="text-sm text-gray-600">
        💡 Tip: Separate skills with commas. They will be displayed as individual skill tags.
      </p>
    </div>
  );
};

export default SkillsStep;