import { useState, useEffect } from 'react'
import './App.css'
import Login from './Login'
import ParentDashboard from './ParentDashboard'
import TeacherDashboard from './TeacherDashboard'
import { initMockData } from './services/mockDataService'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Initialize shared mock database on app load
    initMockData()
    
    // Check if user is already logged in securely via token and persisted state
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, [])

  const handleLogin = (username, userType, guardianId, firstName) => {
    const userData = {
      username,
      userType,
      guardianId,
      firstName: firstName || username.split('@')[0] || username
    };
    
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn || !user) {
    return <Login onLogin={handleLogin} />
  }

  if (user?.userType === 'teacher') {
    return <TeacherDashboard user={user} onLogout={handleLogout} />
  }

  return (
    <ParentDashboard user={user} onLogout={handleLogout} />
  )
}

export default App