'use client'

import React from 'react'
import { Crown, Clock } from 'lucide-react'
import { text } from '@/lib/typography'
import { usePayment } from '@/hooks/usePayment'
// Removed usePricingPlans - will use hardcoded premium plan name

interface TrialStatusBannerProps {
  userSubscribed: boolean
  trialDaysRemaining: number
  className?: string
}

export function TrialStatusBanner({
  userSubscribed,
  trialDaysRemaining,
  className = ''
}: TrialStatusBannerProps) {
  const { redirectToPayment, isLoading } = usePayment()

  // Don't show banner for subscribed users
  if (userSubscribed) {
    return null
  }

  const handleUpgradeClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isLoading) {
      try {
        // Use hardcoded premium plan name to avoid API call
        await redirectToPayment('premium-monthly')
      } catch (error) {
        console.error('Failed to initiate payment:', error)
      }
    }
  }

  // Trial expired
  if (trialDaysRemaining <= 0) {
    return (
      <div className={`w-full bg-red-500 ${className}`}>
        <div className="flex items-center justify-center py-2 px-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white" />
            <span className={`${text.caption} text-white`}>
              Your trial has expired.
            </span>
            <button
              onClick={handleUpgradeClick}
              disabled={isLoading}
              className={`${text.caption} text-white underline hover:text-white/80 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : 'Upgrade Now, Save your Eyes!'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active trial
  return (
    <div className={`w-full bg-orange-500 ${className}`}>
      <div className="flex items-center justify-center py-2 px-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-white" />
          <span className={`${text.caption} text-white`}>
            {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} left in trial.
          </span>
          <button
            onClick={handleUpgradeClick}
            disabled={isLoading}
            className={`${text.caption} text-white underline hover:text-white/80 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Processing...' : 'Upgrade Now, Save your Eyes!'}
          </button>
        </div>
      </div>
    </div>
  )
}
