import React from 'react';
import ProgressBar from '../shared/ProgressBar';
import { getLevelInfo } from '../../services/mockDataService';

/**
 * AcademicView Component
 * ──────────────────────
 * Renders the CBC strand assessments for the selected child.
 * Displays each strand with details (teacher, sub-strand) and visual level mapping.
 *
 * @param {Object} props
 * @param {Object} props.academicData - Performance object containing strands.
 */
const AcademicView = React.memo(({ academicData }) => {
  const strands = academicData?.strands || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <p className="section-title" style={{ fontSize: '1.15rem' }}>Strand Overview (CBC)</p>
      
      {/* Informational banner about CBC assessments */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '0.75rem', fontSize: '0.78rem', color: '#1d4ed8', lineHeight: 1.5, marginBottom: 4 }}>
        <strong>CBC Note:</strong> Learners are assessed on Levels 1–4. Under CBC, learners progress to the next grade regardless of level.
      </div>
      
      {/* Roster of academic strands */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.75rem' }}>
        {strands.map((strand, i) => {
          const info = getLevelInfo(strand.indicator);
          return (
            <div key={i} className="card" style={{ padding: '1.125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem' }}>{strand.name}</div>
                  {strand.subStrand && <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>{strand.subStrand}</div>}
                  {strand.teacher && <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 1 }}>{strand.teacher}</div>}
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, fontWeight: 900, fontSize: '1.2rem', background: info.bg, color: info.color }}>
                    {strand.indicator}
                  </span>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: info.color, marginTop: 2 }}>{info.label}</div>
                </div>
              </div>
              
              <ProgressBar pct={(strand.indicator / 4) * 100} color={info.color} />
            </div>
          );
        })}
      </div>
    </div>
  );
});

AcademicView.displayName = 'AcademicView';

export default AcademicView;
