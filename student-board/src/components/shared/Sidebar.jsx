import React from 'react';
import { X, ChevronRight, LogOut, GraduationCap } from 'lucide-react';

/**
 * Sidebar
 * ───────
 * A slide-in navigation sidebar with an optional child-selector section.
 *
 * This unified component replaces the two near-identical Sidebar components
 * that were defined inside ParentDashboard and TeacherDashboard. The key
 * difference between the parent and teacher versions was the "My Children"
 * selector — handled here via the optional `childList` prop.
 *
 * Pure component — no internal state. All interactions are communicated
 * upward through callback props (onClose, onNav, onSelectChild, onLogout).
 *
 * @param {Object} props
 * @param {boolean}  props.open            - Whether the sidebar is visible.
 * @param {Function} props.onClose         - Called to close the sidebar.
 * @param {Array<{ id: string, label: string, icon: React.ComponentType }>} props.navItems
 *   Navigation menu items.
 * @param {string}   props.activeTab       - Currently active nav item ID.
 * @param {Function} props.onNav           - Called with the tab ID when a nav item is clicked.
 * @param {Function} props.onLogout        - Called when the logout button is clicked.
 * @param {Array}    [props.childList=[]]  - Optional list of children (parent mode only).
 * @param {number}   [props.selectedChild] - Index of the currently selected child.
 * @param {Function} [props.onSelectChild] - Called with child index when a child is selected.
 *
 * @example
 *   // Teacher mode (no children)
 *   <Sidebar open={isOpen} onClose={close} navItems={items} activeTab="classroom" onNav={setTab} onLogout={logout} />
 *
 *   // Parent mode (with children selector)
 *   <Sidebar
 *     open={isOpen} onClose={close} navItems={items}
 *     activeTab="dashboard" onNav={setTab} onLogout={logout}
 *     childList={children} selectedChild={0} onSelectChild={setChild}
 *   />
 */
const Sidebar = React.memo(({
  open,
  onClose,
  navItems,
  activeTab,
  onNav,
  onLogout,
  childList = [],
  selectedChild,
  onSelectChild,
}) => (
  <>
    {/* ── Backdrop overlay ── */}
    <div
      onClick={onClose}
      className={`sidebar-backdrop ${open ? 'sidebar-backdrop--visible' : 'sidebar-backdrop--hidden'}`}
    />

    {/* ── Sidebar panel ── */}
    <div className={`sidebar-panel ${open ? 'sidebar-panel--open' : 'sidebar-panel--closed'}`}>

      {/* Brand header */}
      <div className="sidebar__brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="sidebar__brand-logo">
            <GraduationCap size={18} color="#a3e635" />
          </div>
          <span className="sidebar__brand-name">EduPortal</span>
        </div>
        <button onClick={onClose} className="sidebar__close-btn">
          <X size={18} />
        </button>
      </div>

      {/* Scrollable content area */}
      <div className="sidebar__scroll-area">

        {/* ── Children selector (parent mode only) ── */}
        {childList.length > 0 && (
          <div className="sidebar__section">
            <div className="label-sm sidebar__section-label">My Children</div>
            {childList.map((child, i) => (
              <button
                key={i}
                onClick={() => { onSelectChild(i); onClose(); }}
                className={`sidebar__child-btn ${selectedChild === i ? 'sidebar__child-btn--active' : ''}`}
              >
                <span className="sidebar__child-emoji">{child.photo}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="sidebar__child-name">{child.name?.split(' ')[0]}</div>
                  <div className="sidebar__child-grade">{child.grade}</div>
                </div>
                {selectedChild === i && <div className="sidebar__active-dot" />}
              </button>
            ))}
          </div>
        )}

        {/* ── Navigation items ── */}
        <nav className="sidebar__nav">
          <div className="label-sm sidebar__section-label">Navigation</div>
          {navItems.map((item) => {
            const active = activeTab === item.id ||
              (activeTab === 'studentDetail' && item.id === 'classroom');
            return (
              <button
                key={item.id}
                onClick={() => { onNav(item.id); onClose(); }}
                className="nav-item"
                style={{
                  background: active ? '#1a1a1a' : 'transparent',
                  color: active ? '#fff' : '#6b7280',
                }}
              >
                <item.icon size={17} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Logout footer ── */}
      <div className="sidebar__footer">
        <button onClick={onLogout} className="nav-item" style={{ color: '#ef4444' }}>
          <LogOut size={17} style={{ flexShrink: 0 }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </>
));

Sidebar.displayName = 'Sidebar';

export default Sidebar;
