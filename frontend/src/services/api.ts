import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper to handle API requests with local fallback state
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: any,
  fallbackKey?: string
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE}${url}`,
      data,
      headers: getAuthHeader(),
    })

    // Save to cache storage if fallbackKey is provided
    if (fallbackKey && method === 'get') {
      localStorage.setItem(fallbackKey, JSON.stringify(response.data))
    }

    return response.data
  } catch (error: any) {
    console.warn(
      `Backend API request to ${url} failed or offline:`,
      error?.response?.data || error?.message || error
    )

    // IMPORTANT:
    // AI requests must NOT use mock fallback responses.
    // Let the real backend error reach the UI.
    if (url.includes('/api/ai/')) {
      throw error
    }

    // Rethrow 401 unauthorized errors so user can re-authenticate
    if (error?.response?.status === 401) {
      throw error
    }

    // Rethrow 5xx server errors so server crashes are not masked by fallback mock data
    if (error?.response?.status && error.response.status >= 500) {
      throw error
    }

    if (fallbackKey) {
      const stored = localStorage.getItem(fallbackKey)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          // ignore parsing error
        }
      }
    }

    // Default clean empty fallbacks when API is unreachable (never return fake user activity)
    return getFallbackData(url, method, data) as T
  }
}

function getFallbackData(
  url: string,
  method: string,
  payload?: any
): any {
  // -------------------------
  // GOALS (Never return fake streaks or fake goals)
  // -------------------------
  if (url.includes('/api/goals')) {
    if (method === 'get') {
      const local = localStorage.getItem('reform_rebuild_goals')
      return local ? JSON.parse(local) : []
    }
    if (method === 'post') {
      const existing = getFallbackData('/api/goals', 'get')
      const newEntry = {
        id: Date.now(),
        ...payload,
        progress: payload.progress || 0,
        streak: payload.streak || 0,
        completed: payload.completed || false,
        created_at: new Date().toISOString(),
      }
      const updated = [newEntry, ...existing]
      localStorage.setItem('reform_rebuild_goals', JSON.stringify(updated))
      return newEntry
    }
    return []
  }

  // -------------------------
  // PROGRESS (No fake days or fake stats)
  // -------------------------
  if (url.includes('/api/progress/trends')) {
    return []
  }

  if (url.includes('/api/progress')) {
    return {
      has_goals: false,
      has_pulses: false,
      has_journals: false,
      total_goals: 0,
      active_goals_count: 0,
      completed_goals_count: 0,
      completion_percentage: 0,
      current_streak: 0,
      completed_milestones: [],
      active_goals: [],
      pulse_count: 0,
      journal_count: 0,
    }
  }

  // -------------------------
  // PULSE
  // -------------------------
  if (url.includes('/api/pulse')) {
    if (method === 'get') {
      const local = localStorage.getItem('reform_pulse_history')
      return local ? JSON.parse(local) : []
    }

    if (method === 'post') {
      const existing = getFallbackData('/api/pulse', 'get')
      const newEntry = {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      }
      const updated = [newEntry, ...existing]
      localStorage.setItem('reform_pulse_history', JSON.stringify(updated))
      return newEntry
    }
  }

  // -------------------------
  // JOURNAL
  // -------------------------
  if (url.includes('/api/journal')) {
    if (method === 'get') {
      const local = localStorage.getItem('reform_unload_entries')
      return local ? JSON.parse(local) : []
    }

    if (method === 'post') {
      const existing = getFallbackData('/api/journal', 'get')
      const newEntry = {
        id: Date.now(),
        text: payload.text,
        mood: payload.mood || 'Reflective',
        trigger: payload.trigger || 'Self',
        created_at: new Date().toISOString(),
      }
      const updated = [newEntry, ...existing]
      localStorage.setItem('reform_unload_entries', JSON.stringify(updated))
      return newEntry
    }
  }

  // -------------------------
  // UNSENT LETTERS
  // -------------------------
  if (url.includes('/api/unsent')) {
    if (method === 'get') {
      const local = localStorage.getItem('reform_unsent_letters')
      return local ? JSON.parse(local) : []
    }

    if (method === 'post') {
      const existing = getFallbackData('/api/unsent', 'get')
      const newEntry = {
        id: Date.now(),
        text: payload.text,
        recipient: payload.recipient || 'Past Self',
        intent: payload.intent || 'Release',
        created_at: new Date().toISOString(),
      }
      const updated = [newEntry, ...existing]
      localStorage.setItem('reform_unsent_letters', JSON.stringify(updated))
      return newEntry
    }
  }

  // -------------------------
  // MEMORIES
  // -------------------------
  if (url.includes('/api/memories')) {
    if (method === 'get') {
      const local = localStorage.getItem('reform_memories')
      return local ? JSON.parse(local) : []
    }
  }

  // -------------------------
  // FUTURE MESSAGES
  // -------------------------
  if (url.includes('/api/future-messages')) {
    if (method === 'get') {
      const local = localStorage.getItem('reform_future_messages')
      return local ? JSON.parse(local) : []
    }
  }

  // -------------------------
  // NOTIFICATIONS
  // -------------------------
  if (url.includes('/api/notifications')) {
    return []
  }

  return []
}