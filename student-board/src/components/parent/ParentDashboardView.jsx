import React from 'react';
import {
  Bell, Award, Calendar, DollarSign, FileText,
  TrendingUp, Clock, Download, ArrowUpRight, MessageSquare, BookOpen
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import AttendanceGrid from '../shared/AttendanceGrid';
import ProgressBar from '../shared/ProgressBar';
import ProfileAvatar from '../shared/ProfileAvatar';
import { getLevelInfo } from '../../services/mockDataService';
import { getAttendanceRate } from '../../utils/attendance';

/**
 * ParentDashboardView Component
 * ─────────────────────────────
 * Renders the primary summary tab of the parent dashboard.
 * Pure component mapping visual sub-modules:
 * - Welcome greeting with profile avatar.
 * - Key metrics overview (CBC Level, Attendance %, Balance Due, Available Docs).
 * - Detailed attendance counts.
 * - Quick preview of top CBC strand performances.
 * - Behavioral assessment notes from teachers.
 * - Recent assignments list.
 *
 * @param {Object} props
 * @param {Object} props.user - Logged-in parent user details.
 * @param {number} props.selectedChild - Index of the selected child.
 * @param {Array} props.children - Array of children details.
 * @param {Object} props.academicData - Academic record of the selected child.
 * @param {Object} props.feeData - Financial accounts of the selected child.
 * @param {Array} props.documents - Array of available files.
 * @param {string|null} props.profilePhoto - Avatar image data URL or null.
 * @param {Function} props.onShowPhotoModal - Callback to trigger the photo modal.
 * @param {Function} props.onNavigateToAcademic - Callback to switch active tab to 'academic'.
 */
const ParentDashboardView = React.memo(({
  user,
  selectedChild,
  children = [],
  academicData,
  feeData,
  documents = [],
  profilePhoto,
  onShowPhotoModal,
  onNavigateToAcademic,
}) => {
  const activeChild = children[selectedChild] || {};
  const attendance = academicData?.attendance || { totalDays: 0, present: 0, absent: 0, late: 0 };
  const attRate = getAttendanceRate(attendance);
  const userInitial = (user?.firstName?.[0] || 'P').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* ── Greeting Header ── */}
      <div className="card greeting-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div className="label-sm">Welcome back</div>
          <h1 className="value-lg" style={{ fontSize: '1.35rem', marginTop: 2 }}>
            {user?.firstName || 'Parent'} 👋
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: 4 }}>
            Viewing {activeChild.name?.split(' ')[0]}'s progress
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
          {/* Notification bell */}
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f5f7fa', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Bell size={18} color="#6b7280" />
          </div>
          
          {/* Profile Photo Avatar */}
          <ProfileAvatar
            photo={profilePhoto}
            initial={userInitial}
            size={44}
            onClick={onShowPhotoModal}
            title="Edit profile photo"
            initialSize="0.85rem"
          />
        </div>
      </div>

      {/* ── Stat Cards Grid (4 Columns on Desktop, 2 Columns on Mobile) ── */}
      <div className="stat-cards-grid">
        <StatCard
          label="CBC Level"
          value={academicData?.overallLevel || '—'}
          badge={academicData?.overallLevel ? getLevelInfo(academicData.overallLevel).short : '—'}
          badgeType={academicData?.overallLevel >= 3 ? 'lime' : 'orange'}
          icon={Award}
          iconBg="#f0fdf4"
          sub={<><TrendingUp size={11} /> {getLevelInfo(academicData?.overallLevel || 0).label}</>}
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

      {/* ── Attendance Details Grid ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <p className="section-title">Attendance Details</p>
          <span className={`badge ${attRate >= 90 ? 'badge-lime' : 'badge-orange'}`}>
            {attRate}% rate
          </span>
        </div>
        
        {/* Render pure component for attendance counts */}
        <AttendanceGrid attendance={attendance} />
      </div>

      {/* ── CBC Strand Performance Preview ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <p className="section-title">Strand Performance</p>
          <button 
            onClick={onNavigateToAcademic} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}
          >
            View all <ArrowUpRight size={13} />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {(academicData?.strands || []).slice(0, 4).map((strand, i) => {
            const info = getLevelInfo(strand.indicator);
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{strand.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, fontWeight: 800, fontSize: '0.78rem', background: info.bg, color: info.color }}>
                      {strand.indicator}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: info.color }}>{info.short}</span>
                  </div>
                </div>
                <ProgressBar pct={(strand.indicator / 4) * 100} color={info.color} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Behavioral Conduct assessment ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={16} color="#a855f7" />
          </div>
          <p className="section-title">Behaviour & Conduct</p>
        </div>
        <div style={{ background: '#f5f7fa', borderRadius: 12, padding: '0.875rem', fontSize: '0.85rem', color: '#374151', fontStyle: 'italic', lineHeight: 1.6 }}>
          "{academicData?.behavioralAssessment || 'No notes to display.'}"
        </div>
      </div>

      {/* ── Recent Assignments list ── */}
      {academicData?.recentAssignments?.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <p className="section-title" style={{ marginBottom: '1rem' }}>Recent Assignments</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {academicData.recentAssignments.map((a, i) => {
              const info = getLevelInfo(a.indicator || 3);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', background: '#f5f7fa', borderRadius: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={16} color="#3b82f6" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.83rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.title || a.assignment}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{a.strand || a.subject}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 8, fontWeight: 800, fontSize: '0.8rem', background: info.bg, color: info.color }}>
                      {a.indicator}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2 }}>{a.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

ParentDashboardView.displayName = 'ParentDashboardView';

export default ParentDashboardView;
