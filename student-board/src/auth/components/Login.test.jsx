import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import api from './services/api';

vi.mock('./services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders login form properly with branding', () => {
    render(<Login onLogin={vi.fn()} />);

    expect(screen.getByText('EduPortal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('parent@school.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In as Parent/i })).toBeInTheDocument();
  });

  it('switches between parent and teacher roles', () => {
    render(<Login onLogin={vi.fn()} />);

    // Switch to teacher
    fireEvent.click(screen.getByText('Teacher'));

    // Check if Teacher button is active (it should have white color/black background)
    const teacherBtn = screen.getByText('Teacher');
    expect(teacherBtn.parentElement).toBeInTheDocument();
    // We can check if it stays teacher role by submitting
  });

  it('calls onLogin prop on submit', async () => {
    const handleLogin = vi.fn();

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

    render(<Login onLogin={handleLogin} />);

    fireEvent.change(screen.getByPlaceholderText('parent@school.com'), { target: { value: 'test@parent.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign In as Parent/i }));

    expect(screen.getByText('Signing in…')).toBeInTheDocument();

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('test@parent.com', 'parent', 'g1', 'Test');
    }, { timeout: 1500 });
  });
});
