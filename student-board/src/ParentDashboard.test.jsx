import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

// Mock ResizeObserver
window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ParentDashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  const mockUser = {
    username: 'parent@demo.com',
    firstName: 'John',
    guardianId: 'g1'
  };

  it('renders loading state initially', () => {
    guardianService.getStudents.mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(<ParentDashboard user={mockUser} onLogout={vi.fn()} />);
    
    expect(screen.getByText(/Loading your dashboard…/i)).toBeInTheDocument();
  });

  it('renders the dashboard when data is loaded', async () => {
    guardianService.getStudents.mockResolvedValue([{ id: 's1', name: 'Alice', grade: '10th', photo: '👩' }]);
    
    render(<ParentDashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      // Check for name with emoji
      expect(screen.getByText(/John 👋/i)).toBeInTheDocument();
    });

    // Check branding
    expect(screen.getAllByText('EduPortal').length).toBeGreaterThan(0);
    
    // Check main nav
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });

  it('opens profile photo modal when avatar is clicked', async () => {
    guardianService.getStudents.mockResolvedValue([{ id: 's1', name: 'Alice', grade: '10th', photo: '👩' }]);
    
    render(<ParentDashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/John 👋/i)).toBeInTheDocument();
    });

    // Finding avatars (top bar and greeting card)
    const avatars = screen.getAllByTitle('Edit profile photo');
    fireEvent.click(avatars[0]); // Click the top bar one

    // Modal should appear
    expect(screen.getByText('Profile Photo')).toBeInTheDocument();
    expect(screen.getAllByText('J').length).toBeGreaterThan(0); // Initial for John (multiple may exist)
  });
});
