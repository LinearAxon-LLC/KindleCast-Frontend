import { useState, useCallback, useEffect, useRef } from 'react'
import { AuthenticatedAPI } from '@/lib/auth'
import { Conversion, ConversionsResponse, ProcessingStatus } from '@/types/api'

// Global cache to prevent duplicate requests across components
const globalRequestCache = new Map<string, Promise<ConversionsResponse>>()
const CACHE_DURATION = 5000 // 5 seconds

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  // Use refs to prevent multiple simultaneous requests
  const abortControllerRef = useRef<AbortController | null>(null)
  const isRequestInProgressRef = useRef(false)
  const lastRequestTimeRef = useRef<number>(0)
  const DEBOUNCE_DELAY = 1000 // 1 second debounce

  const fetchHistory = useCallback(async (page: number = 1) => {
    // Prevent multiple simultaneous requests
    if (isRequestInProgressRef.current) {
      console.log('Request already in progress, skipping...')
      return
    }

    // Debounce rapid requests
    const now = Date.now()
    if (now - lastRequestTimeRef.current < DEBOUNCE_DELAY) {
      console.log('Request debounced, too soon since last request')
      return
    }
    lastRequestTimeRef.current = now

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    isRequestInProgressRef.current = true

    try {
      setIsLoading(true)
      setError(null)

      console.log(`Fetching history for page ${page}...`)

      // Create cache key
      const cacheKey = `history-${page}-${pageSize}`

      // Check if we have a cached request
      let resultPromise = globalRequestCache.get(cacheKey)

      if (!resultPromise) {
        // Create new request and cache it
        resultPromise = AuthenticatedAPI.getLinkHistory(page, pageSize)
        globalRequestCache.set(cacheKey, resultPromise)

        // Clear cache after duration
        setTimeout(() => {
          globalRequestCache.delete(cacheKey)
        }, CACHE_DURATION)
      } else {
        console.log('Using cached request for', cacheKey)
      }

      const result = await resultPromise

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Request was aborted')
        return
      }

      if (result) {
        setConversions(result.conversions)
        setCurrentPage(page)

        // Calculate pagination info
        const totalItems = result.conversions.length
        const calculatedTotalPages = Math.ceil(totalItems / pageSize)
        setTotalPages(calculatedTotalPages)
        setHasMore(page < calculatedTotalPages)
        setHasFetched(true)
        console.log(`Successfully fetched ${result.conversions.length} conversions`)
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch history:', err)
        setError(err)
      }
    } finally {
      setIsLoading(false)
      isRequestInProgressRef.current = false
      abortControllerRef.current = null
    }
  }, [pageSize]) // Remove api dependency to prevent re-renders

  const refresh = useCallback(async () => {
    console.log('Refreshing history...')
    setCurrentPage(1)
    setHasFetched(false) // Reset to allow refetch
    await fetchHistory(1)
  }, [fetchHistory])

  const filterByStatus = useCallback((status: ProcessingStatus | 'all'): Conversion[] => {
    if (status === 'all') {
      return conversions
    }
    return conversions.filter(conversion => conversion.processing_status === status)
  }, [conversions])

  // Auto-fetch on mount if enabled - use a ref to prevent dependency issues
  useEffect(() => {
    if (autoFetch && !hasFetched && !isRequestInProgressRef.current) {
      console.log('Auto-fetching history on mount...')
      fetchHistory(1)
    }
  }, [autoFetch, hasFetched]) // Remove fetchHistory dependency

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    conversions,
    isLoading,
    error,
    currentPage,
    totalPages,
    hasMore,
    fetchHistory,
    refresh,
    filterByStatus
  }
}
