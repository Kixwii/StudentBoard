import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, UserCheck, AlertCircle, Loader2, Home, BarChart3,
  Menu, X, ChevronRight, Edit3, Save, MessageSquare, GraduationCap,
  ArrowLeft, TrendingUp, HelpCircle, UserPlus,
} from 'lucide-react';
import {
  getAllStudents, getStudentAcademic, updateStudentAcademic, addStudent,
  CBC_LEVELS, getLevelInfo, ALL_GRADES,
} from './services/mockDataService';
import { useProfilePhoto } from './hooks/useProfilePhoto';
import ProfilePhotoModal from './components/ProfilePhotoModal';
import OnboardingGuide from './components/OnboardingGuide';

// ── shared style tokens ──────────────────────────────────────
const S = {
  card: {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: 20,
  },
  labelSm: { fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' },
  valueLg: { fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1 },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', margin: 0 },
};

const badgeStyle = (type = 'lime') => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '2px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
  ...(type === 'lime' ? { background: '#f7ffe0', color: '#4d7c0f', border: '1px solid #bef264' } :
    type === 'orange' ? { background: '#fff5ed', color: '#c2410c', border: '1px solid #fdba74' } :
      { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }),
});

const ProgressBar = ({ pct, color = '#a3e635' }) => (
  <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: color, borderRadius: 99, transition: 'width 0.6s' }} />
  </div>
);

// ── sidebar ──────────────────────────────────────────────────
const Sidebar = ({ open, onClose, navItems, activeTab, onNav, onLogout }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 30,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        width: 224,
        background: '#fff',
        borderRight: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s ease, box-shadow 0.3s ease',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        visibility: open ? 'visible' : 'hidden',
        boxShadow: open ? '4px 0 24px rgba(0,0,0,0.08)' : 'none',
      }}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={18} color="#a3e635" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a1a1a', whiteSpace: 'nowrap' }}>EduPortal</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Nav */}
          <nav style={{ padding: '0.875rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ ...S.labelSm, marginBottom: 8, paddingLeft: 4 }}>Navigation</div>
            {navItems.map(item => {
              const active = activeTab === item.id || (activeTab === 'studentDetail' && item.id === 'classroom');
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

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
          <button onClick={onLogout} className="nav-item" style={{ color: '#ef4444' }}>
            <UserCheck size={17} style={{ flexShrink: 0 }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// ── Input helper ────────────────────────────────────────────
const NumInput = ({ value, onChange, min = '0' }) => (
  <input
    type="number"
    min={min}
    value={value}
    onChange={onChange}
    style={{
      width: 64, padding: '0.375rem 0.5rem', border: '1.5px solid #e8e8e8', borderRadius: 8,
      fontSize: '0.875rem', fontWeight: 600, textAlign: 'center', outline: 'none',
      fontFamily: 'inherit', color: '#1a1a1a',
    }}
  />
);

// ── main component ───────────────────────────────────────────
const TeacherDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('classroom');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [academicData, setAcademicData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedStrands, setEditedStrands] = useState([]);
  const [editedAttendance, setEditedAttendance] = useState({ totalDays: 0, present: 0, absent: 0, late: 0 });
  const [editedBehavior, setEditedBehavior] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const { photo: profilePhoto, savePhoto, removePhoto } = useProfilePhoto(user?.username);

  useEffect(() => {
    const allStudents = getAllStudents();
    setStudents(allStudents);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const data = getStudentAcademic(selectedStudent.id);
      setAcademicData(data);
      setIsEditing(false);
      setEditedAttendance(data.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 });
      setEditedBehavior(data.behavioralAssessment || '');
      setEditedStrands((data.strands || []).map(s => ({ ...s })));
    }
  }, [selectedStudent, students]);

  const handleSave = () => {
    if (!selectedStudent || !academicData) return;
    const updatedStrands = editedStrands.map(s => {
      const ind = parseInt(s.indicator, 10) || 1;
      const info = getLevelInfo(ind);
      return { ...s, indicator: ind, descriptor: info.label };
    });
    const avg = updatedStrands.length > 0
      ? Math.round(updatedStrands.reduce((sum, s) => sum + s.indicator, 0) / updatedStrands.length)
      : 0;
    updateStudentAcademic(selectedStudent.id, {
      attendance: {
        totalDays: parseInt(editedAttendance.totalDays || 0, 10),
        present: parseInt(editedAttendance.present || 0, 10),
        absent: parseInt(editedAttendance.absent || 0, 10),
        late: parseInt(editedAttendance.late || 0, 10),
      },
      behavioralAssessment: editedBehavior,
      strands: updatedStrands,
      overallLevel: avg,
    });
    setIsEditing(false);
    setAcademicData(getStudentAcademic(selectedStudent.id));
  };

  const navItems = [
    { id: 'classroom', label: 'My Classroom', icon: Users },
    { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Controls', icon: UserPlus },
    { id: 'onboarding', label: 'Help & Onboarding', icon: HelpCircle },
  ];

  // ── Classroom view ───────────────────────────────────────
  const ClassroomView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Hero */}
      <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Welcome back</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            {user?.firstName || 'Teacher'} 🍎
          </div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            {students.length} student{students.length !== 1 ? 's' : ''} in your classroom
          </div>
        </div>
        {/* Profile avatar — tap to edit */}
        <button
          onClick={() => setShowPhotoModal(true)}
          title="Edit profile photo"
          style={{ width: 52, height: 52, borderRadius: 16, border: '2px solid rgba(255,255,255,0.15)', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        >
          {profilePhoto
            ? <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a3e635' }}>{(user?.firstName?.[0] || 'T').toUpperCase()}</span>
          }
        </button>
      </div>


      {/* Student cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {students.map(student => {
          const stats = getStudentAcademic(student.id);
          const att = stats.attendance || {};
          const attRate = att.totalDays ? Math.round((att.present / att.totalDays) * 100) : 0;
          return (
            <div
              key={student.id}
              onClick={() => { setSelectedStudent(student); setActiveTab('studentDetail'); }}
              style={{ ...S.card, padding: '1rem', cursor: 'pointer', transition: 'box-shadow 0.15s', userSelect: 'none' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  {student.photo}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.name?.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{student.grade}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                <div>
                  <div style={S.labelSm}>Level</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: getLevelInfo(stats.overallLevel || 0).color, marginTop: 2 }}>{stats.overallLevel || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={S.labelSm}>Attend.</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: attRate >= 90 ? '#16a34a' : attRate >= 80 ? '#ca8a04' : '#dc2626', marginTop: 2 }}>{attRate}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Student detail view ──────────────────────────────────
  const StudentDetailView = () => {
    if (!selectedStudent || !academicData) return null;
    const att = academicData.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 };
    const attendanceRate = att.totalDays > 0 ? Math.round((att.present / att.totalDays) * 100) : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Back + action row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setActiveTab('classroom')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280', fontFamily: 'inherit', padding: '0.375rem 0' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: '#f5f7fa', border: '1px solid #e8e8e8', borderRadius: 12, fontWeight: 600, fontSize: '0.82rem', color: '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Edit3 size={14} /> Edit Records
            </button>
          ) : (
            <button
              onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: '#a3e635', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.82rem', color: '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Save size={14} /> Save Changes
            </button>
          )}
        </div>

        {/* Student profile card */}
        <div style={{ ...S.card, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
            {selectedStudent.photo}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a' }}>{selectedStudent.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{selectedStudent.grade} · {selectedStudent.class} · ID: {selectedStudent.id}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={S.labelSm}>CBC Level</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: getLevelInfo(academicData.overallLevel || 0).color, lineHeight: 1.1 }}>{academicData.overallLevel || '—'}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: getLevelInfo(academicData.overallLevel || 0).color }}>{getLevelInfo(academicData.overallLevel || 0).short}</div>
          </div>
        </div>

        {/* Attendance panel */}
        <div style={{ ...S.card, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={16} color="#3b82f6" />
            </div>
            <p style={S.sectionTitle}>Attendance</p>
            {!isEditing && <span style={{ ...badgeStyle(attendanceRate >= 90 ? 'lime' : 'orange'), marginLeft: 'auto' }}>{attendanceRate}%</span>}
          </div>

          {isEditing ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { label: 'Total Days', key: 'totalDays' },
                { label: 'Present', key: 'present' },
                { label: 'Absent', key: 'absent' },
                { label: 'Late', key: 'late' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ ...S.labelSm, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input
                    type="number"
                    min="0"
                    value={editedAttendance[key]}
                    onChange={e => setEditedAttendance({ ...editedAttendance, [key]: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, outline: 'none', fontFamily: 'inherit', color: '#1a1a1a', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                { label: 'Total', value: att.totalDays, c: { bg: '#f5f7fa', text: '#1a1a1a' } },
                { label: 'Present', value: att.present, c: { bg: '#f0fdf4', text: '#16a34a' } },
                { label: 'Absent', value: att.absent, c: { bg: '#fef2f2', text: '#dc2626' } },
                { label: 'Late', value: att.late, c: { bg: '#fefce8', text: '#ca8a04' } },
              ].map(item => (
                <div key={item.label} style={{ borderRadius: 12, padding: '0.625rem 0.5rem', textAlign: 'center', background: item.c.bg, color: item.c.text }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.value}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Behavioral assessment */}
        <div style={{ ...S.card, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={16} color="#a855f7" />
            </div>
            <p style={S.sectionTitle}>Behavioral Assessment</p>
          </div>
          {isEditing ? (
            <textarea
              value={editedBehavior}
              onChange={e => setEditedBehavior(e.target.value)}
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

        {/* Strand Performance (CBC) */}
        <div style={{ ...S.card, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} color="#8b5cf6" />
            </div>
            <p style={S.sectionTitle}>Strand Performance</p>
          </div>
          {(isEditing ? editedStrands : (academicData.strands || [])).length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>No strands recorded yet.</div>
          )}
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
                        onChange={e => {
                          const updated = [...editedStrands];
                          updated[index] = { ...updated[index], indicator: parseInt(e.target.value, 10) };
                          setEditedStrands(updated);
                        }}
                        style={{ padding: '0.375rem 0.5rem', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', cursor: 'pointer' }}
                      >
                        {CBC_LEVELS.map(l => (
                          <option key={l.value} value={l.value}>{l.value} — {l.short}</option>
                        ))}
                      </select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, fontWeight: 800, fontSize: '0.85rem', background: info.bg, color: info.color }}>
                          {strand.indicator}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: info.color }}>{info.short}</span>
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
  };

  // ── Analytics view ────────────────────────────────────────
  const AnalyticsView = () => {
    const classStats = React.useMemo(() => {
      let totalLevel = 0;
      let totalPresent = 0;
      let totalDays = 0;
      let strandLevels = {};

      students.forEach(student => {
        const stats = getStudentAcademic(student.id);
        totalLevel += parseFloat(stats.overallLevel || 0);

        const att = stats.attendance || { present: 0, totalDays: 0 };
        totalPresent += att.present;
        totalDays += att.totalDays;

        (stats.strands || []).forEach(s => {
          if (!strandLevels[s.name]) strandLevels[s.name] = { total: 0, count: 0 };
          strandLevels[s.name].total += s.indicator;
          strandLevels[s.name].count += 1;
        });
      });

      const avgLevel = students.length ? (totalLevel / students.length).toFixed(1) : 0;
      const attRate = totalDays ? Math.round((totalPresent / totalDays) * 100) : 0;

      const strandAverages = Object.keys(strandLevels).map(name => {
        const s = strandLevels[name];
        const avg = s.count ? (s.total / s.count) : 0;
        return { name, avg: parseFloat(avg.toFixed(1)) };
      });

      return { avgLevel, attRate, strandAverages };
    }, [students]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ ...S.sectionTitle, fontSize: '1.15rem' }}>Class Analytics</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <div style={{ ...S.card, padding: '1.25rem' }}>
            <div style={S.labelSm}>Avg CBC Level</div>
            <div style={{ ...S.valueLg, marginTop: 4, color: getLevelInfo(Math.round(classStats.avgLevel)).color }}>{classStats.avgLevel}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} /> Target: 3 (ME)
            </div>
          </div>
          <div style={{ ...S.card, padding: '1.25rem' }}>
            <div style={S.labelSm}>Overall Attendance</div>
            <div style={{ ...S.valueLg, marginTop: 4 }}>{classStats.attRate}%</div>
            <div style={{ fontSize: '0.75rem', color: classStats.attRate >= 90 ? '#16a34a' : '#ca8a04', marginTop: 8 }}>
              {classStats.attRate >= 90 ? 'Excellent' : 'Needs attention'}
            </div>
          </div>
        </div>

        <div style={{ ...S.card, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} color="#8b5cf6" />
            </div>
            <p style={S.sectionTitle}>Strand Averages</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {classStats.strandAverages.map((s, i) => {
              const info = getLevelInfo(Math.round(s.avg));
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{s.name}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: info.color }}>{s.avg} / 4</span>
                  </div>
                  <ProgressBar pct={(s.avg / 4) * 100} color={info.color} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── Admin Controls view ──────────────────────────────────
  const AdminControlsView = () => {
    const [formData, setFormData] = useState({
      name: '',
      grade: '',
      class: '',
      guardianId: '',
      photo: '👤'
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddStudent = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.grade || !formData.class || !formData.guardianId) {
        return;
      }
      
      const newStudent = addStudent(formData);
      
      // Update local state to reflect new student
      setStudents(getAllStudents());
      
      setSuccessMessage(`Successfully added student ${newStudent.name} (ID: ${newStudent.id})`);
      setFormData({ name: '', grade: '', class: '', guardianId: '', photo: '👤' });
      
      setTimeout(() => setSuccessMessage(''), 4000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ ...S.sectionTitle, fontSize: '1.15rem' }}>Admin Controls</p>
        
        <div style={{ ...S.card, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={16} color="#3b82f6" />
            </div>
            <p style={S.sectionTitle}>Add New Student</p>
          </div>

          {successMessage && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#166534' }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ ...S.labelSm, display: 'block', marginBottom: 6 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ ...S.labelSm, display: 'block', marginBottom: 6 }}>Unique Parent ID</label>
                <input
                  type="text"
                  required
                  value={formData.guardianId}
                  onChange={(e) => setFormData({ ...formData, guardianId: e.target.value })}
                  placeholder="e.g. cGFyZW50..."
                  style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ ...S.labelSm, display: 'block', marginBottom: 6 }}>Grade</label>
                <input
                  type="text"
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g. Grade 5"
                  style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ ...S.labelSm, display: 'block', marginBottom: 6 }}>Class</label>
                <input
                  type="text"
                  required
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="e.g. 5A"
                  style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ ...S.labelSm, display: 'block', marginBottom: 6 }}>Profile Emoji</label>
                <select
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="👤">👤</option>
                  <option value="👦🏿">👦🏿</option>
                  <option value="👧🏿">👧🏿</option>
                  <option value="👱‍♀️">👱‍♀️</option>
                  <option value="👨‍🦱">👨‍🦱</option>
                  <option value="👩🏽">👩🏽</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem', padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none',
                borderRadius: 12, fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Add Student
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'classroom': return <ClassroomView />;
      case 'studentDetail': return StudentDetailView();
      case 'analytics': return <AnalyticsView />;
      case 'admin': return <AdminControlsView />;
      case 'onboarding': return <OnboardingGuide />;
      default: return <ClassroomView />;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite', width: 36, height: 36, color: '#1a1a1a' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        activeTab={activeTab}
        onNav={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main area */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(245,247,250,0.9)', backdropFilter: 'blur(8px)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #e8e8e8' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <Menu size={18} color="#1a1a1a" />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeTab === 'studentDetail' ? selectedStudent?.name?.split(' ')[0] : navItems.find(n => n.id === activeTab)?.label || 'Classroom'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {/* Clickable profile avatar */}
            <button
              onClick={() => setShowPhotoModal(true)}
              title="Edit profile photo"
              style={{ width: 34, height: 34, borderRadius: 10, border: '2px solid #e8e8e8', overflow: 'hidden', cursor: 'pointer', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            >
              {profilePhoto
                ? <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a3e635' }}>{(user?.firstName?.[0] || 'T').toUpperCase()}</span>
              }
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
          {renderContent()}
        </div>
      </div>

      {/* Profile photo modal */}
      {showPhotoModal && (
        <ProfilePhotoModal
          currentPhoto={profilePhoto}
          userName={user?.firstName || user?.username}
          onSave={savePhoto}
          onRemove={removePhoto}
          onClose={() => setShowPhotoModal(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
