import { useState, useCallback } from 'react'
import { AuthenticatedAPI } from '@/lib/auth'
import { useToastHelpers } from '@/components/ui/toast'

interface UseBillingPortalReturn {
  isLoading: boolean
  error: string | null
  openBillingPortal: () => Promise<void>
}

export function useBillingPortal(): UseBillingPortalReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToastHelpers()

  const openBillingPortal = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Requesting billing portal URL...')
      const response = await AuthenticatedAPI.getCustomerBillingPortal()
      
      if (response.url) {
        console.log('Opening billing portal:', response.url)
        // Open in new tab
        window.open(response.url, '_blank', 'noopener,noreferrer')
        toast.success('Opening billing portal...')
      } else {
        throw new Error('No billing portal URL received')
      }
    } catch (err: any) {
      console.error('Failed to open billing portal:', err)
      const errorMessage = err.message || 'Failed to open billing portal'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    isLoading,
    error,
    openBillingPortal
  }
}
