import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserProfile, API_CONFIG } from '@/types/api'
import { AuthenticatedAPI } from '@/lib/auth'

export function useUserProfile() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserProfile = async () => {
    if (!isAuthenticated) {
      setUserProfile(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      // Use the actual /me API endpoint
      const profile = await AuthenticatedAPI.makeRequest<UserProfile>(
        API_CONFIG.ENDPOINTS.AUTH_ME
      )
      setUserProfile(profile)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setUserProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user profile')
      }
      
      // Refresh the profile data
      await fetchUserProfile()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  const setupDevice = async (kindleEmail: string, acknowledgment: string = 'yes') => {
    try {
      // Use the correct API endpoint for info update
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
        kindlecastEmail: 'no-reply@kindlecast.com' // Return the sender email
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }

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
    updateUserProfile,
    setupDevice
  }
}
