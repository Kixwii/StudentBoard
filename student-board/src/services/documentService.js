import api from './api';

export const documentService = {
  getDocuments: async (studentId) => {
    const response = await api.get(`/students/${studentId}/documents`);
    return response.data.data;
  },
};
