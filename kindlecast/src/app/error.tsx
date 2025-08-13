'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { text } from '@/lib/typography';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[24px] mx-auto flex items-center justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500/60" />
          </div>
          
          {/* Error Code */}
          <div className="mb-4">
            <h1 className="text-6xl font-bold text-red-500/30 mb-2">Oops!</h1>
            <div className="w-24 h-1 bg-red-500/30 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8 mb-8">
          <h2 className={`${text.sectionTitle} mb-4`}>Something went wrong</h2>
          <p className={`${text.body} text-[#273F4F]/70 mb-6 max-w-md mx-auto`}>
            We encountered an unexpected error. Don't worry, our team has been notified 
            and we're working to fix it.
          </p>

          {/* Development Error Details */}
          {isDevelopment && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] text-left">
              <h3 className={`${text.small} font-semibold text-red-800 mb-2`}>
                Development Error Details:
              </h3>
              <pre className="text-xs text-red-700 overflow-auto max-h-32">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 active:scale-[0.98]"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/[0.04] text-[#273F4F] text-base font-medium rounded-[8px] hover:bg-black/[0.08] transition-colors duration-150 active:scale-[0.98]"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </div>

        {/* Error Reporting */}
        <div className="bg-white/60 backdrop-blur-xl border border-black/[0.06] rounded-[12px] p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bug className="w-5 h-5 text-[#273F4F]/60" />
            <h3 className={`${text.componentTitle}`}>Help us improve</h3>
          </div>
          <p className={`${text.small} text-[#273F4F]/70 mb-4`}>
            If this error persists, please let us know what you were doing when it occurred.
          </p>
          <a
            href={`mailto:support@kindlecast.com?subject=Error Report&body=Error: ${encodeURIComponent(error.message)}${error.digest ? `%0AError ID: ${error.digest}` : ''}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.04] text-[#273F4F] text-sm font-medium rounded-[6px] hover:bg-black/[0.08] transition-colors duration-150"
          >
            <Bug className="w-4 h-4" />
            Report Error
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className={`${text.caption} text-[#273F4F]/50`}>
            Error occurred at {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
