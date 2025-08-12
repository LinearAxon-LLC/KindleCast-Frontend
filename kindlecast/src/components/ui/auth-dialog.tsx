'use client'

import React, { useState } from 'react'
import { X, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  linkData?: {
    url: string
    format: string
    customPrompt?: string
  }
}

export function AuthDialog({
  isOpen,
  onClose,
  linkData
}: AuthDialogProps) {
  const { login, isLoading } = useAuth()
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'amazon' | null>(null)

  if (!isOpen) return null

  const handleGoogleLogin = () => {
    setLoadingProvider('google')
    login('google')
  }

  const handleAmazonLogin = () => {
    setLoadingProvider('amazon')
    login('amazon')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-[420px] mx-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 flex items-center justify-center transition-colors duration-150 z-10"
        >
          <X className="w-4 h-4 text-black/60" />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[17px] font-semibold text-black mb-2 text-center leading-tight">
            Sign in to continue
          </h2>

          {/* Message */}
          <p className="text-[13px] text-black/70 text-center leading-relaxed mb-6">
            {linkData 
              ? "Sign in to process your content and access your dashboard."
              : "Create your account to start converting content for your Kindle."
            }
          </p>

          {/* Link Preview - Only show when linkData exists */}
          {linkData && (
            <div className="mb-6 p-4 bg-black/[0.03] border border-black/[0.08] rounded-[12px]">
              <div className="text-[11px] font-medium text-black/60 uppercase tracking-[0.4px] mb-2">
                Ready to process:
              </div>
              <div className="text-[13px] text-black/85 font-medium mb-1 truncate">
                {linkData.url}
              </div>
              <div className="text-[11px] text-black/60">
                Format: {linkData.format}
              </div>
              {linkData.customPrompt && (
                <div className="text-[11px] text-black/60 mt-1">
                  Custom: {linkData.customPrompt}
                </div>
              )}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] hover:bg-black/[0.02] active:bg-black/[0.05] transition-all duration-150 active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:scale-100"
            >
              {loadingProvider === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-[15px] font-medium text-black/85">
                {loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
              </span>
            </button>

            {/* Amazon Login */}
            <button
              onClick={handleAmazonLogin}
              disabled={isLoading || loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FF9900] hover:bg-[#FF9900]/90 active:bg-[#FF9900]/80 text-white rounded-[10px] transition-all duration-150 active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF9900] disabled:active:scale-100"
            >
              {loadingProvider === 'amazon' ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.12c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.548.41-3.156.615-4.83.615-3.045 0-5.91-.645-8.596-1.936-.628-.3-1.234-.653-1.815-1.053-.226-.16-.345-.29-.345-.39 0-.06.03-.12.09-.18l.009-.345z"/>
                  <path d="M18.792 16.025c-.367-.226-.61-.422-.61-.648 0-.12.06-.226.18-.316.226-.18.526-.316.9-.406 1.244-.3 2.353-.18 3.33.36.226.12.346.27.346.45 0 .18-.09.36-.27.54-.18.18-.42.33-.72.45-.6.24-1.29.36-2.07.36-.69 0-1.29-.12-1.8-.36-.18-.09-.286-.226-.286-.43z"/>
                </svg>
              )}
              <span className="text-[15px] font-medium">
                {loadingProvider === 'amazon' ? 'Connecting...' : 'Continue with Amazon'}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-[11px] text-black/50 leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
