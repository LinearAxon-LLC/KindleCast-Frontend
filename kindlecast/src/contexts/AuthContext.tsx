'use client'

import React, { createContext, useContext } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user: User | null = session?.user ? {
    id: session.user.id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || ''
  } : null

  const login = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const logout = () => {
    signOut({ callbackUrl: '/' })
  }

  const value = {
    user,
    isLoading: status === 'loading',
    login,
    logout,
    isAuthenticated: !!session
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
