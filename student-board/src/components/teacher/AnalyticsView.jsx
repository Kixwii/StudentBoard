import React from 'react';
import { TrendingUp, BookOpen } from 'lucide-react';
import ProgressBar from '../shared/ProgressBar';
import { getLevelInfo } from '../../services/mockDataService';

/**
 * AnalyticsView Component
 * ───────────────────────
 * Renders class-wide aggregated performance and attendance analytics.
 * Pure component calculating aggregates from students data via memoization:
 * - Average CBC Level (with target level info color formatting).
 * - Overall Attendance Rate.
 * - Per-Strand performance averages.
 *
 * @param {Object} props
 * @param {Array} props.students - Enriched student records list.
 */
const AnalyticsView = React.memo(({ students = [] }) => {
  // Aggregate statistics purely from the students list (no localStorage reading)
  const classStats = React.useMemo(() => {
    let totalLevel = 0;
    let totalPresent = 0;
    let totalDays = 0;
    const strandLevels = {};

    students.forEach((student) => {
      const stats = student.academic || {};
      totalLevel += parseFloat(stats.overallLevel || 0);

      const att = stats.attendance || { present: 0, totalDays: 0 };
      totalPresent += att.present || 0;
      totalDays += att.totalDays || 0;

      (stats.strands || []).forEach((s) => {
        if (!strandLevels[s.name]) {
          strandLevels[s.name] = { total: 0, count: 0 };
        }
        strandLevels[s.name] = {
          total: strandLevels[s.name].total + s.indicator,
          count: strandLevels[s.name].count + 1,
        };
      });
    });

    const avgLevel = students.length ? (totalLevel / students.length).toFixed(1) : '0';
    const attRate = totalDays ? Math.round((totalPresent / totalDays) * 100) : 0;

    const strandAverages = Object.keys(strandLevels).map((name) => {
      const s = strandLevels[name];
      const avg = s.count ? s.total / s.count : 0;
      return { name, avg: parseFloat(avg.toFixed(1)) };
    });

    return { avgLevel, attRate, strandAverages };
  }, [students]);

  const levelInfo = getLevelInfo(Math.round(parseFloat(classStats.avgLevel)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p className="section-title" style={{ fontSize: '1.15rem' }}>Class Analytics</p>

      {/* ── Key Metrics Overview ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {/* Avg CBC Level */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="label-sm">Avg CBC Level</div>
          <div 
            className="value-lg" 
            style={{ marginTop: 4, color: levelInfo.color }}
          >
            {classStats.avgLevel}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={12} /> Target: 3 (ME)
          </div>
        </div>

        {/* Overall Attendance */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="label-sm">Overall Attendance</div>
          <div className="value-lg" style={{ marginTop: 4 }}>
            {classStats.attRate}%
          </div>
          <div 
            style={{ 
              fontSize: '0.75rem', 
              color: classStats.attRate >= 90 ? '#16a34a' : '#ca8a04', 
              marginTop: 8 
            }}
          >
            {classStats.attRate >= 90 ? 'Excellent' : 'Needs attention'}
          </div>
        </div>
      </div>

      {/* ── Strand Performance Aggregations ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={16} color="#8b5cf6" />
          </div>
          <p className="section-title">Strand Averages</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {classStats.strandAverages.map((s, i) => {
            const strandLevelInfo = getLevelInfo(Math.round(s.avg));
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{s.name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: strandLevelInfo.color }}>
                    {s.avg} / 4
                  </span>
                </div>
                <ProgressBar pct={(s.avg / 4) * 100} color={strandLevelInfo.color} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

AnalyticsView.displayName = 'AnalyticsView';

export default AnalyticsView;
