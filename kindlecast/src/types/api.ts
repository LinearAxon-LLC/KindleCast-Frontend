// API types matching the backend Pydantic models

export interface LinkProcessRequest {
  url: string;
  format: string; // "epub", "summarize", "learning", "custom"
  custom_prompt?: string;
}

export interface LinkProcessResponse {
  status: boolean;
  message: string;
}

// Frontend format mapping
export const FORMAT_MAPPING: Record<string, string> = {
  'Just PDF': 'epub',
  'Summarize': 'summarize', 
  'Learning Ready': 'learning',
  'Custom': 'custom'
};

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.kindlecast.com'
    : 'http://localhost:8000',
  ENDPOINTS: {
    PROCESS_LINK: '/api/v1/link/process',
    // Auth endpoints - matching your FastAPI routes
    AUTH_GOOGLE: '/api/v1/auth/google',
    AUTH_AMAZON: '/api/v1/auth/amazon',
    AUTH_REFRESH: '/api/v1/auth/refresh',
    AUTH_ME: '/api/v1/auth/me',
    AUTH_STATUS: '/api/v1/auth/status',
    AUTH_LOGOUT: '/api/v1/auth/logout'
  }
} as const;

// Authentication types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'google' | 'amazon';
  avatar?: string;
  created_at: string;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// API Error types
export interface APIError {
  detail: string;
  status_code: number;
  error_type: 'validation' | 'authentication' | 'authorization' | 'rate_limit' | 'server_error' | 'network_error';
}

export class APIException extends Error {
  public statusCode: number;
  public errorType: APIError['error_type'];

  constructor(message: string, statusCode: number, errorType: APIError['error_type']) {
    super(message);
    this.name = 'APIException';
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}
