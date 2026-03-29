import { useState } from 'react'
import './App.css'
import Login from './Login'
import ParentDashboard from './ParentDashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

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
    setUser(null)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <ParentDashboard user={user} onLogout={handleLogout} />
  )
}

export default App