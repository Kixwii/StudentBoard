import React from 'react';

/**
 * ProfileAvatar
 * ─────────────
 * A clickable circular avatar showing either a photo or a letter initial.
 *
 * Pure component — rendering depends only on props. Used in the top bar,
 * greeting card, and teacher hero. Extracted because this exact pattern
 * appeared 4 times across both dashboards.
 *
 * @param {Object} props
 * @param {string|null} props.photo     - Base64 data URL or null if no photo.
 * @param {string}      props.initial   - Single character to show when no photo.
 * @param {number}      [props.size=36] - Width and height in pixels.
 * @param {Function}    props.onClick   - Click handler (typically opens photo modal).
 * @param {string}      [props.title]   - Tooltip text for the button.
 * @param {string}      [props.initialSize='0.7rem'] - Font size of the initial letter.
 *
 * @example
 *   <ProfileAvatar
 *     photo={profilePhoto}
 *     initial="P"
 *     size={44}
 *     onClick={() => setShowPhotoModal(true)}
 *     title="Edit profile photo"
 *   />
 */
const ProfileAvatar = React.memo(({ photo, initial, size = 36, onClick, title, initialSize = '0.7rem' }) => (
  <button
    onClick={onClick}
    title={title}
    className="profile-avatar"
    style={{ width: size, height: size }}
  >
    {photo
      ? <img src={photo} alt="Profile" />
      : <span className="profile-avatar__initial" style={{ fontSize: initialSize }}>{initial}</span>
    }
  </button>
));

ProfileAvatar.displayName = 'ProfileAvatar';

export default ProfileAvatar;
