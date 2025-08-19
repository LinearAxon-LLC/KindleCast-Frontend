import { useState, useCallback, useEffect } from 'react'
import { AuthenticatedAPI } from '@/lib/auth'
import { useAuthenticatedAPI } from '@/hooks/useAuthenticatedAPI'
import { Conversion, ConversionsResponse, ProcessingStatus } from '@/types/api'

interface UseConversionHistoryOptions {
  pageSize?: number
  autoFetch?: boolean
}

interface UseConversionHistoryReturn {
  conversions: Conversion[]
  isLoading: boolean
  error: any
  currentPage: number
  totalPages: number
  hasMore: boolean
  fetchHistory: (page?: number) => Promise<void>
  refresh: () => Promise<void>
  filterByStatus: (status: ProcessingStatus | 'all') => Conversion[]
}

export function useConversionHistory(
  options: UseConversionHistoryOptions = {}
): UseConversionHistoryReturn {
  const { pageSize = 10, autoFetch = false } = options
  
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const api = useAuthenticatedAPI(
    (page: number, size: number) => AuthenticatedAPI.getLinkHistory(page, size),
    {
      showErrorToast: true,
      retryAttempts: 2
    }
  )

  const fetchHistory = useCallback(async (page: number = 1) => {
    const result = await api.execute(page, pageSize)
    if (result) {
      setConversions(result.conversions)
      setCurrentPage(page)
      
      // Calculate pagination info
      const totalItems = result.conversions.length
      const calculatedTotalPages = Math.ceil(totalItems / pageSize)
      setTotalPages(calculatedTotalPages)
      setHasMore(page < calculatedTotalPages)
      setHasFetched(true)
    }
  }, [api, pageSize])

  const refresh = useCallback(async () => {
    setCurrentPage(1)
    await fetchHistory(1)
  }, [fetchHistory])

  const filterByStatus = useCallback((status: ProcessingStatus | 'all'): Conversion[] => {
    if (status === 'all') {
      return conversions
    }
    return conversions.filter(conversion => conversion.processing_status === status)
  }, [conversions])

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && !hasFetched) {
      fetchHistory(1)
    }
  }, [autoFetch, hasFetched, fetchHistory])

  return {
    conversions,
    isLoading: api.isLoading,
    error: api.error,
    currentPage,
    totalPages,
    hasMore,
    fetchHistory,
    refresh,
    filterByStatus
  }
}
