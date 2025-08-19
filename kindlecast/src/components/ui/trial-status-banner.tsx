'use client'

import React, { useState } from 'react'
import { Crown, Clock } from 'lucide-react'
import { text } from '@/lib/typography'
import { usePayment } from '@/hooks/usePayment'
import { UpgradePlansModal } from '@/components/ui/upgrade-plans-modal'

interface TrialStatusBannerProps {
  subscriptionType?: string
  className?: string
}

export function TrialStatusBanner({
  subscriptionType,
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

  // Show upgrade banner for free users
  return (
    <div className={`w-full bg-violet-500 ${className}`}>
      <div className="flex items-center justify-center py-2 px-4">
        <div className="flex items-center space-x-2">
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
