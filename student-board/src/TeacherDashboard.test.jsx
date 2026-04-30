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
  addStudent: vi.fn(),
  CBC_LEVELS: [
    { value: 4, label: 'Exceeding Expectation', short: 'EE', color: '#16a34a', bg: '#f0fdf4' },
    { value: 3, label: 'Meeting Expectation',   short: 'ME', color: '#2563eb', bg: '#eff6ff' },
    { value: 2, label: 'Approaching Expectation', short: 'AE', color: '#ca8a04', bg: '#fefce8' },
    { value: 1, label: 'Below Expectation',      short: 'BE', color: '#dc2626', bg: '#fef2f2' },
  ],
  getLevelInfo: vi.fn((ind) => {
    const levels = {
      4: { value: 4, label: 'Exceeding Expectation', short: 'EE', color: '#16a34a', bg: '#f0fdf4' },
      3: { value: 3, label: 'Meeting Expectation',   short: 'ME', color: '#2563eb', bg: '#eff6ff' },
      2: { value: 2, label: 'Approaching Expectation', short: 'AE', color: '#ca8a04', bg: '#fefce8' },
      1: { value: 1, label: 'Below Expectation',      short: 'BE', color: '#dc2626', bg: '#fef2f2' },
    };
    return levels[ind] || levels[1];
  }),
  ALL_GRADES: ['PP1','PP2','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9'],
}));

describe('TeacherDashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    // Re-set getLevelInfo after resetAllMocks
    mockDataService.getLevelInfo.mockImplementation((ind) => {
      const levels = {
        4: { value: 4, label: 'Exceeding Expectation', short: 'EE', color: '#16a34a', bg: '#f0fdf4' },
        3: { value: 3, label: 'Meeting Expectation',   short: 'ME', color: '#2563eb', bg: '#eff6ff' },
        2: { value: 2, label: 'Approaching Expectation', short: 'AE', color: '#ca8a04', bg: '#fefce8' },
        1: { value: 1, label: 'Below Expectation',      short: 'BE', color: '#dc2626', bg: '#fef2f2' },
      };
      return levels[ind] || levels[1];
    });
  });

  const mockUser = {
    username: 'teacher@demo.com',
    firstName: 'Sarah',
    userType: 'teacher'
  };

  const mockStudents = [
    { id: 's1', name: 'Alice Smith', grade: 'Grade 8', class: '8A', photo: '👩' },
    { id: 's2', name: 'Bob Jones', grade: 'Grade 5', class: '5B', photo: '👦' }
  ];

  const mockAcademic = {
    attendance: { totalDays: 100, present: 95, absent: 5, late: 0 },
    overallLevel: 3,
    strands: [
      { name: 'Mathematics', subStrand: 'Numbers', indicator: 3, descriptor: 'Meeting Expectation', teacher: 'Ms. R' }
    ],
    behavioralAssessment: 'Good student.',
    recentAssignments: [],
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

  it('navigates to student detail and shows CBC strands', async () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    fireEvent.click(screen.getByText('Alice'));

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText(/ID: s1/i)).toBeInTheDocument();
      expect(screen.getByText('Strand Performance')).toBeInTheDocument();
      expect(screen.getByText('CBC Level')).toBeInTheDocument();
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
    });
  });

  it('opens profile photo modal when avatar is clicked', async () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    const avatars = screen.getAllByTitle('Edit profile photo');
    fireEvent.click(avatars[0]);

    expect(screen.getByText('Profile Photo')).toBeInTheDocument();
  });

  it('can navigate to Admin Controls and add a student', async () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);
    mockDataService.addStudent.mockReturnValue({ id: 's3', name: 'New Kid', grade: 'Grade 5', class: '5A', photo: '👤' });

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    fireEvent.click(screen.getByText('Admin Controls'));
    expect(screen.getByText('Add New Student')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('e.g. Jane Doe'), { target: { value: 'New Kid' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. cGFyZW50...'), { target: { value: 'cGFyZW50QGRlbW8uY29t' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Grade 5'), { target: { value: 'Grade 5' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 5A'), { target: { value: '5A' } });

    fireEvent.click(screen.getByRole('button', { name: 'Add Student' }));

    await waitFor(() => {
      expect(mockDataService.addStudent).toHaveBeenCalledWith({
        name: 'New Kid',
        guardianId: 'cGFyZW50QGRlbW8uY29t',
        grade: 'Grade 5',
        class: '5A',
        photo: '👤'
      });
      expect(screen.getByText(/Successfully added student New Kid/i)).toBeInTheDocument();
    });
  });

  it('shows CBC level indicators on classroom cards', () => {
    mockDataService.getAllStudents.mockReturnValue(mockStudents);
    mockDataService.getStudentAcademic.mockReturnValue(mockAcademic);

    render(<TeacherDashboard user={mockUser} onLogout={vi.fn()} />);

    // Should show "Level" label instead of "GPA"
    const levelLabels = screen.getAllByText('Level');
    expect(levelLabels.length).toBeGreaterThan(0);
  });
});
