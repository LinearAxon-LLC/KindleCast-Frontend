import { useState, useEffect, useCallback } from 'react';
import { UserUsageResponse, API_CONFIG } from '@/types/api';
import { AuthenticatedAPI } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

// Global singleton to prevent multiple API calls
let globalUsage: UserUsageResponse | null = null
let globalIsLoading = false
let globalError: string | null = null
let isCurrentlyFetching = false
let fetchPromise: Promise<void> | null = null

interface UseUserUsageReturn {
  usage: UserUsageResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getUsagePercentage: (type: 'basic' | 'ai') => number;
  isUnlimited: (type: 'basic' | 'ai') => boolean;
  getRemainingUsage: (type: 'basic' | 'ai') => number;
}

export function useUserUsage(): UseUserUsageReturn {
  const [usage, setUsage] = useState<UserUsageResponse | null>(globalUsage);
  const [isLoading, setIsLoading] = useState(globalIsLoading);
  const [error, setError] = useState<string | null>(globalError);
  const { isAuthenticated } = useAuth();

  const fetchUsage = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      setUsage(null);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await AuthenticatedAPI.makeRequest<UserUsageResponse>(
        API_CONFIG.ENDPOINTS.SUBSCRIPTION_USAGE,
        {
          method: 'GET',
        }
      );

      setUsage(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch usage data';
      setError(errorMessage);
      console.error('Usage fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Auto-fetch on mount and auth changes
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Helper function to get usage percentage
  const getUsagePercentage = useCallback((type: 'basic' | 'ai'): number => {
    if (!usage) return 0;
    
    const limit = type === 'basic' ? usage.basic_monthly_limit : usage.ai_monthly_limit;
    const used = type === 'basic' ? usage.used_basic_monthly : usage.used_ai_monthly;
    
    // If limit is -1, it means unlimited
    if (limit === -1) return 0;
    
    // Prevent division by zero
    if (limit === 0) return 100;
    
    return Math.min((used / limit) * 100, 100);
  }, [usage]);

  // Helper function to check if usage is unlimited
  const isUnlimited = useCallback((type: 'basic' | 'ai'): boolean => {
    if (!usage) return false;
    
    const limit = type === 'basic' ? usage.basic_monthly_limit : usage.ai_monthly_limit;
    return limit === -1;
  }, [usage]);

  // Helper function to get remaining usage
  const getRemainingUsage = useCallback((type: 'basic' | 'ai'): number => {
    if (!usage) return 0;
    
    const limit = type === 'basic' ? usage.basic_monthly_limit : usage.ai_monthly_limit;
    const used = type === 'basic' ? usage.used_basic_monthly : usage.used_ai_monthly;
    
    // If unlimited, return -1 to indicate unlimited
    if (limit === -1) return -1;
    
    return Math.max(limit - used, 0);
  }, [usage]);

  return {
    usage,
    isLoading,
    error,
    refetch: fetchUsage,
    getUsagePercentage,
    isUnlimited,
    getRemainingUsage,
  };
}

/**
 * Hook for getting formatted usage display strings
 */
export function useUsageDisplay() {
  const { usage, getUsagePercentage, isUnlimited, getRemainingUsage } = useUserUsage();

  const formatUsageText = useCallback((type: 'basic' | 'ai'): string => {
    if (!usage) return 'Loading...';
    
    const used = type === 'basic' ? usage.used_basic_monthly : usage.used_ai_monthly;
    const limit = type === 'basic' ? usage.basic_monthly_limit : usage.ai_monthly_limit;
    
    if (limit === -1) {
      return `${used} used (Unlimited)`;
    }
    
    return `${used} / ${limit} used`;
  }, [usage]);

  const getUsageStatus = useCallback((type: 'basic' | 'ai'): 'low' | 'medium' | 'high' | 'unlimited' => {
    if (isUnlimited(type)) return 'unlimited';
    
    const percentage = getUsagePercentage(type);
    
    if (percentage >= 90) return 'high';
    if (percentage >= 70) return 'medium';
    return 'low';
  }, [getUsagePercentage, isUnlimited]);

  return {
    usage,
    formatUsageText,
    getUsageStatus,
    getUsagePercentage,
    isUnlimited,
    getRemainingUsage,
  };
}
