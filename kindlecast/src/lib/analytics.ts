import posthog from 'posthog-js'

// PostHog configuration
const POSTHOG_KEY = 'phc_DFvx3polM4OK4KVRm7tkezLzJvdf3dxrOQ0q5iuWfr4'
const POSTHOG_HOST = 'https://us.i.posthog.com'

// Our proxy endpoints to bypass ad blockers
const PROXY_HOST = '/api/analytics'
const PROXY_INGEST = '/api/analytics/ingest'

let isInitialized = false
let isBlocked = false

// Initialize PostHog with fallback mechanisms
export function initializeAnalytics() {
  if (typeof window === 'undefined' || isInitialized) return

  try {
    // First, try to initialize with our proxy
    posthog.init(POSTHOG_KEY, {
      api_host: PROXY_HOST,
      ui_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          email: false,
        },
      },
      loaded: (posthog) => {
        console.log('PostHog loaded successfully via proxy')
        isInitialized = true
        isBlocked = false
        
        // Capture initial page view
        capturePageView()
      },
      // Fallback configuration
      bootstrap: {
        distinctID: generateFallbackId(),
      },
    })

    // Test if PostHog is working
    setTimeout(() => {
      if (!isInitialized) {
        console.warn('PostHog proxy failed, trying direct connection...')
        initializeFallback()
      }
    }, 3000)

  } catch (error) {
    console.warn('PostHog initialization failed:', error)
    initializeFallback()
  }
}

// Fallback initialization with direct PostHog
function initializeFallback() {
  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      loaded: (posthog) => {
        console.log('PostHog loaded via direct connection')
        isInitialized = true
        isBlocked = false
        capturePageView()
      },
    })
  } catch (error) {
    console.error('PostHog fallback failed:', error)
    isBlocked = true
    // Use server-side tracking as last resort
    trackViaServer('analytics_blocked', { reason: 'client_blocked' })
  }
}

// Generate a fallback ID for blocked users
function generateFallbackId(): string {
  const stored = localStorage.getItem('kinddy_fallback_id')
  if (stored) return stored

  const id = 'fallback_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  localStorage.setItem('kinddy_fallback_id', id)
  return id
}

// Enhanced tracking functions with fallback
export function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  const eventData = {
    ...properties,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
  }

  if (isInitialized && !isBlocked) {
    try {
      posthog.capture(eventName, eventData)
    } catch (error) {
      console.warn('PostHog tracking failed, using server fallback:', error)
      trackViaServer(eventName, eventData)
    }
  } else {
    // Use server-side tracking
    trackViaServer(eventName, eventData)
  }
}

// Server-side tracking fallback
async function trackViaServer(eventName: string, properties: Record<string, any>) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        properties,
        distinct_id: generateFallbackId(),
      }),
    })
  } catch (error) {
    console.error('Server-side tracking failed:', error)
    // Store in localStorage for retry later
    storeEventForRetry(eventName, properties)
  }
}

// Store failed events for retry
function storeEventForRetry(eventName: string, properties: Record<string, any>) {
  try {
    const stored = JSON.parse(localStorage.getItem('kinddy_pending_events') || '[]')
    stored.push({ event: eventName, properties, timestamp: Date.now() })
    
    // Keep only last 50 events to avoid storage bloat
    if (stored.length > 50) {
      stored.splice(0, stored.length - 50)
    }
    
    localStorage.setItem('kinddy_pending_events', JSON.stringify(stored))
  } catch (error) {
    console.error('Failed to store event for retry:', error)
  }
}

// Retry failed events
export function retryFailedEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem('kinddy_pending_events') || '[]')
    if (stored.length === 0) return

    stored.forEach(({ event, properties }: any) => {
      trackEvent(event, { ...properties, retried: true })
    })

    localStorage.removeItem('kinddy_pending_events')
  } catch (error) {
    console.error('Failed to retry events:', error)
  }
}

// Page view tracking
export function capturePageView(properties: Record<string, any> = {}) {
  trackEvent('$pageview', {
    ...properties,
    $current_url: window.location.href,
    $host: window.location.host,
    $pathname: window.location.pathname,
    $search: window.location.search,
    title: document.title,
  })
}

// User identification
export function identifyUser(userId: string, properties: Record<string, any> = {}) {
  if (isInitialized && !isBlocked) {
    try {
      posthog.identify(userId, properties)
    } catch (error) {
      console.warn('PostHog identify failed:', error)
    }
  }
  
  // Always track via server as backup
  trackViaServer('$identify', { distinct_id: userId, ...properties })
}

// Reset user (for logout)
export function resetUser() {
  if (isInitialized && !isBlocked) {
    try {
      posthog.reset()
    } catch (error) {
      console.warn('PostHog reset failed:', error)
    }
  }
  
  localStorage.removeItem('kinddy_fallback_id')
  trackEvent('user_logout')
}

// Feature flag support
export function getFeatureFlag(flagName: string, defaultValue: any = false) {
  if (isInitialized && !isBlocked) {
    try {
      return posthog.getFeatureFlag(flagName) ?? defaultValue
    } catch (error) {
      console.warn('PostHog feature flag failed:', error)
    }
  }
  return defaultValue
}

// Check if analytics is working
export function isAnalyticsWorking(): boolean {
  return isInitialized && !isBlocked
}

// Get analytics status
export function getAnalyticsStatus() {
  return {
    initialized: isInitialized,
    blocked: isBlocked,
    method: isBlocked ? 'server' : isInitialized ? 'client' : 'none'
  }
}
