import api from './api';

export const guardianService = {
  getStudents: async (guardianId) => {
    const response = await api.get(`/guardians/${guardianId}/students`);
    return response.data.data;
  },

  getStudentPerformance: async (guardianId, studentId) => {
    const response = await api.get(
      `/guardians/${guardianId}/students/${studentId}/performance`
    );
    return response.data.data;
  },

  makePayment: async (guardianId, paymentData) => {
    const response = await api.post(
      `/guardians/${guardianId}/payments`,
      paymentData
    );
    return response.data.data;
  },
};