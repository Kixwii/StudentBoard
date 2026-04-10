import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the components rendered by App so we can test routing logic without deep rendering
vi.mock('./ParentDashboard', () => ({
  default: ({ user, onLogout }) => (
    <div data-testid="parent-dashboard">
      Parent Dashboard Array
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}));

vi.mock('./TeacherDashboard', () => ({
  default: ({ user, onLogout }) => (
    <div data-testid="teacher-dashboard">
      Teacher Dashboard Array
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}));

describe('App Component', () => {
  it('renders Login component initially', () => {
    render(<App />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('navigates to ParentDashboard on parent login', async () => {
    render(<App />);
    
    // Fill credentials and click parent login
    fireEvent.change(screen.getByPlaceholderText('Parent Email'), { target: { value: 'parent@domain.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In as Parent/i }));
    
    // Wait for the async login timeout inside Login.jsx
    await waitFor(() => {
      expect(screen.getByTestId('parent-dashboard')).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('navigates to TeacherDashboard on teacher login', async () => {
    render(<App />);
    
    // Switch to teacher
    fireEvent.click(screen.getByText('Teacher'));
    
    // Fill credentials and click teacher login
    fireEvent.change(screen.getByPlaceholderText('Teacher Email'), { target: { value: 'teacher@domain.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In as Teacher/i }));
    
    // Wait for the async login timeout inside Login.jsx
    await waitFor(() => {
      expect(screen.getByTestId('teacher-dashboard')).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('logs out and goes back to login', async () => {
    render(<App />);
    
    // Login first
    fireEvent.change(screen.getByPlaceholderText('Parent Email'), { target: { value: 'parent@domain.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In as Parent/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('parent-dashboard')).toBeInTheDocument();
    }, { timeout: 1500 });

    // Click mock logout
    fireEvent.click(screen.getByText('Logout'));
    
    // Should be back at login
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });
});
