'use client'

import React from 'react'
import { X, Crown, Check, Loader2 } from 'lucide-react'
import { usePricingPlans } from '@/hooks/usePricingPlans'
import { usePayment } from '@/hooks/usePayment'
import { useAuth } from '@/contexts/AuthContext'

interface UpgradePlansModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradePlansModal({ isOpen, onClose }: UpgradePlansModalProps) {
  const { plans, isLoading: plansLoading, isUserCurrentPlan } = usePricingPlans()
  const { redirectToPayment, isLoading: paymentLoading } = usePayment()
  const { user } = useAuth()

  // Get all premium plans (exclude free plans)
  const premiumPlans = plans.filter(plan => plan.subscription_type === 'premium')

  const handleUpgrade = async (planName: string) => {
    try {
      await redirectToPayment(planName)
    } catch (error) {
      console.error('Failed to initiate payment:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Dialog */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-[600px] mx-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 flex items-center justify-center transition-colors duration-150 z-10"
        >
          <X className="w-4 h-4 text-black/60" />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6">
          {/* Header */}
          <div className="text-center mb-8">
            {/*<div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center mx-auto mb-4">*/}
            {/*  <Crown className="w-8 h-8 text-white" />*/}
            {/*</div>*/}
            <h2 className="text-[20px] font-bold text-black/90 mb-2">
              Upgrade to <b className="text-brand-primary">Kinddy</b> Premium
            </h2>
            <p className="text-[14px] text-black/60">
              Choose the perfect plan for your needs
            </p>
          </div>

          {/* Premium Plans */}
          {plansLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                <span className="text-[15px] text-black/70">Loading plans...</span>
              </div>
            </div>
          ) : premiumPlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[15px] text-black/70">No premium plans available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-scroll scrollbar-hide">
              {premiumPlans.map((plan) => {
                const isCurrentPlan = isUserCurrentPlan(plan.name, user?.subscription_name)
                const isPlus = plan.display_name.toLowerCase() === "plus"
                const isPro = plan.display_name.toLowerCase() === "pro"

                return (
                  <div
                    key={plan.name}
                    className={`rounded-2xl p-6 relative transition-all duration-200 ${
                      isCurrentPlan
                        ? 'opacity-60'
                        : isPlus
                        ? "bg-brand-secondary"
                        : "bg-brand-primary"
                    }`}
                  >
                    {/* Most Popular Badge */}
                    {plan.is_most_popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-brand-accent text-brand-primary px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      {/* Plan Title */}
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {plan.display_name}
                      </h3>

                      {/* Pricing */}
                      <div className="mb-6">
                        {plan.original_price !== plan.discounted_price && plan.original_price > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-white/60 line-through text-sm">
                              ${plan.original_price}/{plan.billing_cycle}
                            </span>
                            <span className="text-3xl font-bold text-white">
                              ${plan.discounted_price}
                            </span>
                            <span className="text-white/80 text-sm">
                              /{plan.billing_cycle}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">
                              ${plan.discounted_price}
                            </span>
                            <span className="text-white/80 text-sm">
                              /{plan.billing_cycle}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-6 text-left">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white flex-shrink-0"></div>
                            <span className="text-sm text-white/90">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Action Button */}
                      <button
                        onClick={() => handleUpgrade(plan.name)}
                        disabled={isCurrentPlan || paymentLoading}
                        className={`w-full cursor-pointer text-sm font-medium py-3 px-4 rounded-[8px] transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 ${
                          isCurrentPlan
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-white text-brand-primary hover:bg-gray-100"
                        } ${paymentLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {paymentLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : isCurrentPlan ? (
                          "Your Current Subscription"
                        ) : (
                          <>
                            <Crown className="w-4 h-4" />
                            Upgrade to {plan.display_name}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


