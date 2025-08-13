import { useState, useEffect, useCallback } from 'react';
import { SubscriptionPlan, API_CONFIG } from '@/types/api';
import { AuthenticatedAPI } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

// Global singleton to prevent multiple API calls
let globalPlans: SubscriptionPlan[] = []
let globalIsLoading = false
let globalError: string | null = null
let isCurrentlyFetching = false
let fetchPromise: Promise<void> | null = null

interface UsePricingPlansReturn {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getUserCurrentPlan: (userSubscriptionName?: string) => SubscriptionPlan | null;
  isUserCurrentPlan: (planName: string, userSubscriptionName?: string) => boolean;
}

export function usePricingPlans(): UsePricingPlansReturn {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(globalPlans);
  const [isLoading, setIsLoading] = useState(globalIsLoading);
  const [error, setError] = useState<string | null>(globalError);
  const { user } = useAuth();

  const fetchPricingPlans = useCallback(async (): Promise<void> => {
    // If already fetching, wait for the existing promise
    if (fetchPromise) {
      await fetchPromise
      setPlans(globalPlans)
      setIsLoading(globalIsLoading)
      setError(globalError)
      return
    }

    // If we already have data, use it
    if (globalPlans.length > 0) {
      setPlans(globalPlans)
      setIsLoading(false)
      setError(globalError)
      return
    }

    // Create single fetch promise
    fetchPromise = (async () => {
      try {
        globalIsLoading = true
        isCurrentlyFetching = true

        console.log('🔍 usePricingPlans: Making SINGLE API call to /subscription/plans')

        const response = await AuthenticatedAPI.makeRequest<SubscriptionPlan[]>(
          API_CONFIG.ENDPOINTS.SUBSCRIPTION_PLANS,
          {},
          false // Don't require auth for pricing plans
        );

        globalPlans = response
        globalError = null
        globalIsLoading = false
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load pricing plans'
        globalError = errorMsg
        globalPlans = []
        globalIsLoading = false
      } finally {
        isCurrentlyFetching = false
        fetchPromise = null
      }
    })()

    await fetchPromise

    // Update local state
    setPlans(globalPlans)
    setIsLoading(globalIsLoading)
    setError(globalError)
  }, []);

  const loadPricingPlans = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      // Reset global state for force refresh
      globalPlans = []
      globalIsLoading = false
      globalError = null
      fetchPromise = null
    }

    await fetchPricingPlans()
  }, [fetchPricingPlans]);

  const refresh = useCallback(async () => {
    await loadPricingPlans(true);
  }, [loadPricingPlans]);

  const getUserCurrentPlan = useCallback((userSubscriptionName?: string): SubscriptionPlan | null => {
    const subscriptionName = userSubscriptionName || user?.subscription_name;
    if (!subscriptionName) return null;

    return plans.find(plan => plan.name === subscriptionName) || null;
  }, [plans, user?.subscription_name]);

  const isUserCurrentPlan = useCallback((planName: string, userSubscriptionName?: string): boolean => {
    const subscriptionName = userSubscriptionName || user?.subscription_name;
    return subscriptionName === planName;
  }, [user?.subscription_name]);

  // Load pricing plans on mount
  useEffect(() => {
    loadPricingPlans();
  }, [loadPricingPlans]);

  return {
    plans,
    isLoading,
    error,
    refresh,
    getUserCurrentPlan,
    isUserCurrentPlan,
  };
}

// No more mock data - all data comes from real API
