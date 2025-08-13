import { useState, useCallback } from 'react';
import { UserInformationUpdateRequest, UserInformationUpdateResponse, API_CONFIG } from '@/types/api';
import { AuthenticatedAPI } from '@/lib/auth';

interface UseInfoUpdateReturn {
  isLoading: boolean;
  error: string | null;
  updateUserInfo: (data: UserInformationUpdateRequest) => Promise<UserInformationUpdateResponse | null>;
}

export function useInfoUpdate(): UseInfoUpdateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserInfo = useCallback(async (data: UserInformationUpdateRequest): Promise<UserInformationUpdateResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await AuthenticatedAPI.makeRequest<UserInformationUpdateResponse>(
        API_CONFIG.ENDPOINTS.USER_INFO_UPDATE,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user information';
      setError(errorMessage);
      console.error('Info update failed:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    updateUserInfo,
  };
}
