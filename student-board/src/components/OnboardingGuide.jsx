import React from 'react';
import { HelpCircle, UserPlus, Link, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

const OnboardingGuide = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#374151', lineHeight: 1.6 }}>
      
      {/* Hero Section */}
      <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '2rem', color: '#fff', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <HelpCircle size={24} color="#a3e635" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Welcome to EduPortal</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem', maxWidth: 400, margin: '0 auto' }}>
          Learn how to add students, invite parents, and get everyone connected for a seamless educational experience.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        {/* Step 1: Adding Students */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={20} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>1. Adding Students</h2>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Teachers and administrators can add new students to the platform through the Admin Dashboard.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <li style={{ display: 'flex', gap: 8 }}>
              <ArrowRight size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>Navigate to <strong>Admin {'>'} Students</strong>.</span>
            </li>
            <li style={{ display: 'flex', gap: 8 }}>
              <ArrowRight size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>Click <strong>Add New Student</strong> and enter the basic details (Name, Grade, Class).</span>
            </li>
            <li style={{ display: 'flex', gap: 8 }}>
              <ArrowRight size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>Save to generate a unique <strong>Student ID</strong>.</span>
            </li>
          </ul>
        </div>

        {/* Step 2: Parent Linking */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link size={20} color="#a855f7" />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>2. Assigning Parents</h2>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Parents are linked to their children using the Student ID and a verification process to ensure privacy.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <li style={{ display: 'flex', gap: 8 }}>
              <ArrowRight size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>Parents create a free <strong>Guardian Account</strong>.</span>
            </li>
            <li style={{ display: 'flex', gap: 8 }}>
              <ArrowRight size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>They enter their child's <strong>Student ID</strong> and an <strong>Enrollment Code</strong> provided by the school.</span>
            </li>
            <li style={{ display: 'flex', gap: 8 }}>
              <ArrowRight size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>Once verified, the student's dashboard becomes visible.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Info Notice */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '1.25rem', display: 'flex', gap: 12 }}>
        <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14532d', margin: '0 0 0.25rem' }}>Security & Privacy</h3>
          <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0 }}>
            Student records are strictly confidential. Only authenticated guardians with the correct linking codes can access a student's academic and financial data. If a parent loses their enrollment code, they must contact the school administration directly.
          </p>
        </div>
      </div>

    </div>
  );
};

export default OnboardingGuide;
