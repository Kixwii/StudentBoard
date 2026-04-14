import { vi, describe, it, expect, beforeEach } from 'vitest';
import { documentService } from './document-service.js';
import api from '../core/api/client.js';

// Mock the api module
vi.mock('../core/api/client.js');

describe('documentService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getDocuments makes a GET request and returns data', async () => {
    const mockData = { data: { data: [{ name: 'Report Card.pdf' }] } };
    api.get.mockResolvedValue(mockData);

    const result = await documentService.getDocuments('student123');

    expect(api.get).toHaveBeenCalledWith('/students/student123/documents');
    expect(result).toEqual([{ name: 'Report Card.pdf' }]);
  });
});
