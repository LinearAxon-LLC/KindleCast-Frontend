'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

function AuthErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>('')
  const [errorCode, setErrorCode] = useState<string>('')

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const code = searchParams.get('code')

    if (errorParam) {
      setError(errorParam)
      setErrorCode(code || '')
    } else if (errorDescription) {
      setError(errorDescription)
    } else {
      setError('An unknown authentication error occurred')
    }
  }, [searchParams])

  const getErrorMessage = (errorType: string): { title: string; description: string; suggestion: string } => {
    switch (errorType.toLowerCase()) {
      case 'access_denied':
        return {
          title: 'Access Denied',
          description: 'You cancelled the authentication process or denied access to your account.',
          suggestion: 'Please try signing in again and grant the necessary permissions.'
        }
      case 'invalid_request':
        return {
          title: 'Invalid Request',
          description: 'There was an issue with the authentication request.',
          suggestion: 'Please try signing in again. If the problem persists, contact support.'
        }
      case 'server_error':
        return {
          title: 'Server Error',
          description: 'Our authentication server encountered an error.',
          suggestion: 'Please try again in a few moments. If the issue continues, contact support.'
        }
      case 'temporarily_unavailable':
        return {
          title: 'Service Temporarily Unavailable',
          description: 'The authentication service is temporarily unavailable.',
          suggestion: 'Please try again in a few minutes.'
        }
      case 'invalid_client':
        return {
          title: 'Configuration Error',
          description: 'There was an issue with the authentication configuration.',
          suggestion: 'Please contact support for assistance.'
        }
      default:
        return {
          title: 'Authentication Error',
          description: 'Something went wrong during the sign-in process.',
          suggestion: 'Please try signing in again. If the problem persists, contact support.'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  const handleRetry = () => {
    router.push('/')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-[12px] flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-[20px] font-semibold text-black mb-3 leading-tight">
            {errorInfo.title}
          </h1>

          {/* Error Description */}
          <p className="text-[15px] text-black/70 mb-4 leading-relaxed">
            {errorInfo.description}
          </p>

          {/* Error Suggestion */}
          <p className="text-[13px] text-black/60 mb-6 leading-relaxed">
            {errorInfo.suggestion}
          </p>

          {/* Error Details (if available) */}
          {errorCode && (
            <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-[8px]">
              <p className="text-[11px] text-gray-600 font-mono">
                Error Code: {errorCode}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Action - Try Again */}
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-[10px] hover:bg-brand-primary/90 active:bg-brand-primary/80 transition-all duration-150 active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-[15px] font-medium">Try Again</span>
            </button>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-black/[0.08] text-black rounded-[8px] hover:bg-black/[0.02] active:bg-black/[0.05] transition-all duration-150 active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[13px] font-medium">Go Back</span>
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-black/[0.08] text-black rounded-[8px] hover:bg-black/[0.02] active:bg-black/[0.05] transition-all duration-150 active:scale-[0.98]"
              >
                <Home className="w-4 h-4" />
                <span className="text-[13px] font-medium">Home</span>
              </button>
            </div>
          </div>

          {/* Support Link */}
          <div className="mt-6 pt-4 border-t border-black/[0.08]">
            <p className="text-[12px] text-black/50 mb-2">
              Still having trouble?
            </p>
            <a
              href="mailto:support@kinddy.com"
              className="text-[13px] text-brand-primary hover:text-brand-primary/80 transition-colors duration-150 underline"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-[12px] text-black/50">
            Common issues: popup blockers, third-party cookies disabled, or browser extensions interfering with authentication.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-[12px] flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-[20px] font-semibold text-black mb-3 leading-tight">
              Loading...
            </h1>
            <p className="text-[15px] text-black/70 mb-4 leading-relaxed">
              Please wait while we process your request.
            </p>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
