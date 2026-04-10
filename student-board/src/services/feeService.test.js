import { vi, describe, it, expect, beforeEach } from 'vitest';
import { feeService } from './feeService';
import api from './api';

// Mock the api module
vi.mock('./api');

describe('feeService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getAccount makes a GET request and returns data', async () => {
    const mockData = { data: { data: { currentBalance: 500 } } };
    api.get.mockResolvedValue(mockData);

    const result = await feeService.getAccount('student123');

    expect(api.get).toHaveBeenCalledWith('/fees/accounts/student123');
    expect(result).toEqual({ currentBalance: 500 });
  });

  it('getTransactions makes a GET request and returns data', async () => {
    const mockData = { data: { data: [{ id: 1, amount: 200 }] } };
    api.get.mockResolvedValue(mockData);

    const result = await feeService.getTransactions('student123');

    expect(api.get).toHaveBeenCalledWith('/fees/accounts/student123/transactions');
    expect(result).toEqual([{ id: 1, amount: 200 }]);
  });
});
