'use client'

import React, { useState } from 'react'
import { Crown, Clock } from 'lucide-react'
import { text } from '@/lib/typography'
import { usePayment } from '@/hooks/usePayment'
import { UpgradePlansModal } from '@/components/ui/upgrade-plans-modal'

interface TrialStatusBannerProps {
  subscriptionType?: string
  trialDaysRemaining: number
  className?: string
}

export function TrialStatusBanner({
  subscriptionType,
  trialDaysRemaining,
  className = ''
}: TrialStatusBannerProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Don't show banner for non-free users
  if (subscriptionType && subscriptionType !== 'free') {
    return null
  }

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowUpgradeModal(true)
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
              className={`${text.caption} text-white underline hover:text-white/80 transition-colors ml-2`}
            >
              Upgrade Now, Save your Eyes!
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
            className={`${text.caption} text-white underline hover:text-white/80 transition-colors ml-2`}
          >
            Upgrade Now, Save your Eyes!
          </button>
        </div>
      </div>

      {/* Upgrade Plans Modal */}
      <UpgradePlansModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  )
}
