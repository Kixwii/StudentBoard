import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TeacherDashboard from './TeacherDashboard';
import * as mockDataService from './services/mockDataService';

// Mock the mockDataService
vi.mock('./services/mockDataService', () => ({
  getAllStudents: vi.fn(),
  getStudentAcademic: vi.fn(),
  updateStudentAcademic: vi.fn(),
}));

describe('TeacherDashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  const mockUser = {
    username: 'teacher@demo.com',
    firstName: 'Sarah',
    userType: 'teacher'
  };

  const mockStudents = [
    { id: 's1', name: 'Alice Smith', grade: '10th', photo: '👩' },
    { id: 's2', name: 'Bob Jones', grade: '10th', photo: '👦' }
  ];

  const mockAcademic = {
    attendance: { totalDays: 100, present: 95, absent: 5, late: 0 },
    currentGPA: 3.8,
    subjects: [
      { name: 'Math', score: 90, maxScore: 100, grade: 'A' }
    ],
    behavioralAssessment: 'Good student.'
  };

  it('renders classroom overview initially', async () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    expect(screen.getByText(/Sarah 🍎/i)).toBeInTheDocument();
    expect(screen.getByText(/2 students in your classroom/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('navigates to student detail when a student card is clicked', async () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    fireEvent.click(screen.getByText('Alice'));

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText(/ID: s1/i)).toBeInTheDocument();
      expect(screen.getByText('Subject Grades')).toBeInTheDocument();
    });
  });

  it('opens profile photo modal when top bar avatar is clicked', async () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    // Top bar avatar
    const avatars = screen.getAllByTitle('Edit profile photo');
    fireEvent.click(avatars[0]);

    expect(screen.getByText('Profile Photo')).toBeInTheDocument();
    expect(screen.getAllByText('S').length).toBeGreaterThan(0); // Initial for Sarah (multiple may exist)
  });

  it('opens profile photo modal when hero card avatar is clicked', async () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    // Hero card avatar has the same title
    const avatars = screen.getAllByTitle('Edit profile photo');
    fireEvent.click(avatars[1]); // The one in the hero card

    expect(screen.getByText('Profile Photo')).toBeInTheDocument();
  });
});
