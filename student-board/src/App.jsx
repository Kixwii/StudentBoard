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
    
    // Check if user is already logged in (optional persistence, but ignoring for now since it wasn't fully set up)
  }, [])

  const handleLogin = (username, userType, guardianId, firstName) => {
    setUser({
      username,
      userType,
      guardianId,
      firstName: firstName || username.split('@')[0] || username
    })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    // localStorage.removeItem('auth_token') -> using mock for now
    setUser(null)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
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