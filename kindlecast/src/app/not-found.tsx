'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';
import { text } from '@/lib/typography';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[24px] mx-auto flex items-center justify-center mb-6">
            <FileQuestion className="w-16 h-16 text-[#273F4F]/40" />
          </div>
          
          {/* Error Code */}
          <div className="mb-4">
            <h1 className="text-8xl font-bold text-brand-primary/20 mb-2">404</h1>
            <div className="w-24 h-1 bg-brand-primary/30 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8 mb-8">
          <h2 className={`${text.sectionTitle} mb-4`}>Page Not Found</h2>
          <p className={`${text.body} text-[#273F4F]/70 mb-6 max-w-md mx-auto`}>
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 active:scale-[0.98]"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/[0.04] text-[#273F4F] text-base font-medium rounded-[8px] hover:bg-black/[0.08] transition-colors duration-150 active:scale-[0.98]"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/60 backdrop-blur-xl border border-black/[0.06] rounded-[12px] p-6">
          <h3 className={`${text.componentTitle} mb-4`}>Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link 
              href="/dashboard"
              className="flex items-center gap-3 p-3 bg-white/50 rounded-[8px] hover:bg-white/80 transition-colors duration-150 text-left"
            >
              <div className="w-8 h-8 bg-brand-primary/10 rounded-[6px] flex items-center justify-center">
                <Search className="w-4 h-4 text-brand-primary" />
              </div>
              <div>
                <div className={`${text.body} font-medium text-[#273F4F]`}>Dashboard</div>
                <div className={`${text.caption} text-[#273F4F]/60`}>Convert & manage files</div>
              </div>
            </Link>
            
            <Link 
              href="/#pricing"
              className="flex items-center gap-3 p-3 bg-white/50 rounded-[8px] hover:bg-white/80 transition-colors duration-150 text-left"
            >
              <div className="w-8 h-8 bg-green-500/10 rounded-[6px] flex items-center justify-center">
                <FileQuestion className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <div className={`${text.body} font-medium text-[#273F4F]`}>Pricing</div>
                <div className={`${text.caption} text-[#273F4F]/60`}>View our plans</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className={`${text.caption} text-[#273F4F]/50`}>
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@kinddy.com"
              className="text-brand-primary hover:underline"
            >
              support@kinddy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
