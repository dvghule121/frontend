// API Service for Resume Builder
// Handles all HTTP requests to the Django backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';
// const API_BASE_URL = 'https://pave-asignment-backned.onrender.com/api';

export const getResumeData = async () => {
  try {
    const response = await apiRequest(`/resume`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return null;
  }
};

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
  
  // Handle 204 No Content responses (common for DELETE operations)
  if (response.status === 204) {
    return null;
  }
  
  // Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  // For non-JSON responses, return text or null
  const text = await response.text();
  return text || null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('access_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
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
  register: (userData) => apiRequest('/register/', {
    method: 'POST',
    body: userData,
  }),
  login: (credentials) => apiRequest('/login/', {
    method: 'POST',
    body: credentials,
  }),
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
    get: () => apiRequest('/skills/'),
    update: (data) => apiRequest('/skills/', {
      method: 'PUT',
      body: data,
    }),
  },
};

export default apiService;