import { useState, useCallback } from 'react';
import { PaymentRequest, PaymentResponse, API_CONFIG } from '@/types/api';
import { AuthenticatedAPI } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

interface UsePaymentReturn {
  isLoading: boolean;
  error: string | null;
  createPaymentSession: (subscriptionName: string) => Promise<void>;
  redirectToPayment: (subscriptionName: string) => Promise<void>;
}

export function usePayment(): UsePaymentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const createPaymentSession = useCallback(async (subscriptionName: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to create payment session');
    }

    try {
      setIsLoading(true);
      setError(null);

      const paymentRequest: PaymentRequest = {
        subscription_name: subscriptionName
      };

      const response = await AuthenticatedAPI.makeRequest<PaymentResponse>(
        API_CONFIG.ENDPOINTS.SUBSCRIPTION_PAYMENT,
        {
          method: 'POST',
          body: JSON.stringify(paymentRequest),
        }
      );

      // Redirect to payment URL
      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error('No checkout URL received from payment API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment session';
      setError(errorMessage);
      console.error('Payment session creation failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const redirectToPayment = useCallback(async (subscriptionName: string): Promise<void> => {
    try {
      await createPaymentSession(subscriptionName);
    } catch (err) {
      // Error is already handled in createPaymentSession
      console.error('Payment redirect failed:', err);
    }
  }, [createPaymentSession]);

  return {
    isLoading,
    error,
    createPaymentSession,
    redirectToPayment,
  };
}

/**
 * Hook for handling payment flow with authentication check
 * If user is not authenticated, shows auth dialog first, then redirects to payment
 */
export function usePaymentFlow(): {
  isLoading: boolean;
  error: string | null;
  initiatePayment: (subscriptionName: string, onAuthRequired?: () => void) => Promise<void>;
} {
  const { isLoading, error, redirectToPayment } = usePayment();
  const { isAuthenticated } = useAuth();

  const initiatePayment = useCallback(async (
    subscriptionName: string, 
    onAuthRequired?: () => void
  ): Promise<void> => {
    if (!isAuthenticated) {
      // User needs to authenticate first
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    // User is authenticated, proceed with payment
    await redirectToPayment(subscriptionName);
  }, [isAuthenticated, redirectToPayment]);

  return {
    isLoading,
    error,
    initiatePayment,
  };
}
