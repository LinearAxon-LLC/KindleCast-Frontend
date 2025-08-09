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
  BASE_URL: 'https://api.kindlecast.com/api',
  ENDPOINTS: {
    PROCESS_LINK: '/v1/link/process'
  }
} as const;
