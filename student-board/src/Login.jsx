import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Users, User, AlertCircle } from 'lucide-react';
import api from './services/api';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [role, setRole] = useState('parent'); // 'parent' or 'teacher'

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleInputChange = (e) => {
    setAuthError('');
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: credentials.username,
        password: credentials.password
      });

      const { token, user } = response.data.data;
      
      // Verify the returned user role matches the UI selected role
      if (user.role !== role) {
        setAuthError(`This account does not have access to the ${role} portal.`);
        setIsLoading(false);
        return;
      }

      // Store real token
      localStorage.setItem('auth_token', token);
      
      setIsLoading(false);

      if (onLogin) {
        onLogin(user.email, user.role, user.guardian_id, user.first_name);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setAuthError(err.response?.data?.error || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">

        <div className="text-center mb-6">
          <GraduationCap className="mx-auto text-blue-600 mb-2" size={32} />
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Please sign in to your account</p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {authError}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'parent' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setRole('parent')}
          >
            <User size={16} /> Parent
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'teacher' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setRole('teacher')}
          >
            <Users size={16} /> Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            placeholder={role === 'teacher' ? "Teacher Email" : "Parent Email"}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !credentials.username}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? "Signing in..." : `Sign In as ${role === 'teacher' ? 'Teacher' : 'Parent'}`}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Demo: Use <span className="font-medium text-gray-700">parent@demo.com</span> and password <span className="font-medium text-gray-700">password123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;