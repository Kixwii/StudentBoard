import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { CBC_LEVELS, getLevelInfo } from '../services/mockDataService';

/**
 * UploadResultsModal — lets teacher assign CBC levels (1-4) per student
 * for a given assignment.
 *
 * Props:
 *   assignment   {object}   – the assignment being graded
 *   students     {array}    – students to grade (filtered by class)
 *   existingResults {object} – { studentId: { indicator, feedback } }
 *   onSave       {fn(results)} – called with { studentId: { indicator, feedback } }
 *   onClose      {fn()}
 *   saving       {boolean}  – disables save button when true
 */
const UploadResultsModal = ({ assignment, students, existingResults = {}, onSave, onClose, saving }) => {
  const [results, setResults] = useState(() => {
    const initial = {};
    students.forEach(s => {
      const existing = existingResults[s.id];
      initial[s.id] = {
        indicator: existing?.indicator || 3,
        feedback: existing?.feedback || '',
      };
    });
    return initial;
  });

  const updateResult = (studentId, field, value) => {
    setResults(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSave = () => {
    onSave(results);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 520,
            maxHeight: '85vh', display: 'flex', flexDirection: 'column',
            position: 'relative', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
          `}</style>

          {/* Header */}
          <div style={{ padding: '1.25rem 1.25rem 0.75rem', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Upload Results</h2>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '4px 0 0' }}>{assignment.title} · {assignment.strand}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{ background: '#f5f7fa', border: 'none', borderRadius: 10, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable student list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {students.map(student => {
                const result = results[student.id] || { indicator: 3, feedback: '' };
                const levelInfo = getLevelInfo(result.indicator);
                return (
                  <div key={student.id} style={{ background: '#f5f7fa', borderRadius: 14, padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{student.photo}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>{student.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{student.id}</div>
                      </div>
                    </div>

                    {/* Level selector */}
                    <div style={{ marginBottom: '0.625rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                        CBC Level
                      </label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {CBC_LEVELS.map(level => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => updateResult(student.id, 'indicator', level.value)}
                            style={{
                              flex: 1, padding: '0.5rem 0.25rem', borderRadius: 10, border: 'none',
                              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.78rem',
                              background: result.indicator === level.value ? levelInfo.bg : '#fff',
                              color: result.indicator === level.value ? levelInfo.color : '#9ca3af',
                              outline: result.indicator === level.value ? `2px solid ${levelInfo.color}` : '1px solid #e8e8e8',
                              transition: 'all 0.15s',
                            }}
                          >
                            {level.value}
                            <div style={{ fontSize: '0.6rem', fontWeight: 500, marginTop: 2 }}>{level.short}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                        Feedback (optional)
                      </label>
                      <input
                        type="text"
                        value={result.feedback}
                        onChange={e => updateResult(student.id, 'feedback', e.target.value)}
                        placeholder="Brief feedback…"
                        style={{
                          width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #e8e8e8',
                          borderRadius: 10, fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit',
                          color: '#374151', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 14, border: 'none',
                background: saving ? '#f3f4f6' : '#1a1a1a', color: saving ? '#9ca3af' : '#fff',
                fontWeight: 700, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
              {saving ? 'Saving…' : 'Save Results'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadResultsModal;
