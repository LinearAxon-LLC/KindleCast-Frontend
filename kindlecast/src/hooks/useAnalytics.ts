import { useCallback } from 'react'
import { 
  trackEvent, 
  identifyUser, 
  resetUser, 
  getFeatureFlag,
  isAnalyticsWorking,
  getAnalyticsStatus 
} from '@/lib/analytics'

export function useAnalytics() {
  // Track custom events
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    trackEvent(eventName, properties)
  }, [])

  // Track user actions
  const trackUserAction = useCallback((action: string, context?: Record<string, any>) => {
    trackEvent('user_action', {
      action,
      ...context,
    })
  }, [])

  // Track conversion events
  const trackConversion = useCallback((conversionType: string, properties?: Record<string, any>) => {
    trackEvent('conversion', {
      conversion_type: conversionType,
      ...properties,
    })
  }, [])

  // Track authentication events
  const trackAuth = useCallback((authEvent: 'login' | 'logout' | 'signup', method?: string) => {
    trackEvent(`user_${authEvent}`, {
      auth_method: method,
      timestamp: new Date().toISOString(),
    })
  }, [])

  // Track subscription events
  const trackSubscription = useCallback((subscriptionEvent: string, properties?: Record<string, any>) => {
    trackEvent('subscription_event', {
      subscription_event: subscriptionEvent,
      ...properties,
    })
  }, [])

  // Track device configuration
  const trackDeviceConfig = useCallback((configEvent: string, properties?: Record<string, any>) => {
    trackEvent('device_config', {
      config_event: configEvent,
      ...properties,
    })
  }, [])

  // Track content conversion
  const trackContentConversion = useCallback((properties: Record<string, any>) => {
    trackEvent('content_conversion', {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  }, [])

  // Track errors
  const trackError = useCallback((errorType: string, errorDetails?: Record<string, any>) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      ...errorDetails,
      timestamp: new Date().toISOString(),
    })
  }, [])

  // Track performance metrics
  const trackPerformance = useCallback((metric: string, value: number, context?: Record<string, any>) => {
    trackEvent('performance_metric', {
      metric_name: metric,
      metric_value: value,
      ...context,
    })
  }, [])

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string, properties?: Record<string, any>) => {
    trackEvent('feature_used', {
      feature_name: feature,
      ...properties,
    })
  }, [])

  // Identify user
  const identify = useCallback((userId: string, userProperties?: Record<string, any>) => {
    identifyUser(userId, userProperties)
  }, [])

  // Reset user (logout)
  const reset = useCallback(() => {
    resetUser()
  }, [])

  // Get feature flag
  const getFlag = useCallback((flagName: string, defaultValue?: any) => {
    return getFeatureFlag(flagName, defaultValue)
  }, [])

  // Check if analytics is working
  const isWorking = useCallback(() => {
    return isAnalyticsWorking()
  }, [])

  // Get analytics status
  const getStatus = useCallback(() => {
    return getAnalyticsStatus()
  }, [])

  return {
    // Core tracking
    track,
    identify,
    reset,
    
    // Specific event tracking
    trackUserAction,
    trackConversion,
    trackAuth,
    trackSubscription,
    trackDeviceConfig,
    trackContentConversion,
    trackError,
    trackPerformance,
    trackFeatureUsage,
    
    // Feature flags
    getFlag,
    
    // Status
    isWorking,
    getStatus,
  }
}
