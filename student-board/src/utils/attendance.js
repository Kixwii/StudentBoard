// utils/attendance.js
// ──────────────────────────────────────────────────────────────
// Pure helper functions for attendance data transformations.
// These functions accept data as arguments and return new values
// without reading from or writing to any external state.
// ──────────────────────────────────────────────────────────────

/**
 * getAttendanceRate
 * ─────────────────
 * Calculates the attendance rate as a rounded percentage.
 *
 * Handles edge cases where `att` is null/undefined or
 * `totalDays` is zero (returns 0 to avoid division-by-zero).
 *
 * @param {{ totalDays: number, present: number }} att
 *   Attendance record with total school days and days present.
 *
 * @returns {number}
 *   Attendance percentage (0–100), rounded to the nearest integer.
 *
 * @example
 *   getAttendanceRate({ totalDays: 100, present: 94 })  // → 94
 *   getAttendanceRate(null)                               // → 0
 *   getAttendanceRate({ totalDays: 0, present: 0 })      // → 0
 */
export const getAttendanceRate = (att) => {
  if (!att || !att.totalDays) return 0;
  return Math.round((att.present / att.totalDays) * 100);
};

/**
 * getAttendanceBreakdown
 * ──────────────────────
 * Transforms an attendance record into a display-ready array of
 * labelled cells, each with a background color and text color.
 *
 * Used by the AttendanceGrid component to render the 4-column
 * breakdown (Total / Present / Absent / Late).
 *
 * @param {{ totalDays: number, present: number, absent: number, late: number }} att
 *   Full attendance record for a single student.
 *
 * @returns {Array<{ label: string, value: number, bg: string, color: string }>}
 *   Four-element array, one per attendance category, in display order.
 *
 * @example
 *   getAttendanceBreakdown({ totalDays: 100, present: 94, absent: 5, late: 1 })
 *   // → [
 *   //   { label: 'Total',   value: 100, bg: '#f5f7fa', color: '#1a1a1a' },
 *   //   { label: 'Present', value: 94,  bg: '#f0fdf4', color: '#16a34a' },
 *   //   { label: 'Absent',  value: 5,   bg: '#fef2f2', color: '#dc2626' },
 *   //   { label: 'Late',    value: 1,   bg: '#fefce8', color: '#ca8a04' },
 *   // ]
 */
export const getAttendanceBreakdown = (att) => [
  { label: 'Total',   value: att.totalDays, bg: '#f5f7fa', color: '#1a1a1a' },
  { label: 'Present', value: att.present,   bg: '#f0fdf4', color: '#16a34a' },
  { label: 'Absent',  value: att.absent,    bg: '#fef2f2', color: '#dc2626' },
  { label: 'Late',    value: att.late,      bg: '#fefce8', color: '#ca8a04' },
];
