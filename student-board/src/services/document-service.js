import apiClient from '../core/api/client.js';

export const documentService = {
  getDocuments: async (studentId) => {
    const response = await apiClient.get(`/students/${studentId}/documents`);
    return response.data.data;
  },
};
