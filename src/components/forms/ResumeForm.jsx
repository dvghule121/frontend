import React from 'react';
import StepForm from './StepForm';
import PersonalInformationStep from './resume_steps/PersonalInformationStep';
import ExperienceStep from './resume_steps/ExperienceStep';
import EducationStep from './resume_steps/EducationStep';
import SkillsStep from './resume_steps/SkillsStep';
import ProjectsStep from './resume_steps/ProjectsStep';

/**
 * ResumeForm Component
 * 
 * Comprehensive resume form based on professional resume structure
 * with proper data structures (arrays for experience, skills, projects)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.onUpdate - Function to update parent component with form data
 * @returns {JSX.Element} The ResumeForm component
 */
const ResumeForm = ({ data = {}, onUpdate, onFinish }) => {
  // Use data prop directly
  const formData = data;

  // Define steps with their required fields
  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Basic contact information and professional title',
      fields: ['fullName', 'email', 'phone', 'location', 'professionalTitle']
    },
    {
      id: 2,
      title: 'Experience',
      description: 'Work experience, internships, and professional roles',
      fields: ['experience']
    },
    {
      id: 3,
      title: 'Education',
      description: 'Educational background and qualifications',
      fields: ['degree', 'institution', 'educationDuration', 'educationLocation']
    },
    {
      id: 4,
      title: 'Skills',
      description: 'Technical skills, programming languages, and tools',
      fields: ['skills']
    },
    {
      id: 5,
      title: 'Projects',
      description: 'Notable projects and achievements',
      fields: ['projects']
    }
  ];

  // Helper function to add new experience entry
  const addExperience = (handleInputChange) => {
    const currentExperience = formData.experience || [];
    const newExperience = {
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      duration: '',
      description: [], // store as array of bullets
    };
    const updatedExperience = [...currentExperience, newExperience];
    handleInputChange({ target: { name: 'experience', value: updatedExperience } });
  };

  // Helper function to remove experience entry
  const removeExperience = (index, handleInputChange) => {
    const currentExperience = formData.experience || [];
    const updatedExperience = currentExperience.filter((_, i) => i !== index);
    handleInputChange({ target: { name: 'experience', value: updatedExperience } });
  };

  // Helper function to update experience entry
  const updateExperience = (index, field, value, handleInputChange) => {
    const currentExperience = formData.experience || [];
    const updatedExperience = [...currentExperience];
    // If updating description from textarea, split by new lines into bullets
    if (field === 'description') {
      // Store the raw value for editing, split only for preview
      const arr = (value || '').split(/\r?\n/);
      updatedExperience[index] = { ...updatedExperience[index], [field]: arr };
    } else {
      updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    }
    handleInputChange({ target: { name: 'experience', value: updatedExperience } });
  };

  // Helper functions for projects
  const addProject = (handleInputChange) => {
    const currentProjects = formData.projects || [];
    const newProject = {
      id: Date.now(),
      name: '',
      description: [],
      technologies: '',
      startDate: '',
      endDate: '',
      link: ''
    };
    const updatedProjects = [...currentProjects, newProject];
    handleInputChange({ target: { name: 'projects', value: updatedProjects } });
  };

  const removeProject = (index, handleInputChange) => {
    const currentProjects = formData.projects || [];
    const updatedProjects = currentProjects.filter((_, i) => i !== index);
    handleInputChange({ target: { name: 'projects', value: updatedProjects } });
  };

  const updateProject = (index, field, value, handleInputChange) => {
    const currentProjects = formData.projects || [];
    const updatedProjects = [...currentProjects];
    let nextValue = value;
    if (field === 'description') {
      // Store the raw value for editing, split only for preview
      nextValue = (value || '').split(/\r?\n/);
    }
    updatedProjects[index] = { ...updatedProjects[index], [field]: nextValue };
    handleInputChange({ target: { name: 'projects', value: updatedProjects } });
  };

  // Render step content based on current step
  const renderStep = (stepId, { handleInputChange }) => {
    switch (stepId) {
      case 1:
        return <PersonalInformationStep formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return (
          <ExperienceStep
            formData={formData}
            handleInputChange={handleInputChange}
            addExperience={addExperience}
            removeExperience={removeExperience}
            updateExperience={updateExperience}
          />
        );
      case 3:
        return <EducationStep formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <SkillsStep formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return (
          <ProjectsStep
            formData={formData}
            handleInputChange={handleInputChange}
            addProject={addProject}
            removeProject={removeProject}
            updateProject={updateProject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <StepForm
      steps={steps}
      formData={formData}
      onUpdate={onUpdate}
      onFinish={onFinish}
      renderStep={renderStep}
    />
  );
};

export default ResumeForm;