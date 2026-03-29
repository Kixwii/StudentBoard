import React, { useState, useEffect } from 'react';
import api from './services/api';
import { User, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userType] = useState('parent'); // parent-only app
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
    return { width: 768, height: 1024 };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', {
        email: credentials.username,
        password: credentials.password,
      });

      const { token, user } = response.data.data;
      localStorage.setItem('auth_token', token);

      if (rememberMe) {
        const userData = {
          username: user.email,
          userType,
          guardianId: user.guardian_id,
          firstName: user.first_name
        };
        localStorage.setItem('user_data', JSON.stringify(userData));
      }

      if (onLogin) {
        onLogin(user.email, userType, user.guardian_id, user.first_name);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      // Set initial size
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Responsive breakpoints
  const isExtraSmall = windowSize.width < 480;
  const isSmall = windowSize.width < 576;
  const isMedium = windowSize.width < 768;
  const isLarge = windowSize.width < 992;

  // Responsive helper functions
  const getResponsivePadding = () => {
    if (isExtraSmall) return '0.5rem 0.75rem';
    if (isSmall) return '0.625rem 0.875rem';
    if (isMedium) return '0.75rem 1rem';
    return '0.875rem 1rem';
  };

  const getResponsiveFontSize = () => {
    if (isExtraSmall) return '0.875rem';
    if (isSmall) return '0.9375rem';
    return '1rem';
  };

  const getResponsiveCardPadding = () => {
    if (isExtraSmall) return '1rem';
    if (isSmall) return '1.25rem';
    if (isMedium) return '1.5rem';
    return '2rem';
  };

  const getResponsiveIconSize = () => {
    if (isExtraSmall) return 28;
    return 32;
  };

  const getResponsiveMaxWidth = () => {
    if (isExtraSmall) return '100%';
    if (isSmall) return '24rem';
    return '28rem';
  };

  const getResponsiveContainerPadding = () => {
    if (isExtraSmall) return '0.75rem';
    if (isSmall) return '1rem';
    if (isMedium) return '1.5rem';
    return '2rem';
  };

  // Dynamic styles based on screen size
  const formInputStyle = {
    width: '100%',
    padding: getResponsivePadding(),
    backgroundColor: '#f9fafb',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: getResponsiveFontSize(),
    lineHeight: '1.5',
    color: '#374151',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease'
  };

  const formInputFocusStyle = {
    outline: 'none',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 2px #3b82f6'
  };

  const btnPrimaryStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: getResponsivePadding(),
    backgroundColor: isLoading ? '#f3f4f6' : '#3b82f6',
    color: isLoading ? '#9ca3af' : '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: getResponsiveFontSize(),
    fontWeight: '500',
    fontFamily: 'inherit',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease'
  };

  const dashboardCardStyle = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: getResponsiveCardPadding(),
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };

  return (
    <div 
      className="min-h-screen bg-gray-100 flex items-center justify-center"
      style={{
        padding: getResponsiveContainerPadding(),
        minHeight: '100vh'
      }}
    >
      <div 
        style={{
          maxWidth: getResponsiveMaxWidth(),
          width: '100%'
        }}
      >
        {/* Header */}
        <div style={{...dashboardCardStyle, marginBottom: isExtraSmall ? '1rem' : '1.5rem'}} className="text-center">
          <div className={`flex items-center justify-center gap-3 ${isExtraSmall ? 'mb-3 flex-col' : 'mb-4'}`}>
            <div className={`bg-blue-100 ${isExtraSmall ? 'p-2' : 'p-3'} rounded-lg`}>
              <GraduationCap className="text-blue-600" size={getResponsiveIconSize()} />
            </div>
            <div>
              <h1 className={`font-bold text-gray-800 ${isExtraSmall ? 'text-lg' : isSmall ? 'text-xl' : 'text-2xl'}`}>
                Parent Portal
              </h1>
              <p className={`text-gray-600 ${isExtraSmall ? 'text-xs' : 'text-sm'}`}>
                Student Information System
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div style={dashboardCardStyle}>
          <div style={{display: 'flex', flexDirection: 'column', gap: isExtraSmall ? '0.75rem' : '1rem'}}>
            {/* Error Message */}
            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '0.5rem',
                color: '#dc2626',
                fontSize: isExtraSmall ? '0.8125rem' : '0.875rem'
              }}>
                {error}
              </div>
            )}
            {/* Username Field */}
            <div style={{marginBottom: isExtraSmall ? '0.75rem' : '1rem'}}>
              <label style={{
                display: 'block',
                marginBottom: isExtraSmall ? '0.375rem' : '0.5rem',
                fontSize: isExtraSmall ? '0.8125rem' : '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Parent ID / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10" style={{paddingLeft: isExtraSmall ? '0.75rem' : '1rem'}}>
                  <User className="text-gray-400" size={isExtraSmall ? 18 : 20} />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={credentials.username}
                  onChange={handleInputChange}
                  style={{
                    ...formInputStyle,
                    paddingLeft: isExtraSmall ? '2.5rem' : '3rem'
                  }}
                  onFocus={(e) => Object.assign(e.target.style, formInputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, {backgroundColor: '#f9fafb', boxShadow: 'none'})}
                  placeholder="Enter your parent ID or email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{marginBottom: isExtraSmall ? '0.75rem' : '1rem'}}>
              <label style={{
                display: 'block',
                marginBottom: isExtraSmall ? '0.375rem' : '0.5rem',
                fontSize: isExtraSmall ? '0.8125rem' : '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10" style={{paddingLeft: isExtraSmall ? '0.75rem' : '1rem'}}>
                  <Lock className="text-gray-400" size={isExtraSmall ? 18 : 20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  style={{
                    ...formInputStyle,
                    paddingLeft: isExtraSmall ? '2.5rem' : '3rem',
                    paddingRight: isExtraSmall ? '2.5rem' : '3rem'
                  }}
                  onFocus={(e) => Object.assign(e.target.style, formInputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, {backgroundColor: '#f9fafb', boxShadow: 'none'})}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center z-10 transition-colors"
                  style={{
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    paddingRight: isExtraSmall ? '0.75rem' : '1rem'
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400 hover:text-gray-600" size={isExtraSmall ? 18 : 20} />
                  ) : (
                    <Eye className="text-gray-400 hover:text-gray-600" size={isExtraSmall ? 18 : 20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className={`flex items-center ${isExtraSmall ? 'flex-col gap-2' : 'justify-between'}`}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: isExtraSmall ? '0.875rem' : '1rem',
                    height: isExtraSmall ? '0.875rem' : '1rem',
                    marginRight: '0.5rem',
                    accentColor: '#3b82f6'
                  }}
                />
                <span className={`text-gray-600 ${isExtraSmall ? 'text-xs' : 'text-sm'}`}>Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                style={{
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: isExtraSmall ? '0.75rem' : '0.875rem'
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              style={btnPrimaryStyle}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
                    style={{
                      width: isExtraSmall ? '1rem' : '1rem',
                      height: isExtraSmall ? '1rem' : '1rem'
                    }}
                  ></div>
                  <span style={{fontSize: isExtraSmall ? '0.8125rem' : getResponsiveFontSize()}}>
                    Signing in...
                  </span>
                </div>
              ) : (
                <span style={{fontSize: isExtraSmall ? '0.8125rem' : getResponsiveFontSize()}}>
                  Sign in as Parent
                </span>
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div 
            className="bg-gray-50 rounded-lg"
            style={{
              marginTop: isExtraSmall ? '1rem' : '1.5rem',
              padding: isExtraSmall ? '0.75rem' : '1rem'
            }}
          >
            <h3 className={`font-medium text-gray-700 ${isExtraSmall ? 'text-xs mb-1' : 'text-sm mb-2'}`}>
              Demo Credentials:
            </h3>
            <div className={`text-gray-600 ${isExtraSmall ? 'text-xs space-y-0.5' : 'text-xs space-y-1'}`}>
              <div><strong>Email:</strong> parent@demo.com</div>
              <div><strong>Password:</strong> password123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="text-center"
          style={{marginTop: isExtraSmall ? '1rem' : '1.5rem'}}
        >
          <p className={`text-gray-500 ${isExtraSmall ? 'text-xs' : 'text-sm'}`}>
            Need help? Contact{' '}
            <button 
              className="text-blue-600 hover:text-blue-700 transition-colors"
              style={{
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: isExtraSmall ? '0.75rem' : '0.875rem'
              }}
            >
              school administration
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;