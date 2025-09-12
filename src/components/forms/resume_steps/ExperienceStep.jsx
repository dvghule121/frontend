import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "../../ui/button";
import { addExperience, removeExperience, updateExperience } from '../../../store/slices/profileFormSlice';

const ExperienceStep = () => {
  const dispatch = useDispatch();
  const experiences = useSelector(state => state.profileForm.resume.experience || []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
        <Button
          type="button"
          onClick={() => dispatch(addExperience())}
          className="bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No experience added yet. Click "Add Experience" to get started.</p>
        </div>
      ) : (
        experiences.map((exp, index) => (
          <div
            key={exp.id || index}
            className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-800">
                Experience #{index + 1}
              </h4>
              <Button
                type="button"
                onClick={() => dispatch(removeExperience(index))}
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
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.title || ""}
                  onChange={(e) =>
                    dispatch(updateExperience({
                      index,
                      field: "title",
                      value: e.target.value
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company || ""}
                  onChange={(e) =>
                    dispatch(updateExperience({
                      index,
                      field: "company",
                      value: e.target.value
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="e.g., Example Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location || ""}
                  onChange={(e) =>
                    dispatch(updateExperience({
                      index,
                      field: "location",
                      value: e.target.value
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={exp.duration || ""}
                  onChange={(e) =>
                    dispatch(updateExperience({
                      index,
                      field: "duration",
                      value: e.target.value
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="e.g., 01/2020 - 12/2022"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description (Bullet Points)
              </label>
              <textarea
                value={exp.description || ""}
                onChange={(e) =>
                  dispatch(updateExperience({
                    index,
                    field: "description",
                    value: e.target.value
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder={
                  "Each line will become a bullet point\nE.g.\n• Led team of 4 engineers\n• Shipped feature X improving KPI by 30%"
                }
                rows={5}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExperienceStep;
