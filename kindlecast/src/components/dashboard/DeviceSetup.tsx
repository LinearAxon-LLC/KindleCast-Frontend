'use client'

import React, { useState } from 'react'
import { CheckCircle, AlertTriangle, Copy, ExternalLink } from 'lucide-react'
import { useUserProfile } from '@/hooks/useUserProfile'

interface DeviceSetupProps {
  onComplete: () => void
}

export function DeviceSetup({ onComplete }: DeviceSetupProps) {
  const { setupDevice } = useUserProfile()
  const [step, setStep] = useState(1)
  const [kindleEmail, setKindleEmail] = useState('')
  const [kindlecastEmail, setKindlecastEmail] = useState('')
  const [confirmed, setConfirmed] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = async () => {
    if (step === 1) {
      if (!kindleEmail.trim()) {
        setError('Please enter your Kindle email prefix')
        return
      }
      // Validate that it doesn't contain @ (since we append @kindle.com)
      if (kindleEmail.includes('@')) {
        setError('Please enter only the part before @kindle.com')
        return
      }
      setError('')
      setStep(2)
    } else if (step === 2) {
      if (confirmed.toLowerCase() !== 'yes') {
        setError('Please enter "YES" to confirm you have added our email to your approved list')
        return
      }
      
      setIsLoading(true)
      setError('')

      // Append @kindle.com to the email prefix
      const fullKindleEmail = `${kindleEmail}@kindle.com`
      const result = await setupDevice(fullKindleEmail, 'yes')

      if (result.success) {
        setKindlecastEmail(result.kindlecastEmail || '')
        setStep(3)
      } else {
        setError(result.error || 'Failed to setup device')
      }

      setIsLoading(false)
    } else if (step === 3) {
      onComplete()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[24px] font-bold text-[#273F4F] mb-2">Set up your device</h2>
          <p className="text-[15px] text-[#273F4F]/70">
            Connect your Kindle to start receiving converted content
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${
              step >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-brand-primary' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${
              step >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-brand-primary' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${
              step >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[15px] font-medium text-[#273F4F] mb-3">
                Your Send-to-Kindle email address
                <a href="#" className="text-brand-primary text-[13px] ml-2 hover:underline">
                  what's this?
                </a>
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={kindleEmail}
                  onChange={(e) => setKindleEmail(e.target.value)}
                  placeholder="Enter everything before the @ symbol"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-l-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
                <div className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-200 rounded-r-[8px] text-[15px] text-gray-600">
                  @kindle.com
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[15px] font-medium text-[#273F4F] mb-3">
                Your Kinddy sender email address
                <a href="#" className="text-brand-primary text-[13px] ml-2 hover:underline">
                  what's this?
                </a>
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={kindlecastEmail || 'no-reply@kindlecast.com'}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-l-[8px] text-[15px] bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(kindlecastEmail || 'no-reply@kindlecast.com')}
                  className="px-4 py-3 bg-brand-primary text-white rounded-r-[8px] hover:bg-brand-primary/90 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-[8px] p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[15px] font-semibold text-red-800 mb-2">Notice</h4>
                  <p className="text-[13px] text-red-700 mb-3">
                    To avoid spam, Amazon requires all documents sent to your Send-to-Kindle 
                    address to come from an approved e-mail address.
                  </p>
                  <a 
                    href="#" 
                    className="text-[13px] text-red-600 hover:underline flex items-center space-x-1"
                  >
                    <span>Click here to add your KTool email address to your Approved Personal Document Email List.</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="mt-4">
                    <p className="text-[13px] text-red-700 mb-2">
                      Once completed, enter YES to the field below
                    </p>
                    <input
                      type="text"
                      value={confirmed}
                      onChange={(e) => setConfirmed(e.target.value)}
                      placeholder="Enter YES to confirm..."
                      className="w-full px-3 py-2 border border-red-300 rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-[20px] font-semibold text-[#273F4F] mb-2">Setup Complete!</h3>
              <p className="text-[15px] text-[#273F4F]/70">
                Your device is now ready to receive converted content.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            className={`px-6 py-2.5 text-[15px] font-medium rounded-[8px] transition-colors ${
              step > 1 
                ? 'text-[#273F4F] hover:bg-gray-100' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={step === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-2.5 bg-brand-primary text-white text-[15px] font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Setting up...' : step === 3 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
