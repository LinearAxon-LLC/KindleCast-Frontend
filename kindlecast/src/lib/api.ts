// API utilities for KindleCast

import { LinkProcessRequest, LinkProcessResponse, API_CONFIG } from '@/types/api';

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates the link processing request
 */
export function validateLinkRequest(url: string, format: string, customPrompt?: string): string | null {
  // Check if URL is provided
  if (!url.trim()) {
    return 'Please enter a URL';
  }

  // Validate URL format
  if (!isValidUrl(url.trim())) {
    return 'Please enter a valid URL';
  }

  // Check if custom prompt is provided when format is custom
  if (format === 'custom' && !customPrompt?.trim()) {
    return 'Please provide a description for custom formatting';
  }

  return null; // No validation errors
}

/**
 * Processes a link by sending it to the KindleCast API
 */
export async function processLink(request: LinkProcessRequest): Promise<LinkProcessResponse> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROCESS_LINK}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LinkProcessResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Return a user-friendly error response
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to process link. Please try again.'
    };
  }
}
