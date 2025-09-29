import { create } from 'zustand'
import axios from 'axios'

// Create a simple axios instance for auth calls to avoid circular dependency
const authApi = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  withCredentials: true, // Important for refresh cookie flow
})

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
      const { data } = await authApi.post('/auth/refresh')
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
    const { data } = await authApi.post('/auth/login', { email, password })
    const token = data?.access_token as string
    set({ accessToken: token, user: data?.user })
  },

  logout: async () => {
    try { await authApi.post('/auth/logout') } catch (_) {}
    set({ user: null, accessToken: null })
  },

  fetchMe: async () => {
    const { data } = await authApi.get('/auth/me')
    set({ user: data?.user })
  },
}))

