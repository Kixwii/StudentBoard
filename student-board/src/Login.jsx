import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Users, User, AlertCircle } from 'lucide-react';
import api from './services/api';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [role, setRole] = useState('parent');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleInputChange = (e) => {
    setAuthError('');
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: credentials.username,
        password: credentials.password,
      });
      const { token, user } = response.data.data;
      if (user.role !== role) {
        setAuthError(`This account does not have access to the ${role} portal.`);
        setIsLoading(false);
        return;
      }
      localStorage.setItem('auth_token', token);
      setIsLoading(false);
      if (onLogin) onLogin(user.email, user.role, user.guardian_id, user.first_name);
    } catch (err) {
      console.error('Login failed:', err);
      setAuthError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
          }}>
            <GraduationCap color="#a3e635" size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>EduPortal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sign in to your student portal</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          {authError && (
            <div style={{
              marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fef2f2',
              border: '1px solid #fecaca', borderRadius: 12, display: 'flex', alignItems: 'center',
              gap: '0.5rem', fontSize: '0.875rem', color: '#dc2626',
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {authError}
            </div>
          )}

          {/* Role toggle */}
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4, marginBottom: '1.25rem' }}>
            {['parent', 'teacher'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, borderRadius: 10,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: role === r ? '#1a1a1a' : 'transparent',
                  color: role === r ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                {r === 'parent' ? <User size={15} /> : <Users size={15} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                name="username"
                type="email"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder={role === 'teacher' ? 'teacher@school.com' : 'parent@school.com'}
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)',
                  borderRadius: 12, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.15s',
                  fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg)', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '0.75rem 2.75rem 0.75rem 1rem', border: '1.5px solid var(--border)',
                    borderRadius: 12, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.15s',
                    fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg)', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !credentials.username}
              style={{
                width: '100%', padding: '0.875rem', background: '#1a1a1a', color: '#ffffff',
                border: 'none', borderRadius: 12, fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer', transition: 'opacity 0.15s', opacity: (isLoading || !credentials.username) ? 0.5 : 1,
                fontFamily: 'inherit', marginTop: 4,
              }}
            >
              {isLoading ? 'Signing in…' : `Sign In as ${role === 'teacher' ? 'Teacher' : 'Parent'}`}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Demo: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>parent@demo.com</span> · <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>password123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;