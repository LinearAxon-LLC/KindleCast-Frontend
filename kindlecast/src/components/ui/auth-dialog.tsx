'use client'

import React, {useState} from 'react'
import {X, User, Loader2, Mail} from 'lucide-react'
import {useAuth} from '@/contexts/AuthContext'
import {sendMagicLink} from '@/lib/api'

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
    const {login, isLoading} = useAuth()
    const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | 'email' | null>(null)
    const [showEmailForm, setShowEmailForm] = useState(false)
    const [email, setEmail] = useState('')
    const [magicLinkSent, setMagicLinkSent] = useState(false)

    if (!isOpen) return null

    const handleGoogleLogin = () => {
        setLoadingProvider('google')
        login('google')
    }

    const handleAppleLogin = () => {
        setLoadingProvider('apple')
        login('apple')
    }

    const handleMagicLinkSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setLoadingProvider('email')

        try {
            const response = await sendMagicLink({ email: email.trim() })

            if (response.status) {
                setMagicLinkSent(true)
            } else {
                console.error('Failed to send magic link:', response.message)
                // You could show an error toast here
            }
        } catch (error) {
            console.error('Error sending magic link:', error)
            // You could show an error toast here
        } finally {
            setLoadingProvider(null)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className="relative bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-[420px] mx-4 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 flex items-center justify-center transition-colors duration-150 z-10"
                >
                    <X className="w-4 h-4 text-black/60"/>
                </button>

                {/* Content */}
                <div className="px-6 pt-8 pb-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center">
                            <User className="w-8 h-8 text-white"/>
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
                                <Loader2 className="w-5 h-5 animate-spin text-gray-600"/>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4"
                                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853"
                                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05"
                                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335"
                                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            )}
                            <span className="text-[15px] font-medium text-black/85">
                {loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
              </span>
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-black/[0.08]"></div>
                            <span className="text-[13px] text-black/50 font-medium">Or</span>
                            <div className="flex-1 h-px bg-black/[0.08]"></div>
                        </div>

                        {/* Email Magic Link Form */}
                        {!magicLinkSent ? (
                            <form onSubmit={handleMagicLinkSend} className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] text-[15px] placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || loadingProvider !== null || !email.trim()}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white rounded-[10px] transition-all duration-150 active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-primary disabled:active:scale-100"
                                >
                                    {loadingProvider === 'email' ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-white"/>
                                    ) : (
                                        <Mail className="w-5 h-5 text-white"/>
                                    )}
                                    <span className="text-[15px] font-medium">
                                        Send Magic Link
                                    </span>
                                </button>
                            </form>
                        ) : (
                            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-[12px]">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Mail className="w-6 h-6 text-green-600"/>
                                </div>
                                <h3 className="text-[15px] font-semibold text-green-800 mb-2">
                                    Magic Link Sent!
                                </h3>
                                <p className="text-[13px] text-green-700 mb-4">
                                    We've sent a magic link to <strong>{email}</strong>. Click the link to instantly access your dashboard and send files to your Kindle.
                                </p>
                                {/*<button*/}
                                {/*    onClick={() => {*/}
                                {/*        setMagicLinkSent(false)*/}
                                {/*        setEmail('')*/}
                                {/*    }}*/}
                                {/*    className="text-[13px] text-green-600 hover:text-green-700 font-medium underline"*/}
                                {/*>*/}
                                {/*    Use different email*/}
                                {/*</button>*/}
                            </div>
                        )}



                        {/* Email Login Toggle */}
                        {/*{!showEmailForm ? (*/}
                        {/*  <button*/}
                        {/*    onClick={() => setShowEmailForm(true)}*/}
                        {/*    disabled={isLoading || loadingProvider !== null}*/}
                        {/*    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] hover:bg-black/[0.02] active:bg-black/[0.05] transition-all duration-150 active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:scale-100"*/}
                        {/*  >*/}
                        {/*    <Mail className="w-5 h-5 text-gray-600" />*/}
                        {/*    <span className="text-[15px] font-medium text-black/85">*/}
                        {/*      Continue with Email*/}
                        {/*    </span>*/}
                        {/*  </button>*/}
                        {/*) : (*/}
                        {/*   Email Form */}
                        {/*  <form onSubmit={handleEmailLogin} className="space-y-3">*/}
                        {/*    <input*/}
                        {/*      type="email"*/}
                        {/*      placeholder="Enter your email"*/}
                        {/*      value={email}*/}
                        {/*      onChange={(e) => setEmail(e.target.value)}*/}
                        {/*      required*/}
                        {/*      className="w-full px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] text-[15px] placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30"*/}
                        {/*    />*/}
                        {/*    <input*/}
                        {/*      type="password"*/}
                        {/*      placeholder="Enter your password"*/}
                        {/*      value={password}*/}
                        {/*      onChange={(e) => setPassword(e.target.value)}*/}
                        {/*      required*/}
                        {/*      className="w-full px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] text-[15px] placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30"*/}
                        {/*    />*/}
                        {/*    <div className="flex gap-2">*/}
                        {/*      <button*/}
                        {/*        type="submit"*/}
                        {/*        disabled={isLoading || loadingProvider !== null}*/}
                        {/*        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white rounded-[10px] transition-all duration-150 active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"*/}
                        {/*      >*/}
                        {/*        {loadingProvider === 'email' ? (*/}
                        {/*          <Loader2 className="w-5 h-5 animate-spin" />*/}
                        {/*        ) : (*/}
                        {/*          <Mail className="w-5 h-5" />*/}
                        {/*        )}*/}
                        {/*        <span className="text-[15px] font-medium">*/}
                        {/*          {loadingProvider === 'email' ? 'Signing in...' : 'Sign In'}*/}
                        {/*        </span>*/}
                        {/*      </button>*/}
                        {/*      <button*/}
                        {/*        type="button"*/}
                        {/*        onClick={() => setShowEmailForm(false)}*/}
                        {/*        className="px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] hover:bg-black/[0.02] active:bg-black/[0.05] transition-all duration-150 active:scale-[0.98]"*/}
                        {/*      >*/}
                        {/*        <X className="w-5 h-5 text-black/60" />*/}
                        {/*      </button>*/}
                        {/*    </div>*/}
                        {/*  </form>*/}
                        {/*)}*/}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-[11px] text-black/50 leading-relaxed">
                            By continuing, you agree to our <a href="/terms-of-service" className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy-policy" className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
