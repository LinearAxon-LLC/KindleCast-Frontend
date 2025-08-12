// Hook for making authenticated API calls with comprehensive error handling

import { useState, useCallback } from 'react'
import { AuthenticatedAPI, getErrorMessage, APIException } from '@/lib/auth'
import { resilientApiCall } from '@/lib/retry'
import { useToastHelpers } from '@/components/ui/toast'
import { useAuth } from '@/contexts/AuthContext'

interface UseAuthenticatedAPIOptions {
  showErrorToast?: boolean
  retryAttempts?: number
  onError?: (error: APIException) => void
  onSuccess?: () => void
}

interface UseAuthenticatedAPIReturn<T> {
  data: T | null
  isLoading: boolean
  error: APIException | null
  execute: (...args: any[]) => Promise<T | null>
  retry: () => Promise<T | null>
  reset: () => void
}

export function useAuthenticatedAPI<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseAuthenticatedAPIOptions = {}
): UseAuthenticatedAPIReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<APIException | null>(null)
  const [lastArgs, setLastArgs] = useState<any[]>([])

  const toast = useToastHelpers()
  const { logout } = useAuth()

  const {
    showErrorToast = true,
    retryAttempts = 2,
    onError,
    onSuccess,
  } = options

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    try {
      setIsLoading(true)
      setError(null)
      setLastArgs(args)

      const result = await resilientApiCall(
        () => apiCall(...args),
        {
          maxAttempts: retryAttempts,
          onRetry: (attempt, error) => {
            console.log(`API retry attempt ${attempt}:`, error)
          }
        }
      )

      setData(result)
      onSuccess?.()
      return result
    } catch (err) {
      const apiError = err instanceof APIException 
        ? err 
        : new APIException(
            getErrorMessage(err),
            0,
            'network_error'
          )

      setError(apiError)
      
      // Handle authentication errors
      if (apiError.errorType === 'authentication') {
        toast.error(
          'Session Expired',
          'Please sign in again to continue.',
          {
            label: 'Sign In',
            onClick: () => logout()
          }
        )
      } else if (showErrorToast) {
        const shouldShowRetry = apiError.errorType === 'network_error' || 
                               apiError.errorType === 'server_error'
        
        toast.error(
          'Request Failed',
          getErrorMessage(apiError),
          shouldShowRetry ? {
            label: 'Retry',
            onClick: () => retry()
          } : undefined
        )
      }

      onError?.(apiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [apiCall, retryAttempts, onSuccess, onError, showErrorToast, toast, logout])

  const retry = useCallback(async (): Promise<T | null> => {
    if (lastArgs.length === 0) {
      console.warn('No previous arguments to retry with')
      return null
    }
    return execute(...lastArgs)
  }, [execute, lastArgs])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
    setLastArgs([])
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    retry,
    reset,
  }
}

// Specialized hook for user profile operations
export function useUserProfileAPI() {
  const { refreshUser } = useAuth()

  const profileAPI = useAuthenticatedAPI(
    () => AuthenticatedAPI.getCurrentUser(),
    {
      onSuccess: () => {
        // Refresh the auth context when profile is updated
        refreshUser()
      }
    }
  )

  return {
    ...profileAPI,
    refreshProfile: profileAPI.execute,
  }
}

// Hook for handling file uploads with progress
export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToastHelpers()

  const uploadFile = useCallback(async (
    file: File,
    endpoint: string,
    onProgress?: (progress: number) => void
  ): Promise<any> => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', file)

      // This would need to be implemented with proper upload progress tracking
      // For now, simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = Math.min(prev + 10, 90)
          onProgress?.(next)
          return next
        })
      }, 200)

      const result = await AuthenticatedAPI.makeRequest(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it with boundary
        }
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      onProgress?.(100)

      toast.success('Upload Complete', 'Your file has been uploaded successfully.')
      return result
    } catch (error) {
      toast.error('Upload Failed', getErrorMessage(error))
      throw error
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [toast])

  return {
    uploadFile,
    uploadProgress,
    isUploading,
  }
}

// Hook for handling pagination
export function usePaginatedAPI<T>(
  apiCall: (page: number, limit: number) => Promise<{ items: T[]; total: number; page: number; limit: number }>,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialLimit)
  const [items, setItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const api = useAuthenticatedAPI(
    (page: number, limit: number) => apiCall(page, limit),
    {
      onSuccess: () => {
        // Handle success if needed
      }
    }
  )

  const loadPage = useCallback(async (pageNum: number, append: boolean = false) => {
    const result = await api.execute(pageNum, limit)
    if (result) {
      setItems(prev => append ? [...prev, ...result.items] : result.items)
      setTotal(result.total)
      setPage(result.page)
      setHasMore(result.items.length === limit && (result.page * limit) < result.total)
    }
  }, [api, limit])

  const loadMore = useCallback(() => {
    if (!api.isLoading && hasMore) {
      loadPage(page + 1, true)
    }
  }, [api.isLoading, hasMore, page, loadPage])

  const refresh = useCallback(() => {
    setItems([])
    setPage(1)
    loadPage(1, false)
  }, [loadPage])

  return {
    items,
    total,
    page,
    limit,
    hasMore,
    isLoading: api.isLoading,
    error: api.error,
    loadPage,
    loadMore,
    refresh,
    setLimit,
  }
}
