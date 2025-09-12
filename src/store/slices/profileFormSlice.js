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
      const index = action.payload;
      state.resume.experience = state.resume.experience.filter((_, i) => i !== index);
    },

    updateExperience: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resume.experience[index]) {
        state.resume.experience[index][field] = value;
      }
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
      const index = action.payload;
      state.resume.education = state.resume.education.filter((_, i) => i !== index);
    },

    updateEducation: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resume.education[index]) {
        state.resume.education[index][field] = value;
      }
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
      const index = action.payload;
      state.resume.projects = state.resume.projects.filter((_, i) => i !== index);
    },

    updateProject: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resume.projects[index]) {
        state.resume.projects[index][field] = value;
      }
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
} = profileFormSlice.actions;

// Export reducer
export default profileFormSlice.reducer;
