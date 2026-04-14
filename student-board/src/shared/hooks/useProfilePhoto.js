import { useState, useCallback } from 'react';

const STORAGE_KEY = (username) => `profile_photo_${username}`;

/**
 * Hook to manage a user's profile photo stored in localStorage as a base64 data-URL.
 * @param {string} username - unique identifier for the user (email works fine)
 */
export const useProfilePhoto = (username) => {
  const [photo, setPhoto] = useState(() => {
    if (!username) return null;
    return localStorage.getItem(STORAGE_KEY(username)) || null;
  });

  const savePhoto = useCallback((dataUrl) => {
    if (!username) return;
    localStorage.setItem(STORAGE_KEY(username), dataUrl);
    setPhoto(dataUrl);
  }, [username]);

  const removePhoto = useCallback(() => {
    if (!username) return;
    localStorage.removeItem(STORAGE_KEY(username));
    setPhoto(null);
  }, [username]);

  return { photo, savePhoto, removePhoto };
};
