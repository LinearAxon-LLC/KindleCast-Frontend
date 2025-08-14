import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserProfile, API_CONFIG } from '@/types/api'
import { AuthenticatedAPI } from '@/lib/auth'

// Global singleton to prevent multiple API calls across all components
let globalUserProfile: UserProfile | null = null
let globalIsLoading = false
let globalError: string | null = null
let isCurrentlyFetching = false
let fetchPromise: Promise<void> | null = null

export function useUserProfile() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(globalUserProfile)
  const [isLoading, setIsLoading] = useState(globalIsLoading)
  const [error, setError] = useState<string | null>(globalError)

  const fetchUserProfile = async () => {
    if (!isAuthenticated) {
      globalUserProfile = null
      globalIsLoading = false
      globalError = null
      setUserProfile(null)
      setIsLoading(false)
      setError(null)
      return
    }

    // If already fetching, wait for the existing promise
    if (fetchPromise) {
      await fetchPromise
      // Update local state with global state
      setUserProfile(globalUserProfile)
      setIsLoading(globalIsLoading)
      setError(globalError)
      return
    }

    // If we already have data, use it
    if (globalUserProfile) {
      setUserProfile(globalUserProfile)
      setIsLoading(false)
      setError(globalError)
      return
    }

    // Create single fetch promise
    fetchPromise = (async () => {
      try {
        globalIsLoading = true
        isCurrentlyFetching = true

        // Single API call to /me endpoint
        const profile = await AuthenticatedAPI.makeRequest<UserProfile>(
          API_CONFIG.ENDPOINTS.AUTH_ME
        )

        globalUserProfile = profile
        globalError = null
        globalIsLoading = false
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load profile'
        globalError = errorMsg
        globalUserProfile = null
        globalIsLoading = false
      } finally {
        isCurrentlyFetching = false
        fetchPromise = null
      }
    })()

    await fetchPromise

    // Update local state
    setUserProfile(globalUserProfile)
    setIsLoading(globalIsLoading)
    setError(globalError)
  }

  const connectKindle = async (kindleEmail: string, acknowledgment: string = 'yes') => {
    try {
      const response = await AuthenticatedAPI.makeRequest(
        API_CONFIG.ENDPOINTS.USER_INFO_UPDATE,
        {
          method: 'POST',
          body: JSON.stringify({
            kindle_email: kindleEmail,
            mail_whitelisting_acknowledged: acknowledgment
          }),
        }
      )
      
      // Refresh the profile data
      await fetchUserProfile()
      
      return {
        success: true,
        data: response
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }

  // Only fetch once when authentication changes
  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile()
    }
  }, [isAuthenticated, authLoading])

  return {
    userProfile,
    isLoading: isLoading || authLoading,
    error,
    refetch: fetchUserProfile,
    setupDevice: connectKindle
  }
}
