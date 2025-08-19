'use client'

import React from 'react'
import { X, Crown, Check, Loader2 } from 'lucide-react'
import { usePricingPlans } from '@/hooks/usePricingPlans'
import { usePayment } from '@/hooks/usePayment'

interface UpgradePlansModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradePlansModal({ isOpen, onClose }: UpgradePlansModalProps) {
  const { plans, isLoading: plansLoading } = usePricingPlans()
  const { redirectToPayment, isLoading: paymentLoading } = usePayment()

  // Get the first premium plan
  const premiumPlan = plans.find(plan => plan.subscription_type === 'premium')

  const handleUpgrade = async () => {
    if (!premiumPlan) return
    try {
      await redirectToPayment(premiumPlan.name)
    } catch (error) {
      console.error('Failed to initiate payment:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Dialog */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-[520px] mx-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 flex items-center justify-center transition-colors duration-150 z-10"
        >
          <X className="w-4 h-4 text-black/60" />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[17px] font-semibold text-black mb-2 text-center leading-tight">
            Upgrade to Premium
          </h2>

          {/* Message */}
          <p className="text-[13px] text-black/70 text-center leading-relaxed mb-6">
            Unlock unlimited conversions and premium features for the best reading experience.
          </p>

          {plansLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                <span className="text-[15px] text-black/70">Loading plan details...</span>
              </div>
            </div>
          ) : !premiumPlan ? (
            <div className="text-center py-8">
              <p className="text-[15px] text-black/70">Premium plan not available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Premium Plan Card */}
              <div className="bg-black/[0.02] rounded-[12px] p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-medium text-black">Premium Plan</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-brand-primary">${premiumPlan.discounted_price}</span>
                      <span className="text-[13px] text-black/60">/{premiumPlan.billing_cycle}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-[8px] flex items-center justify-center">
                    <Crown className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {[
                    'Unlimited Quick Send',
                    '100 AI Formatting per month',
                    '120 days retention',
                    'Personal email forwarding'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-[13px] text-black/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Button */}
              <button
                onClick={handleUpgrade}
                disabled={paymentLoading}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[15px] font-medium py-3 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    Upgrade Now
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


