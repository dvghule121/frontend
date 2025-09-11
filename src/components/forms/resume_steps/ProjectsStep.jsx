import React from "react";
import { Button } from "../../ui/button";

const ProjectsStep = ({
  formData,
  handleInputChange,
  addProject,
  removeProject,
  updateProject,
}) => {
  const projects = formData.projects || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
        <Button
          type="button"
          onClick={() => addProject(handleInputChange)}
          className="bg-indigo-600 hover:bg-indigo-700"
          size="sm"
        >
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        projects.map((project, index) => (
          <div
            key={project.id || index}
            className="border border-gray-300 rounded-lg p-4 bg-white mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-800">
                Project #{index + 1}
              </h4>
              <Button
                type="button"
                onClick={() => removeProject(index, handleInputChange)}
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
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name || ""}
                  onChange={(e) =>
                    updateProject(
                      index,
                      "name",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Portfolio Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={project.duration || ""}
                  onChange={(e) =>
                    updateProject(
                      index,
                      "duration",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 03/2023 - 05/2023"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Bullet points via new lines)
              </label>
              <textarea
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(
                    index,
                    "description",
                    e.target.value,
                    handleInputChange
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  "Each line will become a bullet point\nE.g.\n• Developed a responsive user interface\n• Integrated with RESTful APIs"
                }
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                value={project.technologies || ""}
                onChange={(e) =>
                  updateProject(
                    index,
                    "technologies",
                    e.target.value,
                    handleInputChange
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., React, Tailwind CSS, Firebase"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectsStep;
