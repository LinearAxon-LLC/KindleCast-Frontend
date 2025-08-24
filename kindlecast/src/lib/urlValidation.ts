export interface URLValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
}

export interface URLExistenceResult {
  exists: boolean;
  error?: string;
  status?: number;
}

// Basic URL format validation
export function validateURLFormat(url: string): URLValidationResult {
  if (!url || url.trim().length === 0) {
    return {
      isValid: false,
      error: "URL cannot be empty"
    };
  }

  const trimmedUrl = url.trim();

  // Check if URL starts with http:// or https://
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return {
      isValid: false,
      error: "URL must start with http:// or https://"
    };
  }

  try {
    const urlObj = new URL(trimmedUrl);
    
    // Additional validation checks
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return {
        isValid: false,
        error: "Invalid hostname"
      };
    }

    // Check for valid hostname format (basic check)
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!hostnameRegex.test(urlObj.hostname)) {
      return {
        isValid: false,
        error: "Invalid hostname format"
      };
    }

    return {
      isValid: true,
      normalizedUrl: urlObj.toString()
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid URL format"
    };
  }
}

// Check if URL exists by making a HEAD request
export async function checkURLExists(url: string): Promise<URLExistenceResult> {
  try {
    // Use a proxy or CORS-enabled service for client-side URL checking
    // For now, we'll use a simple fetch with no-cors mode to avoid CORS issues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors', // This will limit what we can check, but avoids CORS
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);

      // With no-cors mode, we can't read the status, but if it doesn't throw, the URL likely exists
      return {
        exists: true,
        status: 0 // Can't read actual status with no-cors
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return {
            exists: false,
            error: "Request timeout - URL may not exist or is too slow to respond"
          };
        }
        
        // Network errors usually mean the URL doesn't exist or is unreachable
        return {
          exists: false,
          error: "URL appears to be unreachable"
        };
      }
      
      return {
        exists: false,
        error: "Unknown error checking URL"
      };
    }
  } catch (error) {
    return {
      exists: false,
      error: error instanceof Error ? error.message : "Failed to check URL existence"
    };
  }
}

// Combined validation function
export async function validateURL(url: string): Promise<URLValidationResult & { exists?: boolean }> {
  // First check format
  const formatResult = validateURLFormat(url);
  if (!formatResult.isValid) {
    return formatResult;
  }

  // Then check existence
  const existenceResult = await checkURLExists(formatResult.normalizedUrl!);
  
  return {
    isValid: formatResult.isValid && existenceResult.exists,
    error: existenceResult.exists ? undefined : existenceResult.error,
    normalizedUrl: formatResult.normalizedUrl,
    exists: existenceResult.exists
  };
}

// Debounced validation hook for real-time validation
export function useURLValidation() {
  const [validationState, setValidationState] = React.useState<{
    isValidating: boolean;
    isValid: boolean;
    error?: string;
    normalizedUrl?: string;
  }>({
    isValidating: false,
    isValid: false
  });

  const validateURLDebounced = React.useCallback(
    debounce(async (url: string) => {
      if (!url.trim()) {
        setValidationState({
          isValidating: false,
          isValid: false,
          error: "URL cannot be empty"
        });
        return;
      }

      setValidationState(prev => ({ ...prev, isValidating: true }));

      try {
        const result = await validateURL(url);
        setValidationState({
          isValidating: false,
          isValid: result.isValid,
          error: result.error,
          normalizedUrl: result.normalizedUrl
        });
      } catch (error) {
        setValidationState({
          isValidating: false,
          isValid: false,
          error: "Validation failed"
        });
      }
    }, 1000), // 1 second debounce
    []
  );

  return {
    ...validationState,
    validateURL: validateURLDebounced
  };
}

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// React import (will be available in components)
import React from 'react';
