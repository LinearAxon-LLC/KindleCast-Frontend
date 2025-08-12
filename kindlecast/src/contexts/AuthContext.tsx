'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User } from '@/types/api'
import { TokenManager, AuthenticatedAPI, OAuthManager, getErrorMessage } from '@/lib/auth'
import { resilientApiCall } from '@/lib/retry'
import { useToastHelpers } from '@/components/ui/toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  login: (provider: 'google' | 'amazon') => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const toast = useToastHelpers()

  // Check for OAuth callback and existing session on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)

      // Check for OAuth callback first
      try {
        const tokens = OAuthManager.handleOAuthCallback()
        if (tokens) {
          // OAuth callback successful, fetch user data
          await fetchCurrentUser()
          toast.success('Successfully signed in!')
          return
        }
      } catch (error) {
        // OAuth callback failed
        console.error('OAuth callback failed:', error)
        toast.error('Sign In Failed', getErrorMessage(error))
        TokenManager.clearTokens()
        setUser(null)
        return
      }

      // Check existing session
      if (TokenManager.hasTokens()) {
        await fetchCurrentUser()
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      TokenManager.clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await resilientApiCall(
        () => AuthenticatedAPI.getCurrentUser(),
        {
          maxAttempts: 2,
          onRetry: (attempt) => {
            console.log(`Retrying user fetch, attempt ${attempt}`)
          }
        }
      )
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      TokenManager.clearTokens()
      setUser(null)
      throw error
    }
  }, [])

  const login = useCallback((provider: 'google' | 'amazon') => {
    try {
      if (provider === 'google') {
        OAuthManager.initiateGoogleLogin()
      } else {
        OAuthManager.initiateAmazonLogin()
      }
    } catch (error) {
      console.error('Login initiation failed:', error)
      toast.error('Login Failed', getErrorMessage(error))
    }
  }, [toast])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await resilientApiCall(() => AuthenticatedAPI.logout())
      setUser(null)
      toast.success('Successfully signed out')
    } catch (error) {
      console.error('Logout failed:', error)
      // Clear tokens even if API call fails
      TokenManager.clearTokens()
      setUser(null)
      toast.warning('Signed out', 'There was an issue with the logout process, but you have been signed out locally.')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const refreshUser = useCallback(async () => {
    if (!user) return

    try {
      await fetchCurrentUser()
    } catch (error) {
      console.error('Failed to refresh user:', error)
      toast.error('Session Error', getErrorMessage(error))
    }
  }, [user, toast, fetchCurrentUser])

  const value = {
    user,
    isLoading,
    isInitialized,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user
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
