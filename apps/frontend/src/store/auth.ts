import { create } from 'zustand'
import api from '@/lib/api'

export type User = {
  id: number
  email: string
  role: 'user' | 'admin'
  is_verified: boolean
  onboarding_complete: boolean
}

type AuthState = {
  user: User | null
  accessToken: string | null
  initializing: boolean
  setAccessToken: (token: string | null) => void
  setUser: (user: User | null) => void
  clear: () => void
  init: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  initializing: true,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  clear: () => set({ user: null, accessToken: null }),

  init: async () => {
    try {
      // try refresh to obtain access token via cookie
      const { data } = await api.post('/auth/refresh')
      const token = data?.access_token as string
      set({ accessToken: token })
      await get().fetchMe()
    } catch (_) {
      // ignore; user remains unauthenticated
    } finally {
      set({ initializing: false })
    }
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const token = data?.access_token as string
    set({ accessToken: token, user: data?.user })
  },

  logout: async () => {
    try { await api.post('/auth/logout') } catch (_) {}
    set({ user: null, accessToken: null })
  },

  fetchMe: async () => {
    const { data } = await api.get('/auth/me')
    set({ user: data?.user })
  },
}))

