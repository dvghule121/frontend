import { createSlice } from "@reduxjs/toolkit";

// Initial state for resume data
const initialState = {
  resume: {
    // Personal Information
    full_name: "",
    email: "",
    phone: "",
    location: "",
    professional_title: "",
    // Experience
    experience: [],
    // Education
    education: [],
    // Skills
    skills: "",
    // Projects
    projects: [],
  },

  completedSections: {
    resume: false,
  },

  activeSection: "resume",
  resumeProgress: null, // Add resumeProgress to the initial state
};

const profileFormSlice = createSlice({
  name: "profileForm",
  initialState,
  reducers: {
    updateResume: (state, action) => {
      state.resume = { ...state.resume, ...action.payload };
    },

    updateResumeField: (state, action) => {
      const { field, value } = action.payload;
      state.resume[field] = value;
    },

    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },

    setSectionCompleted: (state, action) => {
      const { section, completed } = action.payload;
      state.completedSections[section] = completed;
    },

    setResumeProgress: (state, action) => { // New action to update resumeProgress
      state.resumeProgress = action.payload;
    },

    // Experience actions
    addExperience: (state) => {
      const newExperience = {
        id: Date.now(),
        title: "",
        company: "",
        location: "",
        duration: "",
        description: "",
      };
      state.resume.experience = [...(state.resume.experience || []), newExperience];
    },

    removeExperience: (state, action) => {
      const id = action.payload;
      state.resume.experience = state.resume.experience.filter(exp => exp.id !== id);
    },

    updateExperience: (state, action) => {
      const { id, field, value } = action.payload;
      const experienceIndex = state.resume.experience.findIndex(exp => exp.id === id);
      if (experienceIndex !== -1) {
        state.resume.experience[experienceIndex][field] = value;
      }
    },

    setExperiences: (state, action) => {
      state.resume.experience = action.payload || [];
    },

    // Education actions
    addEducation: (state) => {
      const newEducation = {
        id: Date.now(),
        degree: "",
        institution: "",
        education_duration: "",
        education_location: "",
        description: "",
      };
      state.resume.education = [...(state.resume.education || []), newEducation];
    },

    removeEducation: (state, action) => {
      const id = action.payload;
      state.resume.education = state.resume.education.filter(edu => edu.id !== id);
    },

    updateEducation: (state, action) => {
      const { id, field, value } = action.payload;
      const educationIndex = state.resume.education.findIndex(edu => edu.id === id);
      if (educationIndex !== -1) {
        state.resume.education[educationIndex][field] = value;
      }
    },

    setEducation: (state, action) => {
      state.resume.education = action.payload || [];
    },

    // Projects actions
    addProject: (state) => {
      const newProject = {
        id: Date.now(),
        name: "",
        description: "",
        technologies: "",
        startDate: "",
        endDate: "",
        link: "",
      };
      state.resume.projects = [...(state.resume.projects || []), newProject];
    },

    removeProject: (state, action) => {
      const id = action.payload;
      state.resume.projects = state.resume.projects.filter(proj => proj.id !== id);
    },

    updateProject: (state, action) => {
      const { id, field, value } = action.payload;
      const projectIndex = state.resume.projects.findIndex(proj => proj.id === id);
      if (projectIndex !== -1) {
        state.resume.projects[projectIndex][field] = value;
      }
    },

    setProjects: (state, action) => {
      state.resume.projects = action.payload || [];
    },

    setSkills: (state, action) => {
      state.resume.skills = action.payload || "";
    },

    // Check if resume section has required fields filled
    checkSectionCompletion: (state, action) => {
      const section = action.payload;
      let isCompleted = false;

      if (section === "resume") {
        // Check if basic required fields are filled
        isCompleted = !!(
          state.resume.full_name &&
          state.resume.email &&
          state.resume.phone &&
          state.resume.location &&
          state.resume.professional_title
        );
      }

      state.completedSections[section] = isCompleted;
    },

    // Reset all form data
    resetForm: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  updateResume,
  updateResumeField,
  setActiveSection,
  setSectionCompleted,
  setResumeProgress, // Export the new action
  addExperience,
  removeExperience,
  updateExperience,
  addEducation,
  removeEducation,
  updateEducation,
  addProject,
  removeProject,
  updateProject,
  checkSectionCompletion,
  resetForm,
  setExperiences,
  setEducation,
  setProjects,
  setSkills,
} = profileFormSlice.actions;

// Export reducer
export default profileFormSlice.reducer;
