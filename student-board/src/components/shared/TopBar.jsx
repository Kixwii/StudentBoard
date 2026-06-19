import React from 'react';
import { Menu } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

/**
 * TopBar
 * ──────
 * A sticky top navigation bar with a hamburger menu button, a page title,
 * and a profile avatar. Used identically by both parent and teacher dashboards.
 *
 * Pure component — all data flows through props. No internal state.
 *
 * @param {Object} props
 * @param {string}      props.title          - The current page/tab title to display.
 * @param {Function}    props.onMenuClick    - Handler for the hamburger menu button.
 * @param {string|null} props.profilePhoto   - Base64 photo URL (or null for initials).
 * @param {Function}    props.onProfileClick - Handler when the avatar is clicked.
 * @param {string}      props.userInitial    - Single character initial (e.g. "P", "T").
 *
 * @example
 *   <TopBar
 *     title="Dashboard"
 *     onMenuClick={() => setSidebarOpen(true)}
 *     profilePhoto={photo}
 *     onProfileClick={() => setShowPhotoModal(true)}
 *     userInitial="P"
 *   />
 */
const TopBar = React.memo(({ title, onMenuClick, profilePhoto, onProfileClick, userInitial }) => (
  <div className="top-bar">
    {/* Hamburger menu button */}
    <button onClick={onMenuClick} className="top-bar__menu-btn">
      <Menu size={18} color="#1a1a1a" />
    </button>

    {/* Page title */}
    <div className="top-bar__title">{title}</div>

    {/* Profile avatar */}
    <ProfileAvatar
      photo={profilePhoto}
      initial={userInitial}
      size={36}
      onClick={onProfileClick}
      title="Edit profile photo"
      initialSize="0.7rem"
    />
  </div>
));

TopBar.displayName = 'TopBar';

export default TopBar;
