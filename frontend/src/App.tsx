import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Pulse from './pages/Pulse'
import Unload from './pages/Unload'
import Reflect from './pages/Reflect'
import Progress from './pages/Progress'
import Pause from './pages/Pause'
import Unsent from './pages/Unsent'
import Memories from './pages/Memories'
import Rebuild from './pages/Rebuild'
import FutureYou from './pages/FutureYou'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Privacy from './pages/Privacy'
import { AuthProvider, useAuth } from './services/auth'
import { AppLayout } from './components/layout/AppLayout'

function Protected({ children }: { children: JSX.Element }) {
  const { user, token } = useAuth()
  const localToken = localStorage.getItem('token')
  
  // If user has token or demo token, allow access
  if (!user && !token && !localToken) {
    return <Navigate to="/login" replace />
  }
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Redirect Root / to /app */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Protected App Routes wrapped with AppLayout shell */}
        <Route path="/app" element={<Protected><Home /></Protected>} />
        <Route path="/app/pulse" element={<Protected><Pulse /></Protected>} />
        <Route path="/app/unload" element={<Protected><Unload /></Protected>} />
        <Route path="/app/reflect" element={<Protected><Reflect /></Protected>} />
        <Route path="/app/pause" element={<Protected><Pause /></Protected>} />
        <Route path="/app/unsent" element={<Protected><Unsent /></Protected>} />
        <Route path="/app/memories" element={<Protected><Memories /></Protected>} />
        <Route path="/app/rebuild" element={<Protected><Rebuild /></Protected>} />
        <Route path="/app/progress" element={<Protected><Progress /></Protected>} />
        <Route path="/app/future-you" element={<Protected><FutureYou /></Protected>} />
        <Route path="/app/notifications" element={<Protected><Notifications /></Protected>} />
        <Route path="/app/settings" element={<Protected><Settings /></Protected>} />
        <Route path="/app/privacy" element={<Protected><Privacy /></Protected>} />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  )
}
