import apiClient from '../core/api/client.js';

export const feeService = {
  getAccount: async (accountId) => {
    const response = await apiClient.get(`/fees/accounts/${accountId}`);
    return response.data.data;
  },

  getTransactions: async (accountId) => {
    const response = await apiClient.get(`/fees/accounts/${accountId}/transactions`);
    return response.data.data;
  },
};
