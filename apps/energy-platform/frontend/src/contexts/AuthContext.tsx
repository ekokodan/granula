'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '@/lib/api-client'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  verified: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  propertyType?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data
        
        setUser(userData)
        setToken(authToken)
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', authToken)
          localStorage.setItem('user', JSON.stringify(userData))
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', data)
      
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data
        
        setUser(userData)
        setToken(authToken)
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', authToken)
          localStorage.setItem('user', JSON.stringify(userData))
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

