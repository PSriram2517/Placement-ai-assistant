import axios from 'axios';

const API_URL = 'http://localhost:8000';
const TOKEN_KEY = 'placementgpt_token';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const extractError = (error, fallback) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  return fallback;
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, 'Unable to sign in. Check that the backend is running.'));
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, 'Unable to create account. Check that the backend is running.'));
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Clear local session even if the server is unreachable
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return {
      status: 'error',
      ollama: 'disconnected',
      ollama_message: 'Backend is not running. Please start the backend server.',
    };
  }
};

export const askQuestion = async (question, conversationId) => {
  try {
    const response = await api.post('/chat', {
      question,
      conversation_id: conversationId,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, 'An error occurred while connecting to the server. Is the backend running?'));
  }
};

export const uploadPdf = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percentCompleted);
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, 'Failed to upload PDF. Ensure the backend is running.'));
  }
};

export const getDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data.documents;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

export default api;
