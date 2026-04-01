import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (onLogin) {
        onLogin(credentials.username, 'parent', credentials.username);
      } else {
        console.error("onLogin missing");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">

        <div className="text-center mb-6">
          <GraduationCap className="mx-auto text-blue-600 mb-2" size={28} />
          <h1 className="text-2xl font-semibold">Parent Portal</h1>
        </div>

        <div className="space-y-4">
          <input
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;