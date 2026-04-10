import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

describe('Login Component', () => {
  it('renders login form elements properly', () => {
    render(<Login onLogin={vi.fn()} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Parent Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In as Parent/i })).toBeInTheDocument();
  });

  it('switches between parent and teacher roles', () => {
    render(<Login onLogin={vi.fn()} />);
    
    // Switch to teacher
    fireEvent.click(screen.getByText('Teacher'));
    expect(screen.getByPlaceholderText('Teacher Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In as Teacher/i })).toBeInTheDocument();

    // Switch back to parent
    fireEvent.click(screen.getByText('Parent'));
    expect(screen.getByPlaceholderText('Parent Email')).toBeInTheDocument();
  });

  it('calls onLogin prop on submit', async () => {
    const handleLogin = vi.fn();
    render(<Login onLogin={handleLogin} />);
    
    fireEvent.change(screen.getByPlaceholderText('Parent Email'), { target: { value: 'test@parent.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In as Parent/i }));
    
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('test@parent.com', 'parent', 'test@parent.com', 'test');
    }, { timeout: 1500 });
  });
});
