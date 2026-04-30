import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, X, CheckCircle } from 'lucide-react';

/**
 * Modal/bottom-sheet for uploading or removing a profile photo.
 * Accepts a file from the device (works with camera on mobile).
 *
 * Props:
 *  currentPhoto {string|null}  - existing base64 data-URL or null
 *  userName     {string}       - display name shown in the preview
 *  onSave       {fn(dataUrl)}  - called with the new base64 string
 *  onRemove     {fn()}         - called when user removes their photo
 *  onClose      {fn()}         - called to dismiss the modal
 *  userId       {string}       - optional unique id to display
 */
const ProfilePhotoModal = ({ currentPhoto, userName, onSave, onRemove, onClose, userId }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentPhoto || null);
  const [isDirty, setIsDirty] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => readFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  };

  const handleSave = () => {
    if (preview && isDirty) onSave(preview);
    onClose();
  };

  const handleRemove = () => {
    setPreview(null);
    setIsDirty(true);
    onRemove();
    onClose();
  };

  // Initials fallback
  const initials = userName
    ? userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}
      >
        {/* Sheet — stop propagation so clicks inside don't close */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480,
            padding: '1.5rem 1.25rem 2rem', position: 'relative',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
          `}</style>

          {/* Handle + close */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: 36, height: 4, background: '#e8e8e8', borderRadius: 99, margin: '0 auto' }} />
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{ position: 'absolute', right: 16, top: 16, background: '#f5f7fa', border: 'none', borderRadius: 10, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
            >
              <X size={16} />
            </button>
          </div>

          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '1.25rem', textAlign: 'center' }}>
            Profile Photo
          </h2>

          {/* Avatar preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  style={{ width: 96, height: 96, borderRadius: 24, objectFit: 'cover', border: '3px solid #e8e8e8', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: 96, height: 96, borderRadius: 24, background: '#1a1a1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', fontWeight: 800, color: '#a3e635', border: '3px solid #e8e8e8',
                }}>
                  {initials}
                </div>
              )}
              {/* Camera badge */}
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change photo"
                style={{
                  position: 'absolute', bottom: -6, right: -6,
                  width: 30, height: 30, borderRadius: 99, background: '#1a1a1a',
                  border: '2px solid #fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <Camera size={14} color="#a3e635" />
              </button>
            </div>
          </div>

          {userId && (
            <div style={{ marginBottom: '1.5rem', textAlign: 'center', background: '#f5f7fa', padding: '0.75rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Your Unique Parent ID
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <code style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: 700, background: '#fff', padding: '4px 8px', borderRadius: 6, border: '1px solid #e8e8e8' }}>
                  {btoa(userId).substring(0, 16)}...
                </code>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '6px 0 0', lineHeight: 1.4 }}>
                Provide this ID to your child's teacher so they can assign them to your account securely.
              </p>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#1a1a1a' : '#e8e8e8'}`,
              borderRadius: 16, padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? '#f5f5f5' : '#f9f9f9', transition: 'all 0.15s',
              marginBottom: '1rem',
            }}
          >
            <Upload size={22} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>
              Tap to choose a photo
            </p>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: 0 }}>
              JPG, PNG, WebP — max 5 MB
            </p>
          </div>

          {/* Hidden file input — accept=image/* enables camera on iOS/Android */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={handleSave}
              disabled={!isDirty || !preview}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 14, border: 'none',
                background: isDirty && preview ? '#1a1a1a' : '#f3f4f6',
                color: isDirty && preview ? '#fff' : '#9ca3af',
                fontWeight: 700, fontSize: '0.875rem', cursor: isDirty && preview ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <CheckCircle size={16} />
              Save Photo
            </button>

            {currentPhoto && (
              <button
                onClick={handleRemove}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: 14, border: '1px solid #fecaca',
                  background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: '0.875rem',
                  cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                }}
              >
                <Trash2 size={16} />
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePhotoModal;
