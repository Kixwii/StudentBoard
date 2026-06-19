// utils/styleTokens.js
// ──────────────────────────────────────────────────────────────
// Shared design token utilities.
//
// Previously, both ParentDashboard and TeacherDashboard defined
// identical `S` style objects and `badgeStyle()` functions inline.
// This module extracts them into a single source of truth.
//
// After the CSS migration, inline style objects have been replaced
// by CSS classes in index.css (e.g. `.label-sm`, `.value-lg`,
// `.section-title`, `.badge-lime`). This file provides the helper
// function `badgeClassName()` that maps a badge type to the
// corresponding CSS class string.
// ──────────────────────────────────────────────────────────────

/**
 * badgeClassName
 * ──────────────
 * Returns the CSS class name(s) for a status badge of the given type.
 *
 * Maps logical badge types to their CSS class equivalents defined
 * in index.css. Each type produces a differently colored pill badge:
 *   - 'lime'   → green  (positive / exceeding / high)
 *   - 'orange' → amber  (warning / approaching / watch)
 *   - 'blue'   → blue   (informational / neutral)
 *
 * Pure function: no side effects, always returns the same output
 * for the same input.
 *
 * @param {'lime' | 'orange' | 'blue'} type
 *   The semantic type of the badge. Defaults to 'lime' if omitted.
 *
 * @returns {string}
 *   Space-separated CSS class names (e.g. "badge badge-lime").
 *
 * @example
 *   badgeClassName('lime')    // → "badge badge-lime"
 *   badgeClassName('orange')  // → "badge badge-orange"
 *   badgeClassName()          // → "badge badge-lime"
 */
export const badgeClassName = (type = 'lime') => {
  switch (type) {
    case 'lime': return 'badge badge-lime';
    case 'orange': return 'badge badge-orange';
    case 'blue': return 'badge badge-blue';
    default: return 'badge badge-lime';
  }
};
