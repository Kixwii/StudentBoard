import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { addStudent } from '../../services/mockDataService';

/**
 * AdminControlsView Component
 * ───────────────────────────
 * Provides an administrative interface to register a new student.
 * Local form states are managed here, preventing unstable state resets.
 * On success, calls `onStudentAdded` to reload teacher roster.
 *
 * @param {Object} props
 * @param {Function} props.onStudentAdded - Callback triggered after student is successfully saved.
 */
const AdminControlsView = React.memo(({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    class: '',
    guardianId: '',
    photo: '👤',
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Submit handler to save student details to the mock database
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.grade || !formData.class || !formData.guardianId) {
      return;
    }

    const newStudent = addStudent(formData);

    // Alert the parent container to reload students list
    if (onStudentAdded) {
      onStudentAdded(newStudent);
    }

    setSuccessMessage(`Successfully added student ${newStudent.name} (ID: ${newStudent.id})`);
    setFormData({ name: '', grade: '', class: '', guardianId: '', photo: '👤' });

    // Auto-clear success banner after delay
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p className="section-title" style={{ fontSize: '1.15rem' }}>Admin Controls</p>
      
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={16} color="#3b82f6" />
          </div>
          <p className="section-title">Add New Student</p>
        </div>

        {/* Success message banner */}
        {successMessage && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#166534' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {/* Full Name */}
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jane Doe"
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            
            {/* Guardian ID */}
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 6 }}>Unique Parent ID</label>
              <input
                type="text"
                required
                value={formData.guardianId}
                onChange={(e) => setFormData({ ...formData, guardianId: e.target.value })}
                placeholder="e.g. cGFyZW50..."
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Grade */}
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 6 }}>Grade</label>
              <input
                type="text"
                required
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g. Grade 5"
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Class section */}
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 6 }}>Class</label>
              <input
                type="text"
                required
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="e.g. 5A"
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Avatar Emoji select */}
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 6 }}>Profile Emoji</label>
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
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
});

AdminControlsView.displayName = 'AdminControlsView';

export default AdminControlsView;
