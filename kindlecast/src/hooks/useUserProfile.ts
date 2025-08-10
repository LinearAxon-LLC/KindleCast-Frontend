import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface UserProfile {
  userId: string
  email: string
  name: string
  avatar?: string
  
  // Onboarding tracking
  signed_up: boolean
  when_signed_up: string
  user_subscribed: boolean
  trial_started?: string
  set_up_device: boolean
  
  // Device setup
  kindle_email?: string
  ktool_email?: string
  device_setup_completed?: boolean
  
  // Usage tracking
  basic_conversions: number
  ai_conversions: number
  
  // Calculated fields
  trialDaysRemaining: number
  config: {
    free_trial_days: number
    basic_conversions_limit: number
    ai_conversions_limit: number
  }
}

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
      const response = await fetch('/api/user/profile')
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }
      
      const data = await response.json()
      setUserProfile(data)
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

  const setupDevice = async (kindleEmail: string) => {
    try {
      const response = await fetch('/api/user/setup-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kindleEmail,
          confirmed: true
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to setup device')
      }
      
      const data = await response.json()
      
      // Refresh the profile data
      await fetchUserProfile()
      
      return {
        success: true,
        ktoolEmail: data.ktoolEmail
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
