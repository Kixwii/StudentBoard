import React from 'react';
import { getAttendanceBreakdown } from '../../utils/attendance';

/**
 * AttendanceGrid
 * ──────────────
 * Displays a 4-column attendance breakdown (Total / Present / Absent / Late).
 *
 * Supports two modes:
 *   - **View mode** (default): Renders coloured stat cells.
 *   - **Edit mode** (`isEditing=true`): Renders editable input fields.
 *
 * Pure component — all display data is derived from props. The
 * `getAttendanceBreakdown()` utility produces the cell configuration.
 * In edit mode, changes are propagated up via the `onAttendanceChange`
 * callback using functional state updates (no mutation).
 *
 * @param {Object} props
 * @param {{ totalDays: number, present: number, absent: number, late: number }} props.attendance
 *   The attendance record to display.
 * @param {boolean} [props.isEditing=false]
 *   When true, renders input fields instead of static values.
 * @param {{ totalDays: number, present: number, absent: number, late: number }} [props.editedAttendance]
 *   Current form values when editing. Required if `isEditing` is true.
 * @param {(key: string, value: string) => void} [props.onAttendanceChange]
 *   Callback invoked with (fieldKey, newValue) when an edit input changes.
 *   The parent should use a functional updater: `prev => ({ ...prev, [key]: value })`.
 *
 * @example
 *   // View mode
 *   <AttendanceGrid attendance={{ totalDays: 100, present: 94, absent: 5, late: 1 }} />
 *
 *   // Edit mode
 *   <AttendanceGrid
 *     attendance={attendance}
 *     isEditing
 *     editedAttendance={editedAttendance}
 *     onAttendanceChange={(key, val) => setEdited(prev => ({ ...prev, [key]: val }))}
 *   />
 */
const AttendanceGrid = React.memo(({
  attendance,
  isEditing = false,
  editedAttendance,
  onAttendanceChange,
}) => {
  // ── Edit mode: render labelled input fields ──
  if (isEditing) {
    const fields = [
      { label: 'Total Days', key: 'totalDays' },
      { label: 'Present',    key: 'present' },
      { label: 'Absent',     key: 'absent' },
      { label: 'Late',       key: 'late' },
    ];

    return (
      <div className="attendance-edit-grid">
        {fields.map(({ label, key }) => (
          <div key={key}>
            <label className="label-sm" style={{ display: 'block', marginBottom: 6 }}>
              {label}
            </label>
            <input
              type="number"
              min="0"
              value={editedAttendance[key]}
              onChange={(e) => onAttendanceChange(key, e.target.value)}
              className="attendance-edit-input"
            />
          </div>
        ))}
      </div>
    );
  }

  // ── View mode: render coloured stat cells ──
  // getAttendanceBreakdown is a pure function that returns display config
  const cells = getAttendanceBreakdown(attendance);

  return (
    <div className="attendance-grid">
      {cells.map((item) => (
        <div
          key={item.label}
          className="attendance-cell"
          style={{ background: item.bg, color: item.color }}
        >
          <div className="attendance-cell__value">{item.value}</div>
          <div className="attendance-cell__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
});

AttendanceGrid.displayName = 'AttendanceGrid';

export default AttendanceGrid;
