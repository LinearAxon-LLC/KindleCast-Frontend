'use client';

import React from 'react';
import Link from 'next/link';
import { Server, RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { text } from '@/lib/typography';

export default function InternalServerError() {
  return (
    <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[24px] mx-auto flex items-center justify-center mb-6">
            <Server className="w-16 h-16 text-red-500/60" />
          </div>
          
          {/* Error Code */}
          <div className="mb-4">
            <h1 className="text-8xl font-bold text-red-500/20 mb-2">500</h1>
            <div className="w-24 h-1 bg-red-500/30 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8 mb-8">
          <h2 className={`${text.sectionTitle} mb-4`}>Server Error</h2>
          <p className={`${text.body} text-[#273F4F]/70 mb-6 max-w-md mx-auto`}>
            Our servers are experiencing some technical difficulties. 
            We're working to fix this as quickly as possible.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 active:scale-[0.98]"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Page
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

        {/* Status Information */}
        <div className="bg-white/60 backdrop-blur-xl border border-black/[0.06] rounded-[12px] p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className={`${text.componentTitle}`}>Service Status</h3>
          </div>
          <p className={`${text.caption} mb-4`}>
            If this problem persists, you can check our service status or contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.04] text-[#273F4F] text-sm font-medium rounded-[6px] hover:bg-black/[0.08] transition-colors duration-150"
            >
              <Server className="w-4 h-4" />
              Service Status
            </a>
            <a
              href="mailto:support@kindddy.com?subject=Server Error (500)"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.04] text-[#273F4F] text-sm font-medium rounded-[6px] hover:bg-black/[0.08] transition-colors duration-150"
            >
              <AlertTriangle className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className={`${text.caption} text-[#273F4F]/50`}>
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <p className={`${text.caption} text-[#273F4F]/50 mt-1`}>
            Time: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
