import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfilePhoto } from './useProfilePhoto';

describe('useProfilePhoto Hook', () => {
  const username = 'testuser';
  const storageKey = `profile_photo_${username}`;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initially returns null if no photo is in localStorage', () => {
    const { result } = renderHook(() => useProfilePhoto(username));
    expect(result.current.photo).toBeNull();
  });

  it('initially returns the photo if it exists in localStorage', () => {
    const mockDataUrl = 'data:image/png;base64,mockdata';
    localStorage.setItem(storageKey, mockDataUrl);

    const { result } = renderHook(() => useProfilePhoto(username));
    expect(result.current.photo).toBe(mockDataUrl);
  });

  it('savePhoto updates localStorage and state', () => {
    const { result } = renderHook(() => useProfilePhoto(username));
    const newDataUrl = 'data:image/png;base64,newdata';

    act(() => {
      result.current.savePhoto(newDataUrl);
    });

    expect(result.current.photo).toBe(newDataUrl);
    expect(localStorage.getItem(storageKey)).toBe(newDataUrl);
  });

  it('removePhoto clears localStorage and state', () => {
    const mockDataUrl = 'data:image/png;base64,mockdata';
    localStorage.setItem(storageKey, mockDataUrl);

    const { result } = renderHook(() => useProfilePhoto(username));

    act(() => {
      result.current.removePhoto();
    });

    expect(result.current.photo).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('returns null if no username is provided', () => {
    const { result } = renderHook(() => useProfilePhoto(null));
    expect(result.current.photo).toBeNull();
    
    act(() => {
      result.current.savePhoto('something');
    });
    expect(result.current.photo).toBeNull();
  });
});
