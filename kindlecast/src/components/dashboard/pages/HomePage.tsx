'use client'

import React, { useState } from 'react'
import { Plus, FileText, Upload } from 'lucide-react'
import { useLinkProcessor } from '@/hooks/useLinkProcessor'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getTimeBasedGreeting } from '@/lib/time-utils'
import { DeviceSetup } from '@/components/dashboard/DeviceSetup'
import { InfoUpdateBox } from '@/components/dashboard/InfoUpdateBox'
import { text } from '@/lib/typography'
import { isValidUrl } from '@/lib/api'

interface HomePageProps {
  onSwitchTab: (tab: string) => void
}

export function HomePage({ onSwitchTab }: HomePageProps) {
  const [url, setUrl] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('Just PDF')
  const [customPrompt, setCustomPrompt] = useState('')
  const [showInfoUpdate, setShowInfoUpdate] = useState(true)
  const [urlError, setUrlError] = useState<string | null>(null)
  const { isLoading, isSuccess, error, submitLink } = useLinkProcessor()
  const { userProfile, isLoading: profileLoading, refetch } = useUserProfile()

  const { greeting, emoji } = getTimeBasedGreeting()

  // URL validation function
  const validateUrl = (inputUrl: string): string | null => {
    if (!inputUrl.trim()) {
      return 'Please enter a URL'
    }

    // Add protocol if missing
    let urlToValidate = inputUrl.trim()
    if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
      urlToValidate = 'https://' + urlToValidate
    }

    if (!isValidUrl(urlToValidate)) {
      return 'Please enter a valid URL'
    }

    return null
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)

    // Clear error when user starts typing
    if (urlError) {
      setUrlError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate URL
    const validationError = validateUrl(url)
    if (validationError) {
      setUrlError(validationError)
      return
    }

    // Add protocol if missing
    let processUrl = url.trim()
    if (!processUrl.startsWith('http://') && !processUrl.startsWith('https://')) {
      processUrl = 'https://' + processUrl
    }

    await submitLink(processUrl, selectedFormat, customPrompt)
  }

  const handleDeviceSetupComplete = () => {
    refetch() // Refresh user profile
  }

  const handleInfoUpdateComplete = () => {
    console.log('🔍 HomePage: handleInfoUpdateComplete called, setting showInfoUpdate to false');
    setShowInfoUpdate(false)
    refetch() // Refresh user profile
  }

  const handleInfoUpdateDismiss = () => {
    setShowInfoUpdate(false)
  }

  // Check if user has completed Kindle setup
  // Based on your API response: kindle_email exists AND acknowledged_mail_whitelisting is 'yes'
  const hasKindleSetup = Boolean(
    userProfile?.kindle_email &&
    userProfile?.acknowledged_mail_whitelisting?.toLowerCase() === 'yes'
  )

  // Only show onboarding if user doesn't have a complete setup
  const shouldShowInfoUpdate = userProfile && showInfoUpdate && !hasKindleSetup

  // Debug what we're getting from API
  // React.useEffect(() => {
  //   if (userProfile) {
  //     console.log('🔍 HomePage Debug:', {
  //       kindle_email: userProfile.kindle_email,
  //       acknowledged_mail_whitelisting: userProfile.acknowledged_mail_whitelisting,
  //       hasKindleSetup,
  //       shouldShowInfoUpdate,
  //       showInfoUpdate
  //     })
  //   }
  // }, [userProfile, hasKindleSetup, shouldShowInfoUpdate])

  if (profileLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-[15px] text-[#273F4F]/70">Loading...</div>
      </div>
    )
  }

  // If no user profile (API failed), show error
  if (!userProfile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-[15px] text-red-600 mb-2">Failed to load profile</div>
          <div className="text-[13px] text-[#273F4F]/70">Please check your connection and try again</div>
        </div>
      </div>
    )
  }

  // Show device setup if user hasn't set up their device
  if (!hasKindleSetup) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-8">
          <DeviceSetup onComplete={handleDeviceSetupComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className={`${text.sectionTitle} mb-2 flex items-center space-x-2 text-xl sm:text-2xl lg:text-3xl`}>
            <span>{greeting}, {userProfile?.name?.split(' ')[0] || 'there'}</span>
            <span className="text-lg sm:text-xl">{emoji}</span>
          </h1>
        </div>

        {/* Info Update Box */}
        {shouldShowInfoUpdate && (
          <InfoUpdateBox
            onComplete={handleInfoUpdateComplete}
            onDismiss={handleInfoUpdateDismiss}
          />
        )}

        <div data-testid="conversion-screen" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          {/* Left Column - Convert & Send */}
          <div className="space-y-4 lg:space-y-6">
            {/* Quick Convert & Send */}
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-4 sm:p-6">
              <h2 className={`${text.componentTitle} mb-4 lg:mb-6`}>Quick Send</h2>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                {/* URL Input */}
                <div>
                  <label className={`block ${text.label} mb-3`}>
                    Enter an URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Paste your link - webpage, YouTube, Wikipedia, Reddit, etc."
                    className={`w-full px-4 py-3 border rounded-[8px] ${text.body} focus:outline-none focus:ring-2 transition-all duration-200 ${
                      urlError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:ring-brand-primary/20 focus:border-brand-primary'
                    }`}
                  />
                  {urlError && (
                    <p className={`${text.caption} mt-2 text-red-600`}>
                      {urlError}
                    </p>
                  )}
                  {!urlError && (
                    <p className={`${text.caption} mt-2`}>
                      Try an example: <span className={text.link}>How to Grow Your Startup on a $0 Marketing Budget</span>
                    </p>
                  )}
                </div>

                {/* Format Selection */}
                <div>
                  <label className={`block ${text.label} mb-3`}>
                    Choose your format:
                  </label>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
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
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Description - Only show when Custom is selected */}
                {selectedFormat === 'Custom' && (
                  <div>
                    <label className={`block ${text.label} mb-3`}>
                      Describe how you want it:
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g., 'Make it a study guide with key points highlighted'"
                      className={`w-full px-4 py-3 border border-gray-200 rounded-[8px] ${text.body} focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none`}
                      rows={3}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !url.trim() || (selectedFormat === 'Custom' && !customPrompt.trim())}
                  className="w-full px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Converting...</span>
                    </>
                  ) : (
                    <span>Send to Kindle</span>
                  )}
                </button>

                {/* Status Messages */}
                {isSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-[8px]">
                    <p className={text.success}>✓ Successfully sent to your Kindle!</p>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-[8px]">
                    <p className={text.error}>{error}</p>
                  </div>
                )}
              </form>
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className={`px-4 ${text.caption} bg-[#EFEEEA]`}>OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Quick Send File Upload */}
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-4 sm:p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-[12px] p-6 sm:p-8 text-center hover:border-brand-primary/50 transition-colors duration-150 cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-gray-500" />
                </div>
                <p className={`${text.body} mb-2`}>Click to upload or drag and drop</p>
                <p className={text.caption}>MD, DOCX, EPUB, PDF* (max 20MB)</p>
                <p className={`${text.footnote} mt-2`}>* Only available for legacy paying customers</p>
                <p className={text.footnote}>* For best quality, use a non-scanned, text-based PDF document</p>
              </div>

              <button className="w-full mt-4 px-6 py-3 bg-[#273F4F] text-white text-base font-medium rounded-[8px] hover:bg-[#273F4F]/90 transition-colors duration-150">
                Send to Kindle
              </button>
            </div>
          </div>

          {/* Right Column - Kindle Preview */}
          <div className="hidden lg:flex items-start justify-center p-4 pt-0">
            <div className="relative w-full max-w-md">
              {/* Kindle Device Mockup - Height adjusted to match left column */}
              <div className="w-full bg-black rounded-[20px] p-4 shadow-2xl" style={{ height: 'calc(100vh - 280px)', minHeight: '500px', maxHeight: '700px' }}>
                <div className="w-full h-full bg-white rounded-[12px] p-4 flex flex-col">
                  {/* Kindle Screen Content */}
                  <div className="flex-1 bg-gray-100 rounded-[8px] p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Your converted content</p>
                      <p className="text-xs text-gray-500">will appear here</p>
                    </div>
                  </div>

                  {/* Kindle Logo */}
                  <div className="text-center mt-4">
                    <span className="text-lg font-light text-gray-600">kindle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
