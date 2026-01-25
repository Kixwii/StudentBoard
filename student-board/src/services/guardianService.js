import api from './api';

export const guardianService = {
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

// src/services/feeService.js
import api from './api';

export const feeService = {
  getAccount: async (accountId) => {
    const response = await api.get(`/fees/accounts/${accountId}`);
    return response.data.data;
  },

  getTransactions: async (accountId) => {
    const response = await api.get(`/fees/accounts/${accountId}/transactions`);
    return response.data.data;
  },
};