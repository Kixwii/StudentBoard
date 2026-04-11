import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePhotoModal from './ProfilePhotoModal';

describe('ProfilePhotoModal Component', () => {
  const mockOnSave = vi.fn();
  const mockOnRemove = vi.fn();
  const mockOnClose = vi.fn();
  const userName = 'Jane Doe';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with user initials when no photo is provided', () => {
    render(
      <ProfilePhotoModal
        currentPhoto={null}
        userName={userName}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Profile Photo')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument(); // Initials
    expect(screen.getByText('Tap to choose a photo')).toBeInTheDocument();
  });

  it('renders modal with provided photo', () => {
    const mockPhoto = 'data:image/png;base64,mockdata';
    render(
      <ProfilePhotoModal
        currentPhoto={mockPhoto}
        userName={userName}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
        onClose={mockOnClose}
      />
    );

    const img = screen.getByAltText('Profile');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe(mockPhoto);
  });

  it('calls onClose when clicking the close button', () => {
    render(
      <ProfilePhotoModal
        currentPhoto={null}
        userName={userName}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
        onClose={mockOnClose}
      />
    );

    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onRemove when clicking the remove button', () => {
    const mockPhoto = 'data:image/png;base64,mockdata';
    render(
      <ProfilePhotoModal
        currentPhoto={mockPhoto}
        userName={userName}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
        onClose={mockOnClose}
      />
    );

    const removeBtn = screen.getByText('Remove Photo');
    fireEvent.click(removeBtn);
    expect(mockOnRemove).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('Save button is disabled initially when no change is made', () => {
    render(
      <ProfilePhotoModal
        currentPhoto={null}
        userName={userName}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
        onClose={mockOnClose}
      />
    );

    const saveBtn = screen.getByRole('button', { name: /Save Photo/i });
    expect(saveBtn).toBeDisabled();
  });
});
