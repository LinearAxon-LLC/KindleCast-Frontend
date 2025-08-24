'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'
import { verifyMagicLink } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

function MagicLoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setTokens } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('Invalid magic link - no token provided')
      return
    }

    const verifyToken = async () => {
      try {
        const response = await verifyMagicLink(token)

        if (response.status && response.access_token && response.refresh_token) {
          // Success - set tokens and redirect to dashboard
          await setTokens(response.access_token, response.refresh_token)
          setStatus('success')
          setMessage('Successfully logged in! Redirecting to dashboard...')
          setEmail(response.email || '')
          
          // Redirect to dashboard after a short delay
          // setTimeout(() => {
          router.push('/dashboard')
          // }, 1000)
        } else {
          // Failed verification
          setStatus('error')
          setMessage(response.message || 'Invalid or expired magic link')
        }
      } catch (error) {
        console.error('Magic link verification error:', error)
        setStatus('error')
        setMessage('Failed to verify magic link. Please try again.')
      }
    }

    verifyToken().then(r => console.log(r));
  }, [searchParams, router, setTokens])

  return (
    <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-md p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[17px] font-semibold text-black mb-2">
            Magic Link Verification
          </h1>
          <p className="text-[13px] text-black/70">
            Verifying your magic link...
          </p>
        </div>

        {/* Status Content */}
        <div className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-black mb-2">
                  Verifying your magic link...
                </h2>
                <p className="text-[13px] text-black/70">
                  Please wait while we log you in.
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-green-800 mb-2">
                  Welcome to Kinddy!
                </h2>
                <p className="text-[13px] text-green-700 mb-2">
                  {message}
                </p>
                {email && (
                  <p className="text-[12px] text-green-600">
                    Logged in as: <strong>{email}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-red-800 mb-2">
                  Verification Failed
                </h2>
                <p className="text-[13px] text-red-700 mb-4">
                  {message}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-4 py-3 bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white rounded-[10px] transition-all duration-150 active:scale-[0.98]"
                >
                  <span className="text-[15px] font-medium">
                    Back to Home
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-black/[0.08] text-center">
          <p className="text-[12px] text-black/50">
            Having trouble? Contact support at{' '}
            <a href="mailto:support@kinddy.com" className="text-brand-primary hover:text-brand-primary/80">
              support@kinddy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MagicLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-[15px] font-semibold text-black mb-2">
              Loading...
            </h2>
            <p className="text-[13px] text-black/70">
              Please wait while we prepare your magic link verification.
            </p>
          </div>
        </div>
      </div>
    }>
      <MagicLoginContent />
    </Suspense>
  )
}
