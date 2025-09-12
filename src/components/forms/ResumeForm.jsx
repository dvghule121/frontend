import React from "react";
import StepForm from "./StepForm";
import PersonalInformationStep from "./resume_steps/PersonalInformationStep";
import ExperienceStep from "./resume_steps/ExperienceStep";
import EducationStep from "./resume_steps/EducationStep";
import SkillsStep from "./resume_steps/SkillsStep";
import ProjectsStep from "./resume_steps/ProjectsStep";

/**
 * ResumeForm Component
 *
 * Comprehensive resume form based on professional resume structure
 * with proper data structures (arrays for experience, skills, projects)
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFinish - Function called when form is finished
 * @returns {JSX.Element} The ResumeForm component
 */
const ResumeForm = ({ onFinish }) => {

  // Define steps with their required fields
  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic contact information and professional title",
      fields: ["full_name", "email", "phone", "location", "professional_title"],
    },
    {
      id: 2,
      title: "Experience",
      description: "Work experience, internships, and professional roles",
      fields: ["experience"],
    },
    {
      id: 3,
      title: "Education",
      description: "Educational background and qualifications",
      fields: ["education"],
    },
    {
      id: 4,
      title: "Skills",
      description: "Technical skills, programming languages, and tools",
      fields: ["skills"],
    },
    {
      id: 5,
      title: "Projects",
      description: "Notable projects and achievements",
      fields: ["projects"],
    },
  ];

  // Render step content based on current step - no more prop drilling!
  const renderStep = (stepId) => {
    switch (stepId) {
      case 1:
        return <PersonalInformationStep />;
      case 2:
        return <ExperienceStep />;
      case 3:
        return <EducationStep />;
      case 4:
        return <SkillsStep />;
      case 5:
        return <ProjectsStep />;
      default:
        return null;
    }
  };

  return (
    <StepForm
      steps={steps}
      onFinish={onFinish}
      renderStep={renderStep}
    />
  );
};

export default ResumeForm;
