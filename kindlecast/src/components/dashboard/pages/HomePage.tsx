'use client'

import React, { useState } from 'react'
import { Plus, FileText, Upload } from 'lucide-react'
import { useLinkProcessor } from '@/hooks/useLinkProcessor'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getTimeBasedGreeting } from '@/lib/time-utils'
import { DeviceSetup } from '@/components/dashboard/DeviceSetup'
import { InfoUpdateBox } from '@/components/dashboard/InfoUpdateBox'
import { text } from '@/lib/typography'

interface HomePageProps {
  onSwitchTab: (tab: string) => void
}

export function HomePage({ onSwitchTab }: HomePageProps) {
  const [url, setUrl] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('Just PDF')
  const [customPrompt, setCustomPrompt] = useState('')
  const [showInfoUpdate, setShowInfoUpdate] = useState(true)
  const { isLoading, isSuccess, error, submitLink } = useLinkProcessor()
  const { userProfile, isLoading: profileLoading, refetch } = useUserProfile()

  const { greeting, emoji } = getTimeBasedGreeting()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitLink(url, selectedFormat, customPrompt)
  }

  const handleDeviceSetupComplete = () => {
    refetch() // Refresh user profile
  }

  const handleInfoUpdateComplete = () => {
    setShowInfoUpdate(false)
    refetch() // Refresh user profile
  }

  const handleInfoUpdateDismiss = () => {
    setShowInfoUpdate(false)
  }

  // Check if we should show the info update box
  const shouldShowInfoUpdate = userProfile && showInfoUpdate && (
    !userProfile.kindle_email ||
    !userProfile.acknowledged_mail_whitelisting ||
    userProfile.acknowledged_mail_whitelisting.toLowerCase() !== 'yes'
  )

  if (profileLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-[15px] text-[#273F4F]/70">Loading...</div>
      </div>
    )
  }

  // Show device setup if user hasn't set up their device
  if (userProfile && !userProfile.set_up_device) {
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
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${text.sectionTitle} mb-2 flex items-center space-x-2`}>
            <span>{greeting}, {userProfile?.name?.split(' ')[0] || 'there'}</span>
            <span className="text-xl">{emoji}</span>
          </h1>
        </div>

        {/* Info Update Box */}
        {shouldShowInfoUpdate && (
          <InfoUpdateBox
            onComplete={handleInfoUpdateComplete}
            onDismiss={handleInfoUpdateDismiss}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - Convert & Send */}
          <div className="space-y-6">
            {/* Quick Convert & Send */}
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
              <h2 className={`${text.componentTitle} mb-6`}>Quick Send</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* URL Input */}
                <div>
                  <label className={`block ${text.label} mb-3`}>
                    Enter an URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.nature.com/..."
                    className={`w-full px-4 py-3 border border-gray-200 rounded-[8px] ${text.body} focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
                    required
                  />
                  <p className={`${text.caption} mt-2`}>
                    Try an example: <span className={text.link}>How to Grow Your Startup on a $0 Marketing Budget</span>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="w-full px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Converting...</span>
                    </>
                  ) : (
                    <span>Preview</span>
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
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-[12px] p-8 text-center hover:border-brand-primary/50 transition-colors duration-150 cursor-pointer">
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
          <div className="flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              {/* Kindle Device Mockup */}
              <div className="w-full h-[500px] bg-black rounded-[20px] p-4 shadow-2xl">
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
