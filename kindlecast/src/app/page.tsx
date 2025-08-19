'use client'

import {useState, useRef, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Cast, Check, Loader2, Menu, X} from "lucide-react"
import {useLinkProcessor} from "@/hooks/useLinkProcessor"
import {AuthDialog} from "@/components/ui/auth-dialog"
import {useAuth} from "@/contexts/AuthContext"
import {UserDropdown} from "@/components/ui/user-dropdown"
import {useUserProfile} from "@/hooks/useUserProfile"
import {usePricingPlans} from "@/hooks/usePricingPlans"
import {usePaymentFlow} from "@/hooks/usePayment"
import Image from "next/image"
import {FadeInSection, SlideIn} from "@/components/ui/animated"
import {motion, useInView, useScroll, useTransform} from "framer-motion"
import { HomePageStructuredData } from "@/components/seo/StructuredData"

// Animation component for scroll-triggered animations
function AnimatedFeature({children, delay = 0}: { children: React.ReactNode, delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true, margin: "-100px"})

    return (
        <motion.div
            ref={ref}
            initial={{opacity: 0, y: 50}}
            animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 50}}
            transition={{duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1]}}
        >
            {children}
        </motion.div>
    )
}

// Graphics components for How it Works
function GraphicStep1() {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[20px] p-8 shadow-lg">
            <div className="space-y-4">
                <div className="h-12 bg-gray-100 rounded-xl flex items-center px-4">
                    <span className="text-gray-400 text-sm">https://example.com/article</span>
                </div>
                <div className="flex space-x-2">
                    <div className="h-8 bg-brand-primary/20 rounded-lg px-3 flex items-center">
                        <span className="text-brand-primary text-xs font-medium">Just PDF</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg px-3 flex items-center">
                        <span className="text-gray-500 text-xs">Summarize</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg px-3 flex items-center">
                        <span className="text-gray-500 text-xs">Learning Ready</span>
                    </div>
                </div>
                <div className="h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-medium">Convert & Send</span>
                </div>
            </div>
        </div>
    )
}

function GraphicStep2() {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[20px] p-8 shadow-lg">
            <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                    </div>
                    <span className="font-medium text-gray-900">AI Processing</span>
                </div>
                <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-secondary rounded-full w-3/4"></div>
                    </div>
                    <div className="text-xs text-gray-500">Extracting content...</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}

function GraphicStep3() {
    return (
        <div className="bg-black rounded-[24px] p-6 shadow-2xl">
            <div className="bg-white rounded-[16px] p-6 h-80">
                <div className="space-y-4">
                    <div className="text-center border-b border-gray-200 pb-4">
                        <h4 className="font-bold text-gray-900 text-sm">The Future of Reading</h4>
                        <p className="text-xs text-gray-500 mt-1">Chapter 1</p>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="mt-4 h-2 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function GraphicStep4() {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[20px] p-8 shadow-lg">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Sending to Kindle...</span>
                    <div
                        className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">Content processed</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">PDF generated</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-blue-700">Sending to your Kindle...</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Image Placeholders with taller aspect ratio for screenshots
function FeatureImage({color, className = ""}: { color: string, className?: string }) {
    return (
        <div className={`w-full aspect-[4/5] rounded-2xl ${color} ${className}`}></div>
    )
}

export default function Home() {
    const [selectedFormat, setSelectedFormat] = useState('Just PDF')
    const [url, setUrl] = useState('')
    const [customPrompt, setCustomPrompt] = useState('')
    const [showAuthDialog, setShowAuthDialog] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const {isLoading, isSuccess, error, submitLink} = useLinkProcessor()
    const {isAuthenticated, user, setRedirectIntent, setPendingLinkData, getPendingLinkData} = useAuth()
    const {userProfile} = useUserProfile()
    const {plans, isLoading: plansLoading, isUserCurrentPlan} = usePricingPlans()
    const {initiatePayment, isLoading: paymentLoading} = usePaymentFlow()

    // Cache user data on landing page load (called once when authenticated)
    useEffect(() => {
        if (isAuthenticated && user) {
            // User data is already cached in AuthContext, no need to call API again
            // The user object already contains subscription_name from /auth/me
        }
    }, [isAuthenticated, user])

    const getPricingButtonConfig = (planName?: string, isFree?: boolean) => {
        if (!isAuthenticated) {
            return {
                text: 'Get Started',
                action: () => {
                    // Set redirect intent for premium plans
                    if (!isFree && planName) {
                        setRedirectIntent('payment', planName)
                    } else {
                        setRedirectIntent('dashboard')
                    }
                    setShowAuthDialog(true)
                },
                disabled: false
            }
        }

        // If user is pro and this is the free plan, disable the button
        if (isFree && userProfile?.subscription_type === 'premium') {
            return {
                text: 'Get Started Free',
                action: () => {},
                disabled: true
            }
        }

        if (userProfile?.user_subscribed) {
            return {
                text: 'Go to Dashboard',
                action: () => window.location.href = '/dashboard',
                disabled: false
            }
        }

        // User is logged in but not subscribed (free trial)
        if (isFree) {
            return {
                text: 'Get Started Free',
                action: () => window.location.href = '/dashboard',
                disabled: false
            }
        }

        // Premium plan - use payment API
        return {
            text: 'Upgrade to Pro',
            action: () => {
                if (planName) {
                    initiatePayment(planName, () => setShowAuthDialog(true))
                }
            },
            disabled: false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // If user is not authenticated, show auth dialog
        if (!isAuthenticated) {
            setPendingLinkData({url, format: selectedFormat, customPrompt})
            setShowAuthDialog(true)
            return
        }

        // If authenticated, proceed with submission
        await submitLink(url, selectedFormat, customPrompt)
    }


    return (
        <div className="min-h-screen bg-[#EFEEEA]">
            {/* Floating Navigation */}
            <nav
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#EFEEEA]/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)]">
                <div className="px-8 py-4 flex items-center justify-between w-[900px] max-w-[calc(100vw-48px)]">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1222_36625)">
                                    <path d="M2.70524 0.606445C1.72029 0.876364 0.937712 1.63573 0.635254 2.60678"
                                          stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M11.295 0.606445C12.28 0.876364 13.0625 1.63573 13.365 2.60678"
                                          stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6 0.5H8M8 13.5H6" stroke="white" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path d="M0.500001 8L0.5 6" stroke="white" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path d="M13.5002 8V6" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2.70524 13.3936C1.72029 13.1237 0.937712 12.3644 0.635254 11.3933"
                                          stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M11.295 13.3936C12.28 13.1237 13.0625 12.3644 13.365 11.3933"
                                          stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 10V4" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 6L7 4L9 6" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1222_36625">
                                        <rect width="14" height="14" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <span className="text-[17px] font-bold text-black/90">Kinddy</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#how-it-works"
                           className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200">
                            How it Works
                        </a>
                        <a href="#pricing"
                           className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200">
                            Pricing
                        </a>
                        <a href="#faq"
                           className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200">
                            FAQ
                        </a>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <a href="/dashboard"
                                       className="bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[13px] font-medium py-2 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer">
                                        Go to Dashboard
                                    </a>
                                    <UserDropdown/>
                                </>
                            ) : (
                                <button
                                    className="bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[13px] font-medium py-2 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                                    onClick={() => setShowAuthDialog(true)}
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-black/60 hover:text-black/85 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div
                        className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] overflow-hidden">
                        <div className="py-4 px-6 space-y-4">
                            <a href="#pricing"
                               className="block text-black/60 hover:text-black/85 font-medium cursor-pointer text-[15px] transition-colors duration-200"
                               onClick={() => setMobileMenuOpen(false)}>
                                Pricing
                            </a>
                            <a href="#faq"
                               className="block text-black/60 hover:text-black/85 font-medium cursor-pointer text-[15px] transition-colors duration-200"
                               onClick={() => setMobileMenuOpen(false)}>
                                FAQ
                            </a>

                            <div className="pt-4 border-t border-black/[0.08]">
                                {isAuthenticated ? (
                                    <div className="space-y-4">
                                        <a href="/dashboard"
                                           className="block w-full bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[15px] font-medium py-3 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer text-center"
                                           onClick={() => setMobileMenuOpen(false)}>
                                            Go to Dashboard
                                        </a>
                                        <div className="flex items-center space-x-3 px-2">
                                            <Image
                                                src={user?.avatar || "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png"}
                                                alt="Profile"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full border-2 border-brand-primary/20"
                                            />
                                            <span
                                                className="text-[15px] font-medium text-black/85">{user?.name || 'User'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[15px] font-medium py-3 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                                        onClick={() => {
                                            setMobileMenuOpen(false)
                                            setShowAuthDialog(true)
                                        }}>
                                        Get Started
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section - A Color */}
            <section className="pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 bg-[#EFEEEA]">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-[36px] sm:text-[44px] lg:text-6xl font-bold text-black/85 leading-[36px] sm:leading-[44px] lg:leading-[56px] mb-3 sm:mb-4">
                        Save Your Eyes.
                    </h1>
                    <h1 className="text-[36px] sm:text-[44px] lg:text-6xl font-bold leading-[36px] sm:leading-[44px] lg:leading-[56px] mb-6 sm:mb-8">
            <span
                className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
              Read Anything on Kindle.
            </span>
                    </h1>


                    <p className="text-[16px] sm:text-[18px] lg:text-xl text-center text-gray-600 leading-relaxed max-w-2xl mx-auto px-4">
                        Send
                        <span
                            className="mx-1 sm:mx-2 inline-block bg-blue-400 rounded-sm"
                            style={{transform: 'skew(-10deg)'}}
                        >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
              style={{transform: 'skew(10deg)'}}>
          web pages
        </span>
      </span>,
                        <span
                            className="mx-1 sm:mx-2 inline-block bg-purple-500 rounded-sm"
                            style={{transform: 'skew(-10deg)'}}
                        >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
              style={{transform: 'skew(10deg)'}}>
          newsletters
        </span>
      </span>
                        ,
                        <span
                            className="mx-1 sm:mx-2 inline-block bg-rose-500 rounded-sm"
                            style={{transform: 'skew(-10deg)'}}
                        >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
              style={{transform: 'skew(10deg)'}}>
          podcasts
        </span>
      </span>
                        ,
                        <span
                            className="mx-1 sm:mx-2 inline-block bg-amber-500 rounded-sm"
                            style={{transform: 'skew(-10deg)'}}
                        >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
              style={{transform: 'skew(10deg)'}}>
          videos
        </span>
      </span>
                        &
                        <span
                            className="mx-1 sm:mx-2 inline-block bg-emerald-400 rounded-sm"
                            style={{transform: 'skew(-10deg)'}}
                        >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
              style={{transform: 'skew(10deg)'}}>
          threads
        </span>
      </span>
                        to the comfortable screen of your Kindle. No more eye strain.
                    </p>


                    {/* macOS Native Input Box */}
                    <div className="max-w-2xl mx-auto mb-6 sm:mb-8 mt-8 sm:mt-12 px-4">
                        <div
                            className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] p-4 sm:p-6 lg:p-8">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4 sm:space-y-6">
                                    {/* URL Input Section */}
                                    <div>
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="Paste your link - webpage, YouTube, Wikipedia, Reddit, etc."
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/[0.03] border rounded-[8px] text-[14px] sm:text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:outline-none transition-all duration-200 cursor-text ${
                                                error && !url.trim()
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                    : 'border-black/[0.08] focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20'
                                            }`}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Format Selection */}
                                    <div>
                                        <label
                                            className="text-[12px] sm:text-[13px] font-medium text-black/60 uppercase tracking-[0.4px] mb-2 sm:mb-3 block text-center">
                                            Choose your format:
                                        </label>
                                        <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                                            {['Just PDF', 'Summarize', 'Learning Ready', 'Custom'].map((format) => (
                                                <button
                                                    key={format}
                                                    type="button"
                                                    onClick={() => setSelectedFormat(format)}
                                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] text-[12px] sm:text-[13px] font-medium transition-all duration-150 active:scale-[0.95] cursor-pointer ${
                                                        selectedFormat === format
                                                            ? 'bg-brand-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                                                            : 'bg-black/[0.04] hover:bg-black/[0.08] text-black/70 border border-black/[0.06]'
                                                    }`}
                                                    disabled={isLoading}
                                                >
                                                    {format}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Description - Only show when Custom is selected */}
                                    {selectedFormat === 'Custom' && (
                                        <div>
                                            <label
                                                className="text-[12px] sm:text-[13px] font-medium text-black/60 uppercase tracking-[0.4px] mb-2 sm:mb-3 block text-center">
                                                Describe how you want it:
                                            </label>
                                            <textarea
                                                value={customPrompt}
                                                onChange={(e) => setCustomPrompt(e.target.value)}
                                                placeholder="e.g., 'Make it a study guide with key points highlighted'"
                                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/[0.03] border rounded-[8px] text-[14px] sm:text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:outline-none transition-all duration-200 resize-none cursor-text ${
                                                    error && selectedFormat === 'Custom' && !customPrompt.trim()
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                        : 'border-black/[0.08] focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20'
                                                }`}
                                                rows={3}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    )}

                                    {/* Primary Action */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full text-white text-[12px] sm:text-[13px] font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 flex items-center justify-center ${
                                            isLoading
                                                ? 'bg-brand-primary/70 cursor-not-allowed'
                                                : isSuccess
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 active:scale-[0.98] cursor-pointer'
                                        }`}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin"/>
                                                Processing...
                                            </>
                                        ) : isSuccess ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"/>
                                                Sent!
                                            </>
                                        ) : (
                                            <>
                                                <Cast className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"/>
                                                Send to My Kindle
                                            </>
                                        )}
                                    </button>


                                </div>
                            </form>
                        </div>

                        {/* Footer Enhancement */}
                        <div className="text-[12px] sm:text-[13px] text-black/40 text-center mt-6 sm:mt-8 font-normal">
                            Free for 5 Quick Sends & 3 AI Formatting per month. No credit card required
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section - B Color */}
            <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#E8E7E3]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 sm:mb-20">
                        <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                            How it Works
                        </h2>
                        <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 max-w-2xl mx-auto">
                            Transform any content into perfectly formatted Kindle reading in just a few clicks
                        </p>
                    </div>

                    <div className="space-y-20 lg:space-y-32">
                        {/* Feature 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div className="space-y-6">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                    Paste Any Link or Upload Content
                                </h3>
                                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                                    Simply paste a webpage URL, upload a document, or add text content. Our AI instantly
                                    extracts and cleans the content, removing ads, sidebars, and distractions.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                        <span className="text-gray-600 text-[15px] sm:text-base">Web articles & blog posts</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                        <span
                                            className="text-gray-600 text-[15px] sm:text-base">YouTube transcripts</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                        <span className="text-gray-600 text-[15px] sm:text-base">PDF documents</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8 lg:mt-0">
                                <FeatureImage color="bg-blue-500"/>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div className="space-y-6 lg:order-2">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                    AI-Powered Content Processing
                                </h3>
                                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                                    Our advanced AI engine analyzes your content, removes clutter, optimizes formatting,
                                    and structures it perfectly for comfortable Kindle reading.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                                        <span className="text-gray-600 text-[15px] sm:text-base">Smart content extraction</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                                        <span className="text-gray-600 text-[15px] sm:text-base">Automatic formatting optimization</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                                        <span
                                            className="text-gray-600 text-[15px] sm:text-base">Kindle-specific layout</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8 lg:mt-0 lg:order-1">
                                <FeatureImage color="bg-purple-500"/>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div className="space-y-6">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                    Perfect Kindle Formatting
                                </h3>
                                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                                    Every document is optimized for your Kindle device with proper typography, spacing,
                                    and layout that makes reading comfortable and enjoyable.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>
                                        <span
                                            className="text-gray-600 text-[15px] sm:text-base">Optimized typography</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>
                                        <span
                                            className="text-gray-600 text-[15px] sm:text-base">Perfect line spacing</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>
                                        <span
                                            className="text-gray-600 text-[15px] sm:text-base">Chapter organization</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8 lg:mt-0">
                                <FeatureImage color="bg-pink-500"/>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div className="space-y-6 lg:order-2">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                    Instant Kindle Delivery
                                </h3>
                                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                                    Your perfectly formatted document is instantly sent to your Kindle device or app.
                                    Start reading immediately with zero setup required.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                                        <span className="text-gray-600 text-[15px] sm:text-base">Direct to Kindle delivery</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                                        <span className="text-gray-600 text-[15px] sm:text-base">Works with all Kindle devices</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                                        <span
                                            className="text-gray-600 text-[15px] sm:text-base">Instant synchronization</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8 lg:mt-0 lg:order-1">
                                <FeatureImage color="bg-orange-500"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section - A Color */}
            <section id="pricing" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#EFEEEA]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600">
                            Start free, upgrade when you need more
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                        {plansLoading ? (
                            // Loading skeleton
                            <>
                                <div
                                    className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 animate-pulse">
                                    <div className="text-center">
                                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                                        <div className="h-12 bg-gray-300 rounded mb-6"></div>
                                        <div className="space-y-3 mb-8">
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                        </div>
                                        <div className="h-12 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                                <div
                                    className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 animate-pulse">
                                    <div className="text-center">
                                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                                        <div className="h-12 bg-gray-300 rounded mb-6"></div>
                                        <div className="space-y-3 mb-8">
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                        </div>
                                        <div className="h-12 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            plans.map((plan) => {
                                const isCurrentPlan = isUserCurrentPlan(plan.name, user?.subscription_name)
                                const isFree = plan.subscription_type === 'free'

                                return (
                                    <div
                                        key={plan.name}
                                        className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative ${
                                            isFree
                                                ? 'bg-gray-50 border border-gray-200'
                                                : 'bg-brand-primary text-white'
                                        }`}
                                    >
                                        {plan.is_most_popular && (
                                            <div
                                                className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                                                <span
                                                    className="bg-brand-accent text-brand-primary px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isFree ? 'text-gray-900' : 'text-white'}`}>
                                                {plan.display_name}
                                            </h3>
                                            <div className="mb-6">
                                                {plan.original_price !== plan.discounted_price && plan.original_price > 0 ? (
                                                    <div className="flex flex-col items-center">
                                                        <span
                                                            className={`text-lg sm:text-xl font-bold line-through mb-1 ${isFree ? 'text-gray-500' : 'text-white/60'}`}>
                                                            ${plan.original_price.toFixed(2)}
                                                        </span>
                                                        <div className="flex items-baseline">
                                                            <span
                                                                className={`text-3xl sm:text-4xl font-bold ${isFree ? 'text-gray-900' : 'text-white'}`}>
                                                                ${plan.discounted_price.toFixed(2)}
                                                            </span>
                                                            <span
                                                                className={`text-sm sm:text-base ml-1 ${isFree ? 'text-gray-600' : 'text-white/80'}`}>
                                                                /{plan.billing_cycle}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-baseline justify-center">
                                                        <span
                                                            className={`text-3xl sm:text-4xl font-bold ${isFree ? 'text-gray-900' : 'text-white'}`}>
                                                            ${plan.discounted_price.toFixed(2)}
                                                        </span>
                                                        <span
                                                            className={`text-sm sm:text-base ml-1 ${isFree ? 'text-gray-600' : 'text-white/80'}`}>
                                                            /{plan.billing_cycle}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-left">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center space-x-3">
                                                        <div
                                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${isFree ? 'bg-gray-400' : 'bg-white'}`}></div>
                                                        <span
                                                            className={`text-sm sm:text-base ${isFree ? 'text-gray-600' : 'text-white/90'}`}>
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                className={`w-full cursor-pointer text-sm sm:text-base ${
                                                    isCurrentPlan || getPricingButtonConfig(plan.name, isFree).disabled
                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                        : isFree
                                                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                            : 'bg-white text-brand-primary hover:bg-gray-100'
                                                } ${paymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={isCurrentPlan || getPricingButtonConfig(plan.name, isFree).disabled ? undefined : getPricingButtonConfig(plan.name, isFree).action}
                                                disabled={isCurrentPlan || paymentLoading || getPricingButtonConfig(plan.name, isFree).disabled}
                                            >
                                                {paymentLoading ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                                        <span>Processing...</span>
                                                    </div>
                                                ) : isCurrentPlan ? (
                                                    'Your Current Subscription'
                                                ) : (
                                                    getPricingButtonConfig(plan.name, isFree).text
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section - B Color */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#E8E7E3]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                How does Kinddy work?
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Simply paste any URL or upload a document, and our AI will extract the content, remove
                                distractions like ads and sidebars, and format it perfectly for Kindle reading.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                What types of content can I convert?
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Kinddy works with web articles, blog posts, newsletters, social media threads,
                                research papers, and most text-based documents.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                Does it work with all Kindle devices?
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Yes! Our formatting is optimized for all Kindle devices, including Kindle Paperwhite,
                                Kindle Oasis, Kindle Scribe, and the basic Kindle.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                Is there a free trial?
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Absolutely! You get 5 free Quick Sends with no credit card required. This lets you test
                                the quality before deciding to upgrade.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section - A Color */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#EFEEEA]">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="space-y-8">
                        <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 leading-tight">
                            Ready to Transform Your Reading?
                        </h2>
                        <p className="text-[18px] sm:text-[20px] lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of readers who've already upgraded their digital reading experience. Start
                            converting your content today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button
                                size="xl"
                                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 text-lg font-medium shadow-lg"
                                onClick={() => setShowAuthDialog(true)}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium"
                            >
                                Watch Demo
                            </Button>
                        </div>
                        <div className="pt-6">
                            <p className="text-gray-500 text-sm">
                                No credit card required • 5 free conversions • Cancel anytime
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-primary text-white">
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 sm:mb-20">
                        {/* Brand Section */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="flex items-center space-x-4">
                                <div
                                    className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center">
                                    <svg width="56" height="56" viewBox="0 0 14 14" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_footer)">
                                            <path
                                                d="M2.70524 0.606445C1.72029 0.876364 0.937712 1.63573 0.635254 2.60678"
                                                stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M11.295 0.606445C12.28 0.876364 13.0625 1.63573 13.365 2.60678"
                                                  stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6 0.5H8M8 13.5H6" stroke="white" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                            <path d="M0.500001 8L0.5 6" stroke="white" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                            <path d="M13.5002 8V6" stroke="white" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                            <path d="M2.70524 13.3936C1.72029 13.1237 0.937712 12.3644 0.635254 11.3933"
                                                  stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M11.295 13.3936C12.28 13.1237 13.0625 12.3644 13.365 11.3933"
                                                  stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M7 10V4" stroke="white" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                            <path d="M5 6L7 4L9 6" stroke="white" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_footer">
                                                <rect width="14" height="14" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <span className="font-bold text-white text-4xl">Kinddy</span>
                            </div>
                            <p className="text-white/70 text-lg leading-relaxed max-w-md">
                                Transform any digital content into comfortable, eye-friendly Kindle reading experiences.
                                Save your eyes, enhance your reading, and enjoy content the way it was meant to be
                                consumed.
                            </p>
                            {/*<div className="space-y-4">*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>*/}
                            {/*        <span className="text-white/60">99.9% uptime guarantee</span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>

                        {/* Navigation Links */}
                        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
                            <div className="space-y-6">
                                <h4 className="font-semibold text-white text-lg">Product</h4>
                                <ul className="space-y-4 text-white/60">
                                    <li><a href="#pricing"
                                           className="hover:text-white transition-colors cursor-pointer text-base">Pricing</a>
                                    </li>
                                    <li><a href="#faq"
                                           className="hover:text-white transition-colors cursor-pointer text-base">FAQ</a>
                                    </li>
                                    <li><a href="#"
                                           className="hover:text-white transition-colors cursor-pointer text-base">Chrome
                                        Extension (Coming Soon)</a></li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h4 className="font-semibold text-white text-lg">Support</h4>
                                <ul className="space-y-4 text-white/60">
                                    <li>
                                        <a
                                            href="mailto:support@kinddy.com?subject=Help%20Center%20Inquiry&body=Hi%20Kinddy%2C%0A%0AI%20need%20help%20with..."
                                            className="hover:text-white transition-colors cursor-pointer text-base"
                                        >
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:support@kinddy.com?subject=Contact%20Us%20Inquiry&body=Hi%20Kinddy%2C%0A%0AI%20want%20to%20get%20in%20touch..."
                                            className="hover:text-white transition-colors cursor-pointer text-base"
                                        >
                                            Contact Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:support@kinddy.com?subject=Status%20Page%20Inquiry&body=Hi%20Kinddy%2C%0A%0AI%20want%20to%20check%20the%20status..."
                                            className="hover:text-white transition-colors cursor-pointer text-base"
                                        >
                                            Status Page
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:support@kinddy.com?subject=Bug%20Report&body=Hi%20Kinddy%2C%0A%0AI%20found%20a%20bug..."
                                            className="hover:text-white transition-colors cursor-pointer text-base"
                                        >
                                            Bug Reports
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:support@kinddy.com?subject=Feature%20Request&body=Hi%20Kinddy%2C%0A%0AI%20would%20love%20to%20see..."
                                            className="hover:text-white transition-colors cursor-pointer text-base"
                                        >
                                            Feature Requests
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h4 className="font-semibold text-white text-lg">Legal</h4>
                                <ul className="space-y-4 text-white/60">
                                    <li><a href="/privacy-policy"
                                           className="hover:text-white transition-colors cursor-pointer text-base">Privacy
                                        Policy</a></li>
                                    <li><a href="/terms-of-service"
                                           className="hover:text-white transition-colors cursor-pointer text-base">Terms
                                        of Service</a></li>
                                    {/*<li><a href="/refund-policy"*/}
                                    {/*       className="hover:text-white transition-colors cursor-pointer text-base">Refund*/}
                                    {/*    Policy</a></li>*/}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Big Kinddy Text */}
                    <div className="text-center mb-8">
                        <h2 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-white tracking-tight mb-6">
                            <span
                                className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl"
                                style={{
                                    textShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2)',
                                    filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))'
                                }}>
                                Kinddy
                            </span>
                        </h2>
                        <p className="text-white/70 text-xl sm:text-2xl lg:text-3xl font-light tracking-wide">
                            Made for readers who value their eyesight
                        </p>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-6">
                        <div className="text-center">
                            <p className="text-white/40 text-sm">
                                © {new Date().getFullYear()} Kinddy. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Auth Dialog */}
            <AuthDialog
                isOpen={showAuthDialog}
                onClose={() => setShowAuthDialog(false)}
                linkData={getPendingLinkData() || undefined}
            />

            {/* SEO Structured Data */}
            <HomePageStructuredData />
        </div>
    )
}
