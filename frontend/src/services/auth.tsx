import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type User = { id: number; email: string; name?: string }

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      return { id: 1, email: 'demo@reform.app', name: 'Reflector' }
    }
    return null
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      // Try backend /api/auth/me endpoint
      axios
        .get(API + '/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => {
          if (r.data) setUser(r.data)
        })
        .catch(() => {
          // If backend API fails or is unreachable, retain fallback local user session
          setUser((prev) => prev || { id: 1, email: 'demo@reform.app', name: 'Reflector' })
        })
    } else {
      setUser(null)
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await axios.post(API + '/api/auth/login', { email, password })
    const newToken = res.data.access_token
    if (!newToken) {
      throw new Error('No access token received from server')
    }
    setToken(newToken)
    setUser(res.data.user || { id: 1, email, name: email.split('@')[0] })
    return res
  }

  const register = async (email: string, password: string, name?: string) => {
    const res = await axios.post(API + '/api/auth/register', { email, password, name })
    return res
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('reform_rebuild_goals')
    localStorage.removeItem('reform_pulse_history')
    localStorage.removeItem('reform_unload_entries')
    localStorage.removeItem('reform_unsent_letters')
    localStorage.removeItem('reform_memories')
    localStorage.removeItem('reform_future_messages')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

