import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {API_CONFIG, UserProfile} from '@/types/api'
import {AuthenticatedAPI} from '@/lib/auth'

// Global singleton to prevent multiple API calls across all components
let globalUserProfile: UserProfile | null = null
let globalIsLoading = false
let globalError: string | null = null
let isCurrentlyFetching = false
let fetchPromise: Promise<void> | null = null
let lastFetchTime = 0
const FETCH_DEBOUNCE_MS = 1000 // Prevent fetches within 1 second

// Global listeners for state changes
const listeners = new Set<() => void>()

const notifyListeners = () => {
  listeners.forEach(listener => listener())
}

export function useUserProfile() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(globalUserProfile)
  const [isLoading, setIsLoading] = useState(globalIsLoading)
  const [error, setError] = useState<string | null>(globalError)

  // Subscribe to global state changes
  useEffect(() => {
    const updateState = () => {
      setUserProfile(globalUserProfile)
      setIsLoading(globalIsLoading)
      setError(globalError)
    }

    listeners.add(updateState)
    return () => {
      listeners.delete(updateState)
    }
  }, [])

  const fetchUserProfile = async () => {
    if (!isAuthenticated) {
      globalUserProfile = null
      globalIsLoading = false
      globalError = null
      notifyListeners()
      return
    }

    // Debounce rapid successive calls
    const now = Date.now()
    if (now - lastFetchTime < FETCH_DEBOUNCE_MS && globalUserProfile) {
      console.log('Debouncing user profile fetch - using cached data')
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
    lastFetchTime = now
    fetchPromise = (async () => {
      try {
        globalIsLoading = true
        isCurrentlyFetching = true
        notifyListeners()

        // Single API call to /me endpoint
        globalUserProfile = await AuthenticatedAPI.makeRequest<UserProfile>(
            API_CONFIG.ENDPOINTS.AUTH_ME
        )
        globalError = null
        globalIsLoading = false

        console.log('User profile fetched successfully')
      } catch (err) {
        globalError = err instanceof Error ? err.message : 'Failed to load profile'
        globalUserProfile = null
        globalIsLoading = false

        console.error('Failed to fetch user profile:', err)
      } finally {
        isCurrentlyFetching = false
        fetchPromise = null

        // Notify all listeners of state change
        notifyListeners()
      }
    })()

    await fetchPromise
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
