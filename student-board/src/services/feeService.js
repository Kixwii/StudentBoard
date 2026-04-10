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
