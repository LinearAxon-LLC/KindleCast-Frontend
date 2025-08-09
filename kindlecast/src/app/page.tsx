'use client'

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Cast, Check, Loader2} from "lucide-react"
import {useLinkProcessor} from "@/hooks/useLinkProcessor"
import {LoginModal} from "@/components/ui/login-modal"
import {useAuth} from "@/contexts/AuthContext"
import Image from "next/image"

export default function Home() {
    const [selectedFormat, setSelectedFormat] = useState('Just PDF')
    const [url, setUrl] = useState('')
    const [customPrompt, setCustomPrompt] = useState('')
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [pendingLinkData, setPendingLinkData] = useState<{url: string, format: string, customPrompt?: string} | null>(null)

    const { isLoading, isSuccess, error, submitLink } = useLinkProcessor()
    const { isAuthenticated, user } = useAuth()

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
            <nav
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)]">
                <div className="px-8 py-4 flex items-center justify-between min-w-[720px]">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-8 h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
                            <Cast className="w-4 h-4 text-white"/>
                        </div>
                        <span className="text-[17px] font-medium text-black/85">KindleCast</span>
                    </div>

                    <div className="flex items-center space-x-8">
                        <a href="#pricing"
                           className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200">Pricing</a>
                        <a href="#faq"
                           className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200">FAQ</a>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <a href="/dashboard"
                                   className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200">Dashboard</a>
                                <Image
                                    src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format"}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full border-2 border-brand-primary/20"
                                />
                            </div>
                        ) : (
                            <button
                                className="bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[13px] font-medium py-2 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer">
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-32 px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-[48px] font-bold text-black/85 leading-[52px] mb-4">
                        Save Your Eyes.
                    </h1>
                    <h1 className="text-[48px] font-bold leading-[52px] mb-8">
            <span
                className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
              Read Anything on Kindle.
            </span>
                    </h1>


                      <p className="text-[18px] text-center text-gray-600 leading-relaxed max-w-2xl mx-auto">
      Send
      <span
        className="mx-2 inline-block bg-blue-400 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-2 inline-block text-white font-semibold" style={{ transform: 'skew(10deg)' }}>
          web pages
        </span>
      </span>,
      <span
        className="mx-2 inline-block bg-purple-500 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-2 inline-block text-white font-semibold" style={{ transform: 'skew(10deg)' }}>
          newsletters
        </span>
      </span>
      ,
      <span
        className="mx-2 inline-block bg-rose-500 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-2 inline-block text-white font-semibold" style={{ transform: 'skew(10deg)' }}>
          podcasts
        </span>
      </span>
      ,
      <span
        className="mx-2 inline-block bg-amber-500 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-2 inline-block text-white font-semibold" style={{ transform: 'skew(10deg)' }}>
          videos
        </span>
      </span>
      &
      <span
        className="mx-2 inline-block bg-emerald-400 rounded-sm"
        style={{ transform: 'skew(-10deg)' }}
      >
        <span className="px-2 inline-block text-white font-semibold" style={{ transform: 'skew(10deg)' }}>
          threads
        </span>
      </span>
      to the comfortable screen of your Kindle. No more eye strain.
    </p>



                    {/* macOS Native Input Box */}
                    <div className="max-w-2xl mx-auto mb-8 mt-12">
                        <div
                            className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] p-8">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* URL Input Section */}
                                    <div>
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="Paste your link - webpage, YouTube, Wikipedia, Reddit, etc."
                                            className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200 cursor-text"
                                            disabled={isLoading}
                                        />
                                    </div>

                                {/* Format Selection */}
                                <div>
                                    <label
                                        className="text-[13px] font-medium text-black/60 uppercase tracking-[0.4px] mb-3 block text-center">
                                        Choose your format:
                                    </label>
                                    <div className="flex gap-2 flex-wrap justify-center">
                                        {['Just PDF', 'Summarize', 'Learning Ready', 'Custom'].map((format) => (
                                            <button
                                                key={format}
                                                type="button"
                                                onClick={() => setSelectedFormat(format)}
                                                className={`px-4 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-150 active:scale-[0.95] cursor-pointer ${
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
                                            className="text-[13px] font-medium text-black/60 uppercase tracking-[0.4px] mb-3 block text-center">
                                            Describe how you want it:
                                        </label>
                                        <textarea
                                            value={customPrompt}
                                            onChange={(e) => setCustomPrompt(e.target.value)}
                                            placeholder="e.g., 'Make it a study guide with key points highlighted'"
                                            className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200 resize-none cursor-text"
                                            rows={3}
                                            disabled={isLoading}
                                        />
                                    </div>
                                )}

                                {/* Primary Action */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full text-white text-[13px] font-medium py-3 px-6 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 flex items-center justify-center ${
                                        isLoading
                                            ? 'bg-brand-primary/70 cursor-not-allowed'
                                            : isSuccess
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 active:scale-[0.98] cursor-pointer'
                                    }`}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                            Processing...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2"/>
                                            Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Cast className="w-4 h-4 mr-2"/>
                                            Send to My Kindle
                                        </>
                                    )}
                                </button>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-500 text-[13px] text-center mt-2">
                                        {error}
                                    </div>
                                )}
                                </div>
                            </form>
                        </div>

                        {/* Footer Enhancement */}
                        <div className="text-[11px] text-black/40 text-center mt-8 font-normal">
                            Free for 3 conversions. No credit card required
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 px-8 bg-black/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Start free, upgrade when you need more
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">$0</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="text-gray-600">3 conversions per month</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="text-gray-600">Basic formatting</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="text-gray-600">Email support</span>
                                    </li>
                                </ul>
                                <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer">
                                    Get Started Free
                                </Button>
                            </div>
                        </div>

                        {/* Pro Plan */}
                        <div
                            className="bg-brand-primary rounded-3xl p-8 text-white relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-accent text-brand-primary px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">$9</span>
                                    <span className="text-white/80">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-white"/>
                                        <span className="text-white/90">Unlimited conversions</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-white"/>
                                        <span className="text-white/90">Advanced formatting</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-white"/>
                                        <span className="text-white/90">Priority support</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-white"/>
                                        <span className="text-white/90">Custom formatting</span>
                                    </li>
                                </ul>
                                <Button className="w-full bg-white text-brand-primary hover:bg-gray-100 cursor-pointer">
                                    Start Pro Trial
                                </Button>
                            </div>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">$29</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="text-gray-600">Everything in Pro</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="text-gray-600">API access</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="text-gray-600">Team management</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="text-gray-600">24/7 support</span>
                                    </li>
                                </ul>
                                <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 cursor-pointer">
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 px-8 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-8 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                How does KindleCast work?
                            </h3>
                            <p className="text-gray-600">
                                Simply paste any URL or upload a document, and our AI will extract the content, remove
                                distractions like ads and sidebars, and format it perfectly for Kindle reading.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                What types of content can I convert?
                            </h3>
                            <p className="text-gray-600">
                                KindleCast works with web articles, blog posts, newsletters, social media threads,
                                research papers, and most text-based documents.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Does it work with all Kindle devices?
                            </h3>
                            <p className="text-gray-600">
                                Yes! Our formatting is optimized for all Kindle devices, including Kindle Paperwhite,
                                Kindle Oasis, Kindle Scribe, and the basic Kindle.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Is there a free trial?
                            </h3>
                            <p className="text-gray-600">
                                Absolutely! You get 3 free conversions with no credit card required. This lets you test
                                the quality before deciding to upgrade.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-8 bg-black text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div
                                    className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                                    <Cast className="w-4 h-4 text-white"/>
                                </div>
                                <span className="font-bold text-white text-lg">KindleCast</span>
                            </div>
                            <p className="text-white/60 max-w-md">
                                Transform any digital content into comfortable, eye-friendly Kindle reading experiences.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#pricing" className="hover:text-white cursor-pointer">Pricing</a></li>
                                <li><a href="#faq" className="hover:text-white cursor-pointer">FAQ</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#" className="hover:text-white cursor-pointer">Help Center</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">Contact</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">Privacy</a></li>
                                <li><a href="#" className="hover:text-white cursor-pointer">Terms</a></li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white/40 text-sm">
                            © {new Date().getFullYear()} KindleCast. All rights reserved.
                        </p>
                        <p className="text-white/40 text-sm mt-4 md:mt-0">
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
