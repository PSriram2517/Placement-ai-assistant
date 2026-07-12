import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('An error occurred while connecting to the server. Is the backend running?');
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
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to upload PDF. Ensure the backend is running.');
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

