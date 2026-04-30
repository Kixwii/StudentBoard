import React from 'react';
import { X, Printer } from 'lucide-react';
import { getLevelInfo, getEducationLevel } from '../services/mockDataService';

/**
 * ReportCardModal — displays a printable report card for a student.
 *
 * Props:
 *   student      {object}  – { id, name, grade, class, photo }
 *   reportCard   {object}  – { term, generatedDate, strands, overallIndicator, attendance, teacherComments }
 *   onClose      {fn()}
 */
const ReportCardModal = ({ student, reportCard, onClose }) => {
  const overallInfo = getLevelInfo(reportCard.overallIndicator);
  const eduLevel = getEducationLevel(student.grade);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media print {
          .report-no-print { display: none !important; }
          .report-print-area {
            position: fixed !important;
            inset: 0 !important;
            z-index: 9999 !important;
            background: #fff !important;
            border-radius: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            box-shadow: none !important;
            padding: 2rem !important;
          }
        }
      `}</style>

      <div
        onClick={onClose}
        className="report-no-print"
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          className="report-print-area"
          style={{
            background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 520,
            maxHeight: '90vh', overflowY: 'auto', position: 'relative',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
            padding: '1.5rem 1.25rem 2rem',
          }}
        >
          {/* Close + Print */}
          <div className="report-no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem',
                background: '#1a1a1a', border: 'none', borderRadius: 12,
                fontWeight: 700, fontSize: '0.82rem', color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={onClose}
              aria-label="Close report card"
              style={{
                background: '#f5f7fa', border: 'none', borderRadius: 10, width: 32, height: 32,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* School header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem', borderBottom: '2px solid #1a1a1a', paddingBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Republic of Kenya — Ministry of Education
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a1a1a', margin: '0.5rem 0 0.25rem' }}>
              EduPortal Academy
            </h1>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>
              Competency Based Curriculum — Learner Progress Report
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 4 }}>{reportCard.term}</div>
          </div>

          {/* Student info grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
            background: '#f5f7fa', borderRadius: 14, padding: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem',
          }}>
            <div><span style={{ color: '#9ca3af', fontWeight: 600 }}>Learner:</span> <strong>{student.name}</strong></div>
            <div><span style={{ color: '#9ca3af', fontWeight: 600 }}>Adm No:</span> <strong>{student.id}</strong></div>
            <div><span style={{ color: '#9ca3af', fontWeight: 600 }}>Grade:</span> <strong>{student.grade}</strong></div>
            <div><span style={{ color: '#9ca3af', fontWeight: 600 }}>Class:</span> <strong>{student.class}</strong></div>
            <div><span style={{ color: '#9ca3af', fontWeight: 600 }}>Level:</span> <strong>{eduLevel}</strong></div>
            <div><span style={{ color: '#9ca3af', fontWeight: 600 }}>Date:</span> <strong>{reportCard.generatedDate}</strong></div>
          </div>

          {/* CBC Levels Legend */}
          <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { l: 4, t: 'EE – Exceeding', c: '#16a34a', bg: '#f0fdf4' },
              { l: 3, t: 'ME – Meeting',    c: '#2563eb', bg: '#eff6ff' },
              { l: 2, t: 'AE – Approaching', c: '#ca8a04', bg: '#fefce8' },
              { l: 1, t: 'BE – Below',       c: '#dc2626', bg: '#fef2f2' },
            ].map(item => (
              <span key={item.l} style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px',
                borderRadius: 99, background: item.bg, color: item.c,
              }}>
                {item.t}
              </span>
            ))}
          </div>

          {/* Strands table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                  <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', borderRadius: '10px 0 0 0', fontWeight: 700 }}>Learning Area</th>
                  <th style={{ padding: '0.625rem 0.75rem', textAlign: 'center', fontWeight: 700 }}>Level</th>
                  <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', borderRadius: '0 10px 0 0', fontWeight: 700 }}>Descriptor</th>
                </tr>
              </thead>
              <tbody>
                {reportCard.strands.map((strand, i) => {
                  const info = getLevelInfo(strand.indicator);
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.625rem 0.75rem', fontWeight: 600 }}>{strand.name}</td>
                      <td style={{ padding: '0.625rem 0.75rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', width: 28, height: 28, lineHeight: '28px',
                          borderRadius: 8, fontWeight: 800, fontSize: '0.85rem',
                          background: info.bg, color: info.color, textAlign: 'center',
                        }}>
                          {strand.indicator}
                        </span>
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', color: info.color, fontWeight: 600 }}>{strand.descriptor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Overall + Attendance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: overallInfo.bg, borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Overall Level</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: overallInfo.color }}>{reportCard.overallIndicator}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: overallInfo.color }}>{overallInfo.label}</div>
            </div>
            <div style={{ background: '#f5f7fa', borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Attendance</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1a1a1a' }}>
                {reportCard.attendance?.totalDays ? Math.round((reportCard.attendance.present / reportCard.attendance.totalDays) * 100) : 0}%
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>
                {reportCard.attendance?.present || 0} / {reportCard.attendance?.totalDays || 0} days
              </div>
            </div>
          </div>

          {/* Teacher comments */}
          <div style={{ background: '#f5f7fa', borderRadius: 14, padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Teacher's Comments
            </div>
            <p style={{ fontSize: '0.85rem', color: '#374151', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
              "{reportCard.teacherComments || 'No comments provided.'}"
            </p>
          </div>

          {/* CBC no-repeat notice */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '0.75rem', fontSize: '0.75rem', color: '#1d4ed8', lineHeight: 1.5 }}>
            <strong>Note:</strong> Under CBC, learners progress to the next grade regardless of performance level. Support plans are provided for learners at Levels 1–2.
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportCardModal;
