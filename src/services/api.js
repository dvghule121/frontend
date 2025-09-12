// API Service for Resume Builder
// Handles all HTTP requests to the Django backend

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    // For validation errors (400), throw the error object as JSON string
    if (response.status === 400 && error && typeof error === 'object') {
      throw new Error(JSON.stringify(error));
    }
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  return handleResponse(response);
};

// API Service Object
export const apiService = {
  // Complete Resume
  getCompleteResume: () => apiRequest('/resume/'),

  // Personal Info
  personalInfo: {
    get: () => apiRequest('/personalInfo/'),
    update: (id, data) => apiRequest(`/personalInfo/`, {
      method: 'PUT',
      body: data,
    }),
    create: (data) => apiRequest('/personalInfo/', {
      method: 'POST',
      body: data,
    }),
  },

  // Experience
  experience: {
    getAll: () => apiRequest('/experience/'),
    get: (id) => apiRequest(`/experience/${id}/`),
    create: (data) => apiRequest('/experience/', {
      method: 'POST',
      body: data,
    }),
    update: (id, data) => apiRequest(`/experience/${id}/`, {
      method: 'PUT',
      body: data,
    }),
    delete: (id) => apiRequest(`/experience/${id}/`, {
      method: 'DELETE',
    }),
  },

  // Education
  education: {
    getAll: () => apiRequest('/education/'),
    get: (id) => apiRequest(`/education/${id}/`),
    create: (data) => apiRequest('/education/', {
      method: 'POST',
      body: data,
    }),
    update: (id, data) => apiRequest(`/education/${id}/`, {
      method: 'PUT',
      body: data,
    }),
    delete: (id) => apiRequest(`/education/${id}/`, {
      method: 'DELETE',
    }),
  },

  // Projects
  projects: {
    getAll: () => apiRequest('/projects/'),
    get: (id) => apiRequest(`/projects/${id}/`),
    create: (data) => apiRequest('/projects/', {
      method: 'POST',
      body: data,
    }),
    update: (id, data) => apiRequest(`/projects/${id}/`, {
      method: 'PUT',
      body: data,
    }),
    delete: (id) => apiRequest(`/projects/${id}/`, {
      method: 'DELETE',
    }),
  },

  // Skills
  skills: {
    getAll: () => apiRequest('/skills/'),
    get: (id) => apiRequest(`/skills/${id}/`),
    create: (data) => apiRequest('/skills/', {
      method: 'POST',
      body: data,
    }),
    update: (id, data) => apiRequest(`/skills/${id}/`, {
      method: 'PUT',
      body: data,
    }),
    delete: (id) => apiRequest(`/skills/${id}/`, {
      method: 'DELETE',
    }),
  },
};

export default apiService;