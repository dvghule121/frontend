import React from "react";
import { Button } from "../../ui/button";

const EducationStep = ({
  formData,
  handleInputChange,
  addEducation,
  removeEducation,
  updateEducation,
}) => {
  const education = formData.education || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Education</h3>
        <Button
          type="button"
          onClick={() => addEducation(handleInputChange)}
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet. Click "Add Education" to get started.</p>
        </div>
      ) : (
        education.map((edu, index) => (
          <div
            key={edu.id || index}
            className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-800">
                Education #{index + 1}
              </h4>
              <Button
                type="button"
                onClick={() => removeEducation(index, handleInputChange)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "degree",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution || ""}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "institution",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="e.g., University of Example"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={edu.education_duration || ""}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "education_duration",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="e.g., 09/2018 - 05/2022"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.education_location || ""}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "education_location",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="e.g., City, State, Country"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EducationStep;
