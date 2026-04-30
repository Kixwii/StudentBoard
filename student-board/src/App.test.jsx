import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import api from './services/api';

// Mock the services
vi.mock('./services/api', () => ({
  default: {
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
  }
}));

// Mock the components rendered by App so we can test routing logic without deep rendering
vi.mock('./ParentDashboard', () => ({
  default: ({ onLogout }) => (
    <div data-testid="parent-dashboard">
      Parent Dashboard Array
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}));

vi.mock('./TeacherDashboard', () => ({
  default: ({ onLogout }) => (
    <div data-testid="teacher-dashboard">
      Teacher Dashboard Array
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    api.post.mockResolvedValue({
      data: {
        data: {
          token: 'mock-token',
          user: {
            email: 'test@parent.com',
            role: 'parent',
            guardian_id: 'g1',
            first_name: 'Test'
          }
        }
      }
    });
  });

  it('renders Login component initially', () => {
    render(<App />);
    expect(screen.getByText('EduPortal')).toBeInTheDocument();
  });

  it('navigates to ParentDashboard on parent login', async () => {
    render(<App />);

    // Fill credentials and click parent login
    fireEvent.change(screen.getByPlaceholderText('parent@school.com'), { target: { value: 'parent@domain.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In as Parent/i }));

    // Wait for the async login timeout inside Login.jsx
    await waitFor(() => {
      expect(screen.getByTestId('parent-dashboard')).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('navigates to TeacherDashboard on teacher login', async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          token: 'mock-token',
          user: {
            email: 'teacher@domain.com',
            role: 'teacher',
            first_name: 'Teacher'
          }
        }
      }
    });

    render(<App />);

    // Switch to teacher
    fireEvent.click(screen.getByText('Teacher'));

    // Fill credentials and click teacher login
    fireEvent.change(screen.getByPlaceholderText('teacher@school.com'), { target: { value: 'teacher@domain.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In as Teacher/i }));

    // Wait for the async login timeout inside Login.jsx
    await waitFor(() => {
      expect(screen.getByTestId('teacher-dashboard')).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('logs out and goes back to login', async () => {
    render(<App />);

    // Login first
    fireEvent.change(screen.getByPlaceholderText('parent@school.com'), { target: { value: 'parent@domain.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In as Parent/i }));

    await waitFor(() => {
      expect(screen.getByTestId('parent-dashboard')).toBeInTheDocument();
    }, { timeout: 1500 });

    // Click mock logout
    fireEvent.click(screen.getByText('Logout'));

    // Should be back at login
    expect(screen.getByText('EduPortal')).toBeInTheDocument();
  });
});
