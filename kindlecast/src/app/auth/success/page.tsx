'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TokenManager } from '@/lib/auth'
import { AuthTokens } from '@/types/api'


export default function AuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Extract tokens from URL parameters
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const provider = searchParams.get('provider')

        // Check for error parameters
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          setStatus('error')
          setErrorMessage(errorDescription || `OAuth ${error}`)
          
          // Redirect to home page with error after 3 seconds
          setTimeout(() => {
            router.push(`/?error=${encodeURIComponent(errorDescription || 'Authentication failed')}&provider=${provider || 'unknown'}`)
          }, 3000)
          return
        }

        if (!accessToken || !refreshToken) {
          console.error('Missing tokens in OAuth callback')
          setStatus('error')
          setErrorMessage('Missing authentication tokens')
          
          // Redirect to home page with error after 3 seconds
          setTimeout(() => {
            router.push('/?error=missing_tokens')
          }, 3000)
          return
        }

        // Create tokens object
        const tokens: AuthTokens = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: 3600, // Default to 1 hour, will be refreshed as needed
          token_type: 'bearer',
        }

        // Store tokens
        TokenManager.setTokens(tokens)

        setStatus('success')

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)

      } catch (error) {
        console.error('Auth success handling failed:', error)
        setStatus('error')
        setErrorMessage('Failed to process authentication')
        
        // Redirect to home page with error after 3 seconds
        setTimeout(() => {
          router.push('/?error=processing_failed')
        }, 3000)
      }
    }

    handleAuthSuccess()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center font-rubik">
      <div className="text-center max-w-md mx-auto px-6">
        {status === 'processing' && (
          <>
            <div className="w-12 h-12 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-[17px] font-medium text-black mb-2">
              Completing Sign In...
            </h1>
            <p className="text-[13px] text-black/60">
              Please wait while we set up your account
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[17px] font-medium text-black mb-2">
              Sign In Successful! 🎉
            </h1>
            <p className="text-[13px] text-black/60">
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-[17px] font-medium text-black mb-2">
              Sign In Failed
            </h1>
            <p className="text-[13px] text-black/60 mb-4">
              {errorMessage || 'Something went wrong during authentication'}
            </p>
            <p className="text-[11px] text-black/40">
              Redirecting you back to the home page...
            </p>
          </>
        )}
      </div>
    </div>
  )
}
