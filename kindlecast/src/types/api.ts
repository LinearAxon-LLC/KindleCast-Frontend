// API types matching the backend Pydantic models

export interface LinkProcessRequest {
  url: string;
  format: string; // "epub", "summarize", "learning", "custom"
  custom_prompt?: string;
  include_image?: boolean;
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
    AUTH_TWITTER: '/api/v1/auth/x',
    AUTH_APPLE: '/api/v1/auth/apple',
    AUTH_EMAIL: '/api/v1/auth/email',
    AUTH_REFRESH: '/api/v1/auth/refresh',
    AUTH_ME: '/api/v1/auth/me',
    AUTH_STATUS: '/api/v1/auth/status',
    AUTH_LOGOUT: '/api/v1/auth/logout',
    // Subscription endpoints
    SUBSCRIPTION_PLANS: '/api/v1/subscription/plans',
    SUBSCRIPTION_PAYMENT: '/api/v1/subscription/payment',
    SUBSCRIPTION_USAGE: '/api/v1/subscription/me',
    // User info update
    USER_INFO_UPDATE: '/api/v1/user/info-update'
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
  provider: 'google' | 'twitter' | 'apple' | 'email';
  avatar?: string;
  created_at: string;
  subscription_name?: string;
  subscription_type?: string;
}

// User profile types (from /me endpoint)
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  provider: string;
  avatar: string;
  kindle_email?: string;
  custom_email?: string;
  acknowledged_mail_whitelisting?: string;
  subscription_name?: string;
  subscription_type?: string;
  user_subscribed: boolean;
  set_up_device: boolean;
  basic_conversions?: number;
  ai_conversions?: number;
  config?: {
    basic_conversions_limit?: number;
    ai_conversions_limit?: number;
  };
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

// Subscription Plan types
export interface SubscriptionPlan {
  name: string;
  display_name: string;
  is_most_popular: boolean;
  subscription_type: 'free' | 'premium';
  original_price: number;
  discounted_price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
}

export interface SubscriptionPlansResponse {
  plans: SubscriptionPlan[];
}

// Payment types
export interface PaymentRequest {
  subscription_name: string;
}

export interface PaymentResponse {
  checkout_url: string;
}

// User usage types
export interface UserUsageResponse {
  basic_monthly_limit: number;
  ai_monthly_limit: number;
  used_basic_monthly: number;
  used_ai_monthly: number;
}

// User info update types
export interface UserInformationUpdateRequest {
  kindle_email?: string;
  mail_whitelisting_acknowledged?: string;
}

export interface UserInformationUpdateResponse {
  status: boolean;
  message: string;
}
