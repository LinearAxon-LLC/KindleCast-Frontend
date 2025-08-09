'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { MacOSDialog } from './macos-dialog'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  linkData?: {
    url: string
    format: string
    customPrompt?: string
  }
}

export function LoginModal({ isOpen, onClose, linkData }: LoginModalProps) {
  const { login } = useAuth()

  const handleGoogleLogin = () => {
    login() // This now calls signIn('google') from NextAuth
    onClose()
  }

  return (
    <MacOSDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Continue to KindleCast"
      message="Sign in to process your content and access your dashboard."
      icon={
        <div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="6" width="6" height="12" rx="1" fill="currentColor"/>
            <path d="M12 8L18 8M12 12L16 12M12 16L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      }
      primaryButton={{
        label: 'Continue with Google',
        onClick: handleGoogleLogin,
        variant: 'primary'
      }}
      secondaryButton={{
        label: 'Cancel',
        onClick: onClose
      }}
    >
      {/* Link Preview */}
      {linkData && (
        <div className="mb-4 p-3 bg-black/[0.05] rounded-[6px] text-left">
          <div className="text-[11px] font-medium text-black/60 uppercase tracking-[0.4px] mb-1">
            Ready to process:
          </div>
          <div className="text-[12px] text-black/85 font-medium mb-1 truncate">
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

      {/* Google Login Visual */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-[11px] text-black/70">Google Account Required</span>
      </div>
    </MacOSDialog>
  )
}
