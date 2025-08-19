// Authentication service for KindleCast
import { API_CONFIG, AuthTokens, User, AuthResponse, RefreshTokenRequest, RefreshTokenResponse, APIException, ConversionsResponse } from '@/types/api';

// Re-export types and utilities for other modules
export { APIException } from '@/types/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'kindlecast_access_token';
const REFRESH_TOKEN_KEY = 'kindlecast_refresh_token';
const TOKEN_EXPIRY_KEY = 'kindlecast_token_expiry';

// Token management utilities
export class TokenManager {
  static setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    
    const expiryTime = Date.now() + (tokens.expires_in * 1000);
    
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    
    return Date.now() >= parseInt(expiryTime) - 60000; // 1 minute buffer
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  static hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

// API request utilities with automatic token refresh
export class AuthenticatedAPI {
  static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true,
    isRetryAfterRefresh: boolean = false
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // Get caller information from stack trace
    const stack = new Error().stack;
    const callerLine = stack?.split('\n')[3] || 'Unknown caller';
    const callerInfo = callerLine.trim().replace(/^at\s+/, '');

    // Log API call details
    console.log(`🌐 API CALL: ${options.method || 'GET'} ${url}`);
    console.log(`📍 Called from: ${callerInfo}`);
    console.log(`🔐 Requires Auth: ${requireAuth}`);

    // Add auth header if required and available
    if (requireAuth) {
      let accessToken = TokenManager.getAccessToken();
      
      // Refresh token if expired
      if (accessToken && TokenManager.isTokenExpired()) {
        try {
          await this.refreshToken();
          accessToken = TokenManager.getAccessToken();
        } catch (error) {
          TokenManager.clearTokens();
          throw new APIException('Session expired. Please log in again.', 401, 'authentication');
        }
      }
      
      if (!accessToken) {
        throw new APIException('Authentication required', 401, 'authentication');
      }
      
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
    }

    // Add default headers
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, options);
      
      // Handle different error types
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        
        let errorType: APIException['errorType'] = 'server_error';
        
        switch (response.status) {
          case 401:
            errorType = 'authentication';

            // Try to refresh token if we haven't already tried and have a refresh token
            if (!isRetryAfterRefresh && requireAuth && TokenManager.getRefreshToken()) {
              try {
                await this.refreshToken();
                // Retry the original request with the new token
                return await this.makeRequest<T>(endpoint, options, requireAuth, true);
              } catch (refreshError) {
                // Refresh failed, clear tokens and continue with original error
                TokenManager.clearTokens();
              }
            } else {
              // Either already retried or no refresh token available
              TokenManager.clearTokens();
            }
            break;
          case 403:
            errorType = 'authorization';
            break;
          case 422:
            errorType = 'validation';
            break;
          case 429:
            errorType = 'rate_limit';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorType = 'server_error';
            break;
        }

        throw new APIException(
          errorData.detail || `HTTP ${response.status}`,
          response.status,
          errorType
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIException) {
        throw error;
      }
      
      // Network or other errors
      throw new APIException(
        'Connection failed. Please check your internet connection.',
        0,
        'network_error'
      );
    }
  }

  static async refreshToken(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new APIException('No refresh token available', 401, 'authentication');
    }

    const response = await this.makeRequest<RefreshTokenResponse>(
      API_CONFIG.ENDPOINTS.AUTH_REFRESH,
      {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken } as RefreshTokenRequest),
      },
      false // Don't require auth for refresh
    );

    // Update tokens
    TokenManager.setTokens({
      access_token: response.access_token,
      refresh_token: refreshToken, // Keep existing refresh token
      token_type: response.token_type,
      expires_in: response.expires_in,
    });
  }

  static async getCurrentUser(): Promise<User> {
    return await this.makeRequest<User>(API_CONFIG.ENDPOINTS.AUTH_ME);
  }

  static async getAuthStatus(): Promise<AuthResponse> {
    return await this.makeRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH_STATUS,
      {},
      false // Don't require auth for status check
    );
  }

  static async logout(): Promise<void> {
    try {
      await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH_LOGOUT, { method: 'POST' });
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      TokenManager.clearTokens();
    }
  }

  static async getLinkHistory(page: number = 1, pageSize: number = 10): Promise<ConversionsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    });

    return await this.makeRequest<ConversionsResponse>(
      `${API_CONFIG.ENDPOINTS.LINK_HISTORY}?${params.toString()}`
    );
  }

  static async getCustomerBillingPortal(): Promise<{ url: string }> {
    return await this.makeRequest<{ url: string }>(
      API_CONFIG.ENDPOINTS.CUSTOMER_BILLING_PORTAL,
      { method: 'GET' }
    );
  }
}

// OAuth utilities
export class OAuthManager {
  static initiateGoogleLogin(): void {
    const authUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_GOOGLE}`;
    window.location.href = authUrl;
  }

  static initiateTwitterLogin(): void {
    const authUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_TWITTER}`;
    window.location.href = authUrl;
  }

  static initiateAppleLogin(): void {
    const authUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_APPLE}`;
    window.location.href = authUrl;
  }

  static initiateEmailLogin(): void {
    const authUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_EMAIL}`;
    window.location.href = authUrl;
  }

  static handleOAuthCallback(): AuthTokens | null {
    if (typeof window === 'undefined') return null;

    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;

    // Skip OAuth handling if we're on the auth success page
    // The auth success page will handle token extraction and storage
    if (currentPath === '/auth/success') {
      return null;
    }

    // Check for OAuth errors first
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      console.error('OAuth error:', error, errorDescription);
      // Clean up URL and throw error
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      throw new APIException(
        errorDescription || `OAuth ${error}`,
        400,
        'authentication'
      );
    }

    // Check for successful OAuth tokens (legacy handling for direct redirects)
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const expiresIn = urlParams.get('expires_in');
    const tokenType = urlParams.get('token_type');

    if (accessToken && refreshToken && expiresIn) {
      const tokens: AuthTokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: parseInt(expiresIn),
        token_type: tokenType || 'bearer',
      };

      TokenManager.setTokens(tokens);

      // Clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      return tokens;
    }

    return null;
  }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIException) {
    switch (error.errorType) {
      case 'authentication':
        return 'Please sign in to continue';
      case 'authorization':
        return 'You don\'t have permission to perform this action';
      case 'rate_limit':
        return 'Too many requests. Please try again later';
      case 'server_error':
        return 'Service temporarily unavailable. Please try again';
      case 'network_error':
        return 'Connection failed. Please check your internet connection';
      case 'validation':
        return error.message;
      default:
        return 'An unexpected error occurred';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function shouldRetry(error: unknown): boolean {
  if (error instanceof APIException) {
    return error.errorType === 'network_error' || error.errorType === 'server_error';
  }
  return false;
}
