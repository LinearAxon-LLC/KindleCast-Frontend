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
  login: (provider: 'google' | 'twitter' | 'apple' | 'email') => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  setRedirectIntent: (intent: 'payment' | 'dashboard' | null, planName?: string) => void
  getRedirectIntent: () => { intent: 'payment' | 'dashboard' | null; planName?: string }
  clearRedirectIntent: () => void
  setPendingLinkData: (data: { url: string; format: string; customPrompt?: string } | null) => void
  getPendingLinkData: () => { url: string; format: string; customPrompt?: string } | null
  clearPendingLinkData: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [redirectIntent, setRedirectIntentState] = useState<{ intent: 'payment' | 'dashboard' | null; planName?: string }>({ intent: null })
  const [pendingLinkData, setPendingLinkDataState] = useState<{ url: string; format: string; customPrompt?: string } | null>(null)
  const toast = useToastHelpers()

  const fetchCurrentUser = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('User fetch already in progress, skipping...')
      return
    }

    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const initializeAuth = async () => {
    try {
      // Skip OAuth callback handling if we're on the auth success page
      // The auth success page will handle token extraction and storage
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      if (currentPath !== '/auth/success') {
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
      setIsInitialized(true)
    }
  }

  // Check for OAuth callback and existing session on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  // Watch for token changes (e.g., from auth success page)
  useEffect(() => {
    if (isInitialized && !user && TokenManager.hasTokens()) {
      console.log('Tokens detected after initialization, fetching user...')
      fetchCurrentUser()
    }
  }, [isInitialized, user, fetchCurrentUser])

  const login = useCallback((provider: 'google' | 'twitter' | 'apple' | 'email') => {
    try {
      if (provider === 'google') {
        OAuthManager.initiateGoogleLogin()
      } else if (provider === 'twitter') {
        OAuthManager.initiateTwitterLogin()
      } else if (provider === 'apple') {
        OAuthManager.initiateAppleLogin()
      } else if (provider === 'email') {
        OAuthManager.initiateEmailLogin()
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

  // Redirect intent management
  const setRedirectIntent = useCallback((intent: 'payment' | 'dashboard' | null, planName?: string) => {
    setRedirectIntentState({ intent, planName })
  }, [])

  const getRedirectIntent = useCallback(() => {
    return redirectIntent
  }, [redirectIntent])

  const clearRedirectIntent = useCallback(() => {
    setRedirectIntentState({ intent: null })
  }, [])

  // Pending link data management
  const setPendingLinkData = useCallback((data: { url: string; format: string; customPrompt?: string } | null) => {
    setPendingLinkDataState(data)
  }, [])

  const getPendingLinkData = useCallback(() => {
    return pendingLinkData
  }, [pendingLinkData])

  const clearPendingLinkData = useCallback(() => {
    setPendingLinkDataState(null)
  }, [])

  const value = {
    user,
    isLoading,
    isInitialized,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    setRedirectIntent,
    getRedirectIntent,
    clearRedirectIntent,
    setPendingLinkData,
    getPendingLinkData,
    clearPendingLinkData
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
