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

    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },

    setSectionCompleted: (state, action) => {
      const { section, completed } = action.payload;
      state.completedSections[section] = completed;
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
  setActiveSection,
  setSectionCompleted,
  checkSectionCompletion,
  resetForm,
} = profileFormSlice.actions;

// Export reducer
export default profileFormSlice.reducer;
