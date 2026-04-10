import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TeacherDashboard from './TeacherDashboard';

// TeacherDashboard uses local mock services heavily or direct fetch. 
// We will mock the mockDataService directly.
vi.mock('./services/mockDataService', () => ({
  getAllStudents: vi.fn().mockReturnValue([
    { id: '1', name: 'Alice Smith', grade: '10', class: 'A', photo: 'A' },
    { id: '2', name: 'Bob Jones', grade: '10', class: 'A', photo: 'B' }
  ]),
  getStudentsByTeacher: vi.fn().mockReturnValue([
    { id: '1', name: 'Alice Smith', grade: '10', class: 'A', photo: 'A' },
    { id: '2', name: 'Bob Jones', grade: '10', class: 'A', photo: 'B' }
  ]),
  getTeacherClasses: vi.fn().mockReturnValue([
    { id: 'c1', name: '10th Grade Math', time: '9:00 AM' }
  ]),
  getStudentAcademic: vi.fn().mockReturnValue({ currentGPA: 3.8 })
}));

describe('TeacherDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser = {
    username: 'teacher@domain.com',
    firstName: 'Sarah',
  };

  it('renders the teacher dashboard with initial mock data', async () => {
    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Sarah!/i)).toBeInTheDocument();
    });

    // Overview
    expect(screen.getByText('Manage your students and their academic progress')).toBeInTheDocument();
    
    // Check navigation
    expect(screen.getByText('My Classroom')).toBeInTheDocument();
    expect(screen.getByText('Class Analytics')).toBeInTheDocument();
  });
});
