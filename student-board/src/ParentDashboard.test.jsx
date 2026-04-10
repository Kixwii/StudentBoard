import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ParentDashboard from './ParentDashboard';
import { guardianService } from './services/guardianService';

// Mock the services
vi.mock('./services/guardianService', () => ({
  guardianService: {
    getStudents: vi.fn(),
    getStudentPerformance: vi.fn(),
    makePayment: vi.fn(),
  }
}));

vi.mock('./services/feeService', () => ({
  feeService: {
    getAccount: vi.fn(),
    getTransactions: vi.fn(),
  }
}));

vi.mock('./services/documentService', () => ({
  documentService: {
    getDocuments: vi.fn(),
  }
}));

// Mock ResizeObserver for any chart components that might use it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ParentDashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockUser = {
    guardianId: 'parent@domain.com',
    firstName: 'John',
  };

  it('renders loading state initially', () => {
    // If services reject or return empty, mockDataService handles fallback
    guardianService.getStudents.mockResolvedValue([]);
    
    render(<ParentDashboard user={mockUser} onLogout={vi.fn()} />);
    
    // We expect loader to occasionally appear (depending on effect timing) or we check the welcome text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the dashboard when data is loaded via fallback or API', async () => {
    // Return a mocked student to skip fallback if needed
    guardianService.getStudents.mockResolvedValue([{ id: 's1', name: 'Alice', grade: '10th', photo: '👩' }]);
    
    render(<ParentDashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      // The Welcome back header should appear
      expect(screen.getByText(/Welcome back, John!/i)).toBeInTheDocument();
    });

    // Check if sidebar nav is loaded
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Academic')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
