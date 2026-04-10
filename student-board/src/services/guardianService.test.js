import { vi, describe, it, expect, beforeEach } from 'vitest';
import { guardianService } from './guardianService';
import api from './api';

// Mock the api module
vi.mock('./api');

describe('guardianService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getStudents makes a GET request and returns data', async () => {
    const mockData = { data: { data: [{ id: 1, name: 'John Doe' }] } };
    api.get.mockResolvedValue(mockData);

    const result = await guardianService.getStudents('guardian123');

    expect(api.get).toHaveBeenCalledWith('/guardians/guardian123/students');
    expect(result).toEqual([{ id: 1, name: 'John Doe' }]);
  });

  it('getStudentPerformance makes a GET request and returns data', async () => {
    const mockData = { data: { data: { currentGPA: 3.5 } } };
    api.get.mockResolvedValue(mockData);

    const result = await guardianService.getStudentPerformance('guardian123', 'student456');

    expect(api.get).toHaveBeenCalledWith('/guardians/guardian123/students/student456/performance');
    expect(result).toEqual({ currentGPA: 3.5 });
  });

  it('makePayment makes a POST request and returns data', async () => {
    const paymentData = { student_id: 'student456', amount: 100 };
    const mockData = { data: { data: { transactionId: 'txn789', status: 'completed' } } };
    api.post.mockResolvedValue(mockData);

    const result = await guardianService.makePayment('guardian123', paymentData);

    expect(api.post).toHaveBeenCalledWith('/guardians/guardian123/payments', paymentData);
    expect(result).toEqual({ transactionId: 'txn789', status: 'completed' });
  });
});
