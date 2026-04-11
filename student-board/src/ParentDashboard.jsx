import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, DollarSign, FileText, Download, Bell, LogOut,
  AlertCircle, Loader2, CreditCard, CheckCircle, Home, BarChart3,
  Menu, X, ChevronRight, TrendingUp, Calendar, Award, Clock,
  MessageSquare, GraduationCap, ArrowUpRight,
} from 'lucide-react';

import { guardianService } from './services/guardianService';
import { feeService } from './services/feeService';
import { documentService } from './services/documentService';
import { useProfilePhoto } from './hooks/useProfilePhoto';
import ProfilePhotoModal from './components/ProfilePhotoModal';

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

// ── mini stat card ───────────────────────────────────────────
const StatCard = ({ label, value, badge, badgeType, sub, icon: Icon, iconBg }) => (
  <div style={{ ...S.card, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={iconBg ? '#1a1a1a' : '#6b7280'} />
      </div>
      {badge && <span style={badgeStyle(badgeType)}>{badge}</span>}
    </div>
    <div>
      <div style={S.labelSm}>{label}</div>
      <div style={S.valueLg}>{value}</div>
    </div>
    {sub && <div style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>{sub}</div>}
  </div>
);

// ── progress bar ─────────────────────────────────────────────
const ProgressBar = ({ pct, color = '#a3e635' }) => (
  <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: color, borderRadius: 99, transition: 'width 0.6s' }} />
  </div>
);

// ── sidebar ──────────────────────────────────────────────────
const Sidebar = ({ open, onClose, onToggle, navItems, activeTab, onNav, children: childList, selectedChild, onSelectChild, onLogout }) => {
  const sidebarW = open ? 224 : 0;

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
        className="sm-hidden"
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
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a1a1a' }}>EduPortal</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Children */}
          {childList.length > 0 && (
            <div style={{ padding: '0.875rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ ...S.labelSm, marginBottom: 8, paddingLeft: 4 }}>My Children</div>
              {childList.map((child, i) => (
                <button
                  key={i}
                  onClick={() => { onSelectChild(i); onClose(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0.625rem 0.75rem',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: 4,
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    background: selectedChild === i ? '#f5f7fa' : 'transparent',
                    outline: selectedChild === i ? '2px solid #e8e8e8' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{child.photo}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{child.name?.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{child.grade}</div>
                  </div>
                  {selectedChild === i && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: 99, background: '#a3e635', flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          )}

          {/* Nav */}
          <nav style={{ padding: '0.875rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ ...S.labelSm, marginBottom: 8, paddingLeft: 4 }}>Navigation</div>
            {navItems.map(item => {
              const active = activeTab === item.id;
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
          <button
            onClick={onLogout}
            className="nav-item"
            style={{ color: '#ef4444' }}
          >
            <LogOut size={17} style={{ flexShrink: 0 }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// ── main component ───────────────────────────────────────────
const ParentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChild, setSelectedChild] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [children, setChildren] = useState([]);
  const [academicData, setAcademicData] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const { photo: profilePhoto, savePhoto, removePhoto } = useProfilePhoto(user?.username);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user?.guardianId) return;
      try {
        const studentsData = await guardianService.getStudents(user.guardianId);
        if (studentsData?.length > 0) setChildren(studentsData);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('API Error fetching children:', err);
        setError('Could not load children data');
        setLoading(false);
      }
    };
    fetchChildren();
  }, [user?.guardianId]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!children[selectedChild]) return;
      const studentId = children[selectedChild].id || children[selectedChild].studentId;
      setLoading(true);
      try {
        const [performance, feeAccount, transactions, docs] = await Promise.all([
          guardianService.getStudentPerformance(user.guardianId, studentId),
          feeService.getAccount(studentId),
          feeService.getTransactions(studentId),
          documentService.getDocuments(studentId),
        ]);
        if (performance) setAcademicData(performance);
        if (feeAccount) setFeeData({ ...feeAccount, paymentHistory: transactions || [] });
        if (docs) setDocuments(docs);
        setError(null);
      } catch (err) {
        console.error('API Error fetching student detail:', err);
        setError('Could not load full student details');
      } finally {
        setLoading(false);
      }
    };
    if (children.length > 0) fetchStudentData();
  }, [children, selectedChild, user?.guardianId]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'fees', label: 'Payments', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const getAttendanceRate = (att) => {
    if (!att || !att.totalDays) return 0;
    return Math.round((att.present / att.totalDays) * 100);
  };

  // ── Dashboard view ───────────────────────────────────────
  const DashboardView = () => {
    const att = academicData?.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 };
    const attRate = getAttendanceRate(att);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header greeting */}
        <div style={{ ...S.card, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={S.labelSm}>Welcome back</div>
            <h1 style={{ ...S.valueLg, fontSize: '1.35rem', marginTop: 2 }}>
              {user?.firstName || 'Parent'} 👋
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: 4 }}>
              Viewing {children[selectedChild]?.name?.split(' ')[0]}'s progress
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f5f7fa', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#6b7280" />
            </div>
            {/* Profile photo — clickable to open modal */}
            <button
              onClick={() => setShowPhotoModal(true)}
              title="Edit profile photo"
              style={{ width: 44, height: 44, borderRadius: 14, border: '2px solid #e8e8e8', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            >
              {profilePhoto
                ? <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#a3e635' }}>{(user?.firstName?.[0] || 'P').toUpperCase()}</span>
              }
            </button>
          </div>
        </div>

        {/* Stat cards – 2 col on mobile, 4 on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <StatCard
            label="Current GPA"
            value={academicData?.currentGPA || '—'}
            badge={academicData?.currentGPA >= 3.0 ? 'High' : 'Avg'}
            badgeType={academicData?.currentGPA >= 3.0 ? 'lime' : 'orange'}
            icon={Award}
            iconBg="#f0fdf4"
            sub={<><TrendingUp size={11} /> Overall performance</>}
          />
          <StatCard
            label="Attendance"
            value={`${attRate}%`}
            badge={attRate >= 90 ? 'High' : 'Watch'}
            badgeType={attRate >= 90 ? 'lime' : 'orange'}
            icon={Calendar}
            iconBg="#f0fdf4"
            sub={<><Clock size={11} /> This semester</>}
          />
          <StatCard
            label="Balance Due"
            value={`$${feeData?.currentBalance?.toFixed(0) || '0'}`}
            badge="Due"
            badgeType="orange"
            icon={DollarSign}
            iconBg="#fff5ed"
            sub={<><Calendar size={11} /> {feeData?.dueDate || 'N/A'}</>}
          />
          <StatCard
            label="Documents"
            value={documents?.length || 0}
            badge="View"
            badgeType="blue"
            icon={FileText}
            iconBg="#eff6ff"
            sub={<><Download size={11} /> Available</>}
          />
        </div>

        {/* Attendance breakdown */}
        <div style={{ ...S.card, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={S.sectionTitle}>Attendance Details</p>
            <span style={badgeStyle(attRate >= 90 ? 'lime' : 'orange')}>{attRate}% rate</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { label: 'Total', value: att.totalDays, style: { background: '#f5f7fa', color: '#1a1a1a' } },
              { label: 'Present', value: att.present, style: { background: '#f0fdf4', color: '#16a34a' } },
              { label: 'Absent', value: att.absent, style: { background: '#fef2f2', color: '#dc2626' } },
              { label: 'Late', value: att.late, style: { background: '#fefce8', color: '#ca8a04' } },
            ].map(item => (
              <div key={item.label} style={{ borderRadius: 12, padding: '0.625rem 0.5rem', textAlign: 'center', ...item.style }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.value}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject performance */}
        <div style={{ ...S.card, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={S.sectionTitle}>Subject Performance</p>
            <button onClick={() => setActiveTab('academic')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowUpRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {academicData?.subjects?.slice(0, 4).map((subject, i) => {
              const pct = subject.maxScore ? (subject.score / subject.maxScore) * 100 : 0;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{subject.name}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a' }}>
                      {subject.score}<span style={{ color: '#9ca3af', fontWeight: 400 }}>/{subject.maxScore}</span>
                    </span>
                  </div>
                  <ProgressBar pct={pct} color={pct >= 80 ? '#a3e635' : pct >= 60 ? '#fb923c' : '#ef4444'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavioral assessment */}
        <div style={{ ...S.card, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={16} color="#a855f7" />
            </div>
            <p style={S.sectionTitle}>Behaviour & Conduct</p>
          </div>
          <div style={{ background: '#f5f7fa', borderRadius: 12, padding: '0.875rem', fontSize: '0.85rem', color: '#374151', fontStyle: 'italic', lineHeight: 1.6 }}>
            "{academicData?.behavioralAssessment || 'No notes to display.'}"
          </div>
        </div>

        {/* Recent assignments */}
        {academicData?.recentAssignments?.length > 0 && (
          <div style={{ ...S.card, padding: '1.25rem' }}>
            <p style={{ ...S.sectionTitle, marginBottom: '1rem' }}>Recent Assignments</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {academicData.recentAssignments.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', background: '#f5f7fa', borderRadius: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={16} color="#3b82f6" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.83rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.assignment}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{a.subject}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#16a34a' }}>{a.score}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Academic view ────────────────────────────────────────
  const AcademicView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <p style={{ ...S.sectionTitle, fontSize: '1.15rem' }}>Academic Overview</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.75rem' }}>
        {academicData?.subjects?.map((subject, i) => {
          const pct = subject.maxScore ? (subject.score / subject.maxScore) * 100 : 0;
          const grade = subject.grade || (pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : 'D');
          return (
            <div key={i} style={{ ...S.card, padding: '1.125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem' }}>{subject.name}</div>
                  {subject.teacher && <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>{subject.teacher}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a' }}>{grade}</span>
                </div>
              </div>
              <ProgressBar pct={pct} color={pct >= 80 ? '#a3e635' : pct >= 60 ? '#fb923c' : '#ef4444'} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{subject.score} / {subject.maxScore}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: pct >= 80 ? '#4d7c0f' : '#c2410c' }}>{pct.toFixed(0)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Fees view ────────────────────────────────────────────
  const FeesView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Balance hero card */}
      <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '1.5rem', color: '#fff' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Current Balance</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 6 }}>${feeData?.currentBalance?.toFixed(2) || '0.00'}</div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>Due: {feeData?.dueDate || 'N/A'}</div>
        {feeData?.currentBalance > 0 && (
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '0.625rem 1rem',
            background: '#a3e635', color: '#1a1a1a', border: 'none', borderRadius: 12,
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <CreditCard size={16} /> Make Payment
          </button>
        )}
      </div>

      {/* Breakdown */}
      <div style={{ ...S.card, padding: '1.25rem' }}>
        <p style={{ ...S.sectionTitle, marginBottom: '0.875rem' }}>Fee Breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {feeData?.breakdown?.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f5f7fa', borderRadius: 12 }}>
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{item.category}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a1a1a' }}>${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment history */}
      <div style={{ ...S.card, padding: '1.25rem' }}>
        <p style={{ ...S.sectionTitle, marginBottom: '0.875rem' }}>Payment History</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {feeData?.paymentHistory?.map((payment, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', background: '#f0fdf4', borderRadius: 12, borderLeft: '3px solid #a3e635' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>{payment.description}</div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>{payment.date} · {payment.method}</div>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.875rem' }}>-${payment.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Documents view ───────────────────────────────────────
  const DocumentsView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <p style={{ ...S.sectionTitle, fontSize: '1.15rem' }}>Available Documents</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.75rem' }}>
        {documents?.map((doc, i) => (
          <div key={i} style={{ ...S.card, padding: '1.125rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} color="#3b82f6" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>Updated: {doc.updated}</div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.875rem', background: '#f5f7fa', border: '1px solid #e8e8e8', borderRadius: 10, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#374151', flexShrink: 0, fontFamily: 'inherit' }}>
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'academic': return <AcademicView />;
      case 'fees': return <FeesView />;
      case 'documents': return <DocumentsView />;
      default: return <DashboardView />;
    }
  };

  if (loading && children.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ animation: 'spin 1s linear infinite', width: 40, height: 40, color: '#1a1a1a', margin: '0 auto 12px' }} />
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(o => !o)}
        navItems={navItems}
        activeTab={activeTab}
        onNav={setActiveTab}
        children={children}
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
        onLogout={onLogout}
      />

      {/* Main scroll area */}
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
              {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </div>
          </div>
          {/* Clickable avatar */}
          <button
            onClick={() => setShowPhotoModal(true)}
            title="Edit profile photo"
            style={{ width: 36, height: 36, borderRadius: 12, border: '2px solid #e8e8e8', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
          >
            {profilePhoto
              ? <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a3e635' }}>{(user?.firstName?.[0] || 'P').toUpperCase()}</span>
            }
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
          {error && (
            <div style={{ marginBottom: '0.875rem', padding: '0.75rem 1rem', background: '#fefce8', border: '1px solid #fde047', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#854d0e' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error} – Using demo data
            </div>
          )}
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

export default ParentDashboard;
