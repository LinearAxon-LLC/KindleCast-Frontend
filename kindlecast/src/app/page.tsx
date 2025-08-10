'use client'

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Cast, Check, Loader2, Menu, X} from "lucide-react"
import {useLinkProcessor} from "@/hooks/useLinkProcessor"
import {LoginModal} from "@/components/ui/login-modal"
import {useAuth} from "@/contexts/AuthContext"
import {UserDropdown} from "@/components/ui/user-dropdown"
import {useUserProfile} from "@/hooks/useUserProfile"
import Image from "next/image"

export default function Home() {
    const [selectedFormat, setSelectedFormat] = useState('Just PDF')
    const [url, setUrl] = useState('')
    const [customPrompt, setCustomPrompt] = useState('')
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [pendingLinkData, setPendingLinkData] = useState<{url: string, format: string, customPrompt?: string} | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const { isLoading, isSuccess, error, submitLink } = useLinkProcessor()
    const { isAuthenticated, user } = useAuth()
    const { userProfile } = useUserProfile()

    const getPricingButtonConfig = () => {
        if (!isAuthenticated) {
            return {
                text: 'Get Started',
                action: () => setShowLoginModal(true)
            }
        }

        if (userProfile?.user_subscribed) {
            return {
                text: 'Go to Dashboard',
                action: () => window.location.href = '/dashboard'
            }
        }

        // User is logged in but not subscribed (free trial)
        return {
            text: 'Upgrade to Pro',
            action: () => window.location.href = 'https://www.creem.io/test/payment/prod_oGpAgPwct4S52vtAbFHOX'
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // If user is not authenticated, show login modal
        if (!isAuthenticated) {
            setPendingLinkData({ url, format: selectedFormat, customPrompt })
            setShowLoginModal(true)
            return
        }

        // If authenticated, proceed with submission
        await submitLink(url, selectedFormat, customPrompt)
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Floating Navigation */}
            <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)]">
                <div className="px-8 py-4 flex items-center justify-between w-[720px] max-w-[calc(100vw-48px)]">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
                            <Cast className="w-4 h-4 text-white"/>
                        </div>
                        <span className="text-[17px] font-medium text-black/85">KindleCast</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
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
                                    <UserDropdown />
                                </>
                            ) : (
                                <button
                                    className="bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[13px] font-medium py-2 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                                    onClick={() => setShowLoginModal(true)}
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
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] overflow-hidden">
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
                                                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format"}
                                                alt="Profile"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full border-2 border-brand-primary/20"
                                            />
                                            <span className="text-[15px] font-medium text-black/85">{user?.name || 'User'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[15px] font-medium py-3 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                                        onClick={() => {
                                            setMobileMenuOpen(false)
                                            setShowLoginModal(true)
                                        }}>
                                        Get Started
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] font-bold text-black/85 leading-[32px] sm:leading-[40px] lg:leading-[52px] mb-3 sm:mb-4">
                        Save Your Eyes.
                    </h1>
                    <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] font-bold leading-[32px] sm:leading-[40px] lg:leading-[52px] mb-6 sm:mb-8">
            <span
                className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
              Read Anything on Kindle.
            </span>
                    </h1>


                      <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-center text-gray-600 leading-relaxed max-w-2xl mx-auto px-4">
      Send
      <span
        className="mx-1 sm:mx-2 inline-block bg-blue-400 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]" style={{ transform: 'skew(10deg)' }}>
          web pages
        </span>
      </span>,
      <span
        className="mx-1 sm:mx-2 inline-block bg-purple-500 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]" style={{ transform: 'skew(10deg)' }}>
          newsletters
        </span>
      </span>
      ,
      <span
        className="mx-1 sm:mx-2 inline-block bg-rose-500 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]" style={{ transform: 'skew(10deg)' }}>
          podcasts
        </span>
      </span>
      ,
      <span
        className="mx-1 sm:mx-2 inline-block bg-amber-500 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]" style={{ transform: 'skew(10deg)' }}>
          videos
        </span>
      </span>
      &
      <span
        className="mx-1 sm:mx-2 inline-block bg-emerald-400 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]" style={{ transform: 'skew(10deg)' }}>
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
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[14px] sm:text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200 cursor-text"
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
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[14px] sm:text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200 resize-none cursor-text"
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

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-500 text-[12px] sm:text-[13px] text-center mt-2">
                                        {error}
                                    </div>
                                )}
                                </div>
                            </form>
                        </div>

                        {/* Footer Enhancement */}
                        <div className="text-[10px] sm:text-[11px] text-black/40 text-center mt-6 sm:mt-8 font-normal">
                            Free for 5 Quick Sends. No credit card required
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-[28px] sm:text-[32px] lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600">
                            Start free, upgrade when you need more
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
                            <div className="text-center">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Free</h3>
                                <div className="mb-6">
                                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">$0</span>
                                    <span className="text-gray-600 text-sm sm:text-base">/month</span>
                                </div>
                                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-left">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                                        <span className="text-gray-600 text-sm sm:text-base">5 Quick Send per month</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                                        <span className="text-gray-600 text-sm sm:text-base">3 AI Formatting per month</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                                        <span className="text-gray-600 text-sm sm:text-base">20 days data retention</span>
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer text-sm sm:text-base"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Get Started Free
                                </Button>
                            </div>
                        </div>

                        {/* Paid Plan */}
                        <div
                            className="bg-brand-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative">
                            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-brand-accent text-brand-primary px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                                    Most Popular
                                </span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">Paid</h3>
                                <div className="mb-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl sm:text-3xl font-bold text-white/60 line-through">$14.99</span>
                                        <span className="text-3xl sm:text-4xl font-bold">$9.99</span>
                                    </div>
                                    <span className="text-white/80 text-sm sm:text-base">/month</span>
                                </div>
                                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-left">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                                        <span className="text-white/90 text-sm sm:text-base">Unlimited Quick Send</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                                        <span className="text-white/90 text-sm sm:text-base">100 AI Formatting</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                                        <span className="text-white/90 text-sm sm:text-base">120 days data retention</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                                        <span className="text-white/90 text-sm sm:text-base">Personal mail for Email forwarding</span>
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-white text-brand-primary hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                                    onClick={getPricingButtonConfig().action}
                                >
                                    {getPricingButtonConfig().text}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-[28px] sm:text-[32px] lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                How does KindleCast work?
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
                                KindleCast works with web articles, blog posts, newsletters, social media threads,
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

            {/* Footer */}
            <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                        <div className="col-span-1 sm:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div
                                    className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                                    <Cast className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"/>
                                </div>
                                <span className="font-bold text-white text-base sm:text-lg">KindleCast</span>
                            </div>
                            <p className="text-white/60 max-w-md text-sm sm:text-base">
                                Transform any digital content into comfortable, eye-friendly Kindle reading experiences.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
                            <ul className="space-y-2 text-white/60 text-sm sm:text-base">
                                <li><a href="#pricing" className="hover:text-white cursor-pointer">Pricing</a></li>
                                <li><a href="#faq" className="hover:text-white cursor-pointer">FAQ</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
                            <ul className="space-y-2 text-white/60 text-sm sm:text-base">
                                <li><a href="#" className="hover:text-white cursor-pointer">Help Center</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">Contact</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">Privacy</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">Terms</a></li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <p className="text-white/40 text-xs sm:text-sm">
                            © {new Date().getFullYear()} KindleCast. All rights reserved.
                        </p>
                        <p className="text-white/40 text-xs sm:text-sm">
                            Made for readers who value their eyesight
                        </p>
                    </div>
                </div>
            </footer>
            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                linkData={pendingLinkData || undefined}
            />
        </div>
    )
}
