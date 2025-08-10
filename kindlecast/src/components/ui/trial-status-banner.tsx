'use client'

import React from 'react'
import { Crown, Clock } from 'lucide-react'
import { text } from '@/lib/typography'

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
  // Don't show banner for subscribed users
  if (userSubscribed) {
    return null
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
            <a
              href="https://www.creem.io/test/payment/prod_oGpAgPwct4S52vtAbFHOX"
              className={`${text.caption} text-white underline hover:text-white/80 transition-colors ml-2`}
            >
              Upgrade Now, Save your Eyes!
            </a>
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
          <a
            href="https://www.creem.io/test/payment/prod_oGpAgPwct4S52vtAbFHOX"
            className={`${text.caption} text-white underline hover:text-white/80 transition-colors ml-2`}
          >
            Upgrade Now, Save your Eyes!
          </a>
        </div>
      </div>
    </div>
  )
}
