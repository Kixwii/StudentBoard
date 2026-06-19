import React from 'react';
import ProfileAvatar from '../shared/ProfileAvatar';
import { getLevelInfo } from '../../services/mockDataService';

/**
 * ClassroomView Component
 * ───────────────────────
 * Renders the students roster grid for the teacher dashboard.
 * Displays greeting header with the teacher's profile avatar and a grid of interactive cards
 * showing basic academic/attendance KPIs for each student.
 *
 * @param {Object} props
 * @param {Object} props.user - Logged-in teacher user details.
 * @param {Array} props.students - Enriched students data array containing inline academic records.
 * @param {string|null} props.profilePhoto - Teacher's avatar photo data URL or null.
 * @param {Function} props.onShowPhotoModal - Callback to trigger the profile photo modal.
 * @param {Function} props.onSelectStudent - Callback when a student card is clicked.
 */
const ClassroomView = React.memo(({
  user,
  students = [],
  profilePhoto,
  onShowPhotoModal,
  onSelectStudent,
}) => {
  const userInitial = (user?.firstName?.[0] || 'T').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* ── Teacher Hero Section ── */}
      <div className="teacher-hero">
        <div style={{ minWidth: 0 }}>
          <div className="teacher-hero__label">Welcome back</div>
          <div className="teacher-hero__name">
            {user?.firstName || 'Teacher'} 🍎
          </div>
          <div className="teacher-hero__count">
            {students.length} student{students.length !== 1 ? 's' : ''} in your classroom
          </div>
        </div>
        
        {/* Profile Avatar Trigger Button */}
        <ProfileAvatar
          photo={profilePhoto}
          initial={userInitial}
          size={52}
          onClick={onShowPhotoModal}
          title="Edit profile photo"
          initialSize="1.25rem"
        />
      </div>

      {/* ── Student Roster Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {students.map((student) => {
          const stats = student.academic || {};
          const att = stats.attendance || {};
          const attRate = att.totalDays ? Math.round((att.present / att.totalDays) * 100) : 0;
          const levelInfo = getLevelInfo(stats.overallLevel || 0);

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className="student-card"
            >
              {/* Card Header: emoji, name, grade */}
              <div className="student-card__header">
                <div className="student-card__photo">
                  {student.photo}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="student-card__name">
                    {student.name?.split(' ')[0]}
                  </div>
                  <div className="student-card__grade">
                    {student.grade}
                  </div>
                </div>
              </div>
              
              {/* Card Stats: Overall Level & Attendance Rate */}
              <div className="student-card__stats">
                <div>
                  <div className="label-sm">Level</div>
                  <div 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: '0.9rem', 
                      color: levelInfo.color, 
                      marginTop: 2 
                    }}
                  >
                    {stats.overallLevel || '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="label-sm">Attend.</div>
                  <div 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: '0.9rem', 
                      color: attRate >= 90 ? '#16a34a' : attRate >= 80 ? '#ca8a04' : '#dc2626', 
                      marginTop: 2 
                    }}
                  >
                    {attRate}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ClassroomView.displayName = 'ClassroomView';

export default ClassroomView;
