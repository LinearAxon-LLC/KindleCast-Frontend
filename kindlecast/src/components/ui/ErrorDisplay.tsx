import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { text } from '@/lib/typography';

interface ErrorDisplayProps {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
  variant?: 'card' | 'inline' | 'banner';
  showIcon?: boolean;
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  className = '', 
  variant = 'card',
  showIcon = true 
}: ErrorDisplayProps) {
  const errorMessage = error instanceof Error ? error.message : error;
  
  // Determine error type for better UX
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                        errorMessage.toLowerCase().includes('fetch') ||
                        errorMessage.toLowerCase().includes('connection');
  
  const isAuthError = errorMessage.toLowerCase().includes('unauthorized') ||
                     errorMessage.toLowerCase().includes('authentication') ||
                     errorMessage.toLowerCase().includes('401');

  const getErrorIcon = () => {
    if (isNetworkError) return <WifiOff className="w-5 h-5 text-red-500" />;
    if (isAuthError) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const getErrorTitle = () => {
    if (isNetworkError) return 'Connection Error';
    if (isAuthError) return 'Authentication Required';
    return 'Something went wrong';
  };

  const getErrorDescription = () => {
    if (isNetworkError) return 'Please check your internet connection and try again.';
    if (isAuthError) return 'Please sign in again to continue.';
    return errorMessage;
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-red-600 ${className}`}>
        {showIcon && <AlertTriangle className="w-4 h-4" />}
        <span className={text.caption}>{errorMessage}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 text-red-600 hover:text-red-700 underline text-sm"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-[8px] p-4 ${className}`}>
        <div className="flex items-start gap-3">
          {showIcon && getErrorIcon()}
          <div className="flex-1">
            <h3 className={`${text.small} font-semibold text-red-800 mb-1`}>
              {getErrorTitle()}
            </h3>
            <p className={`${text.caption} text-red-700`}>
              {getErrorDescription()}
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-[6px] hover:bg-red-200 transition-colors duration-150"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-red-200 rounded-[16px] p-6 text-center ${className}`}>
      {showIcon && (
        <div className="w-16 h-16 bg-red-50 rounded-[12px] mx-auto flex items-center justify-center mb-4">
          {getErrorIcon()}
        </div>
      )}
      
      <h3 className={`${text.componentTitle} text-red-800 mb-2`}>
        {getErrorTitle()}
      </h3>
      
      <p className={`${text.body} text-red-700/80 mb-6 max-w-sm mx-auto`}>
        {getErrorDescription()}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-[8px] hover:bg-red-700 transition-colors duration-150 active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

// Specialized network error component
export function NetworkError({ onRetry, className = '' }: { onRetry?: () => void; className?: string }) {
  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-orange-200 rounded-[16px] p-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-orange-50 rounded-[12px] mx-auto flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-orange-500" />
      </div>
      
      <h3 className={`${text.componentTitle} text-orange-800 mb-2`}>
        Connection Lost
      </h3>
      
      <p className={`${text.body} text-orange-700/80 mb-6 max-w-sm mx-auto`}>
        Unable to connect to our servers. Please check your internet connection.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-[8px] hover:bg-orange-700 transition-colors duration-150 active:scale-[0.98]"
        >
          <Wifi className="w-4 h-4" />
          Reconnect
        </button>
      )}
    </div>
  );
}

// Loading error state for when data fails to load
export function LoadingError({ 
  message = "Failed to load data", 
  onRetry, 
  className = '' 
}: { 
  message?: string; 
  onRetry?: () => void; 
  className?: string; 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="w-12 h-12 bg-red-50 rounded-[8px] flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      
      <p className={`${text.body} text-[#273F4F]/70 mb-4 text-center`}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.04] text-[#273F4F] text-sm font-medium rounded-[6px] hover:bg-black/[0.08] transition-colors duration-150"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
