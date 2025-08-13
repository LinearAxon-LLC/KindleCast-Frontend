import { useState, useEffect, useCallback } from 'react';
import { SubscriptionPlan, API_CONFIG } from '@/types/api';
import { AuthenticatedAPI } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

interface UsePricingPlansReturn {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getUserCurrentPlan: (userSubscriptionName?: string) => SubscriptionPlan | null;
  isUserCurrentPlan: (planName: string, userSubscriptionName?: string) => boolean;
}

export function usePricingPlans(): UsePricingPlansReturn {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPricingPlans = useCallback(async (): Promise<SubscriptionPlan[]> => {
    // Make API call without authentication requirement
    const response = await AuthenticatedAPI.makeRequest<SubscriptionPlan[]>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTION_PLANS,
      {},
      false // Don't require auth for pricing plans
    );
    
    return response;
  }, []);

  const loadPricingPlans = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simple fetch without caching for now
      const plansData = await fetchPricingPlans();

      if (plansData && plansData.length > 0) {
        // Data is already sorted by price in ascending order from backend
        setPlans(plansData);
      } else {
        // Fallback to default plans if no data available
        setPlans(getDefaultPlans());
        setError('Using default pricing. Please check your connection.');
      }
    } catch (err) {
      console.error('Failed to load pricing plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pricing plans');

      // Use default plans as final fallback
      setPlans(getDefaultPlans());
    } finally {
      setIsLoading(false);
    }
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

/**
 * Default pricing plans as fallback when API is unavailable
 */
function getDefaultPlans(): SubscriptionPlan[] {
  return [
    {
      name: 'free-default',
      display_name: 'Free',
      is_most_popular: true,
      subscription_type: 'free',
      original_price: 0,
      discounted_price: 0,
      billing_cycle: 'monthly',
      features: [
        '5 Basic Epub conversion per month',
        '3 AI Formatting per month',
        '20 days data retention'
      ]
    },
    {
      name: 'premium-default',
      display_name: 'Premium',
      is_most_popular: false,
      subscription_type: 'premium',
      original_price: 14.99,
      discounted_price: 9.99,
      billing_cycle: 'monthly',
      features: [
        'Unlimited Basic Epub conversion per month',
        '100 AI (improved) Formatting per month',
        '120 days data retention',
        'Personal mail for auto newsletter forwarding'
      ]
    }
  ];
}
