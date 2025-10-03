'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_BASE } from '@/lib/config'

type User = { id?: number; username?: string; email?: string }
type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      async login(username, password) {
        const res = await fetch(`${API_BASE}/auth/jwt/create/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        if (!res.ok) throw new Error('Invalid credentials')
        const data = await res.json()
        const access = data.access as string
        const refresh = data.refresh as string
        set({ accessToken: access, refreshToken: refresh })
        // Fetch user info
        const me = await fetch(`${API_BASE}/auth/users/me/`, {
          headers: { Authorization: `JWT ${access}` }
        })
        if (me.ok) {
          const user = await me.json()
          set({ user })
        }
      },
      async register(username, email, password) {
        const res = await fetch(`${API_BASE}/auth/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        })
        if (!res.ok) {
          let msg = 'Registration failed'
          try { const j = await res.json(); msg = j?.detail || msg } catch {}
          throw new Error(msg)
        }
        // Auto-login after register
        await get().login(username, password)
      },
      logout() {
        set({ accessToken: null, refreshToken: null, user: null })
      }
    }),
    { name: 'auth-store' }
  )
)
