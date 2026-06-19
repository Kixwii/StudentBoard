import React from 'react';
import { ArrowLeft, Edit3, Save, X, MessageSquare, BookOpen, UserCheck } from 'lucide-react';
import AttendanceGrid from '../shared/AttendanceGrid';
import ProgressBar from '../shared/ProgressBar';
import { CBC_LEVELS, getLevelInfo } from '../../services/mockDataService';
import { getAttendanceRate } from '../../utils/attendance';

/**
 * StudentDetailView Component
 * ───────────────────────────
 * Renders the detail view and records editor for a single student.
 * Maps:
 * - Action toolbar (Back button, Edit/Save/Cancel operations).
 * - Student profile hero card showing overall CBC average level.
 * - Attendance log grid (via AttendanceGrid).
 * - Behavioral conduct editor / viewer text block.
 * - Strand performance editor (dropdown indicators) or indicators status.
 *
 * @param {Object} props
 * @param {Object} props.selectedStudent - The active student being reviewed.
 * @param {Object} props.academicData - Active student's academic records.
 * @param {boolean} props.isEditing - Edit mode toggled flag.
 * @param {Function} props.onBack - Callback to return to the student list.
 * @param {Function} props.onStartEdit - Callback to enter edit mode.
 * @param {Function} props.onSave - Callback to save edited fields.
 * @param {Function} props.onCancel - Callback to exit edit mode and restore values.
 * @param {Array} props.editedStrands - Live strands editor state array.
 * @param {Object} props.editedAttendance - Live attendance editor state object.
 * @param {string} props.editedBehavior - Live behavior editor text.
 * @param {Function} props.onStrandChange - Handler when a strand indicator changes.
 * @param {Function} props.onAttendanceChange - Handler when an attendance field changes.
 * @param {Function} props.onBehaviorChange - Handler when behavior text changes.
 */
const StudentDetailView = React.memo(({
  selectedStudent,
  academicData,
  isEditing = false,
  onBack,
  onStartEdit,
  onSave,
  onCancel,
  editedStrands = [],
  editedAttendance,
  editedBehavior = '',
  onStrandChange,
  onAttendanceChange,
  onBehaviorChange,
}) => {
  if (!selectedStudent || !academicData) return null;

  const att = academicData.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 };
  const attRate = getAttendanceRate(att);
  const activeLevel = academicData.overallLevel || 0;
  const levelInfo = getLevelInfo(activeLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      
      {/* ── Action Toolbar Row ── */}
      <div className="action-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280', fontFamily: 'inherit', padding: '0.375rem 0' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {isEditing ? (
            <>
              {/* Cancel Button */}
              <button
                onClick={onCancel}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: '#f5f7fa', border: '1px solid #e8e8e8', borderRadius: 12, fontWeight: 600, fontSize: '0.82rem', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <X size={14} /> Cancel
              </button>
              {/* Save Button */}
              <button
                onClick={onSave}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: '#a3e635', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.82rem', color: '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <Save size={14} /> Save Changes
              </button>
            </>
          ) : (
            /* Edit Button */
            <button
              onClick={onStartEdit}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: '#f5f7fa', border: '1px solid #e8e8e8', borderRadius: 12, fontWeight: 600, fontSize: '0.82rem', color: '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Edit3 size={14} /> Edit Records
            </button>
          )}
        </div>
      </div>

      {/* ── Student Profile Header Card ── */}
      <div className="student-profile">
        <div className="student-profile__photo">
          {selectedStudent.photo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="student-profile__name">{selectedStudent.name}</div>
          <div className="student-profile__meta">
            {selectedStudent.grade} · {selectedStudent.class} · ID: {selectedStudent.id}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="label-sm">CBC Level</div>
          <div 
            style={{ 
              fontSize: '2rem', 
              fontWeight: 900, 
              color: levelInfo.color, 
              lineHeight: 1.1 
            }}
          >
            {activeLevel || '—'}
          </div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: levelInfo.color }}>
            {levelInfo.short}
          </div>
        </div>
      </div>

      {/* ── Attendance Log Section ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={16} color="#3b82f6" />
          </div>
          <p className="section-title">Attendance</p>
          {!isEditing && (
            <span 
              className={`badge ${attRate >= 90 ? 'badge-lime' : 'badge-orange'}`} 
              style={{ marginLeft: 'auto' }}
            >
              {attRate}%
            </span>
          )}
        </div>

        {/* Attendance breakdown / editing inputs */}
        <AttendanceGrid
          attendance={att}
          isEditing={isEditing}
          editedAttendance={editedAttendance}
          onAttendanceChange={onAttendanceChange}
        />
      </div>

      {/* ── Behavioral Assessment Section ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={16} color="#a855f7" />
          </div>
          <p className="section-title">Behavioral Assessment</p>
        </div>
        
        {isEditing ? (
          <textarea
            value={editedBehavior}
            onChange={(e) => onBehaviorChange(e.target.value)}
            placeholder="Enter behavioral notes here…"
            rows={4}
            style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 12, fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical', color: '#374151', boxSizing: 'border-box' }}
          />
        ) : (
          <div style={{ background: '#f5f7fa', borderRadius: 12, padding: '0.875rem', fontSize: '0.85rem', color: '#374151', fontStyle: 'italic', lineHeight: 1.6 }}>
            "{academicData.behavioralAssessment || 'No assessment provided yet.'}"
          </div>
        )}
      </div>

      {/* ── Strand Performance Section ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={16} color="#8b5cf6" />
          </div>
          <p className="section-title">Strand Performance</p>
        </div>

        {/* Empty status message */}
        {(isEditing ? editedStrands : (academicData.strands || [])).length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>
            No strands recorded yet.
          </div>
        )}

        {/* List of strands details / dropdown indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {(isEditing ? editedStrands : (academicData.strands || [])).map((strand, index) => {
            const info = getLevelInfo(strand.indicator);
            return (
              <div key={index} style={{ padding: '0.875rem', background: '#f5f7fa', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>{strand.name}</span>
                    {strand.subStrand && <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{strand.subStrand}</div>}
                  </div>
                  
                  {isEditing ? (
                    <select
                      value={strand.indicator}
                      onChange={(e) => onStrandChange(index, e.target.value)}
                      style={{ padding: '0.375rem 0.5rem', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', cursor: 'pointer' }}
                    >
                      {CBC_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.value} — {l.short}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, fontWeight: 800, fontSize: '0.85rem', background: info.bg, color: info.color }}>
                        {strand.indicator}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: info.color }}>
                        {info.short}
                      </span>
                    </div>
                  )}
                </div>
                {!isEditing && <ProgressBar pct={(strand.indicator / 4) * 100} color={info.color} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

StudentDetailView.displayName = 'StudentDetailView';

export default StudentDetailView;
