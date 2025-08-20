'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  initializeAnalytics,
  capturePageView,
  retryFailedEvents,
  trackEvent,
  getAnalyticsStatus
} from '@/lib/analytics'

function PostHogProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize PostHog on mount
  useEffect(() => {
    initializeAnalytics()
    
    // Retry any failed events from previous sessions
    setTimeout(() => {
      retryFailedEvents()
    }, 2000)

    // Track initial load
    trackEvent('app_loaded', {
      initial_page: pathname,
      search_params: searchParams.toString(),
    })

    // Log analytics status for debugging
    setTimeout(() => {
      const status = getAnalyticsStatus()
      console.log('Analytics Status:', status)
      
      if (status.blocked) {
        console.warn('Analytics blocked - using server-side tracking')
      }
    }, 3000)
  }, [])

  // Track page views on route changes
  useEffect(() => {
    capturePageView({
      pathname,
      search_params: searchParams.toString(),
    })
  }, [pathname, searchParams])

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackEvent('page_visible', { pathname })
      } else {
        trackEvent('page_hidden', { pathname })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [pathname])

  // Track errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno,
        pathname,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackEvent('unhandled_promise_rejection', {
        error_reason: event.reason?.toString() || 'Unknown',
        pathname,
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [pathname])

  return <>{children}</>
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <PostHogProviderInner>{children}</PostHogProviderInner>
    </Suspense>
  )
}
