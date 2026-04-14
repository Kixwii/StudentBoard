import apiClient from '../core/api/client.js';

export const guardianService = {
  getStudents: async (guardianId) => {
    const response = await apiClient.get(`/guardians/${guardianId}/students`);
    return response.data.data;
  },

  getStudentPerformance: async (guardianId, studentId) => {
    const response = await apiClient.get(
      `/guardians/${guardianId}/students/${studentId}/performance`
    );
    return response.data.data;
  },

  makePayment: async (guardianId, paymentData) => {
    const response = await apiClient.post(
      `/guardians/${guardianId}/payments`,
      paymentData
    );
    return response.data.data;
  },
};
