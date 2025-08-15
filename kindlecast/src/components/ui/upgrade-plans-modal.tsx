'use client'

import React from 'react'
import { X, Crown, Check, Loader2 } from 'lucide-react'
import { usePricingPlans } from '@/hooks/usePricingPlans'
import { usePayment } from '@/hooks/usePayment'
import { text } from '@/lib/typography'
import { SubscriptionPlan } from '@/types/api'

interface UpgradePlansModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradePlansModal({ isOpen, onClose }: UpgradePlansModalProps) {
  const { plans, isLoading: plansLoading } = usePricingPlans()
  const { redirectToPayment, isLoading: paymentLoading } = usePayment()

  // Filter out free plans
  const paidPlans = plans.filter(plan => plan.subscription_type !== 'free')

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
      <div className="bg-white rounded-[20px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-[20px] border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className={`${text.sectionTitle} flex items-center gap-3`}>
              <Crown className="w-6 h-6 text-brand-primary" />
              Upgrade Your Plan
            </h2>
            <p className={`${text.bodySecondary} mt-1`}>
              Choose the perfect plan for your reading needs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-[8px] transition-colors duration-150"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {plansLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                <span className={text.body}>Loading plans...</span>
              </div>
            </div>
          ) : paidPlans.length === 0 ? (
            <div className="text-center py-12">
              <p className={text.body}>No premium plans available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidPlans.map((plan) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  onUpgrade={handleUpgrade}
                  isLoading={paymentLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface PlanCardProps {
  plan: SubscriptionPlan
  onUpgrade: (planName: string) => void
  isLoading: boolean
}

function PlanCard({ plan, onUpgrade, isLoading }: PlanCardProps) {
  const isPopular = plan.is_most_popular
  const hasDiscount = plan.original_price > plan.discounted_price

  return (
    <div className={`relative bg-white border-2 rounded-[16px] p-6 transition-all duration-200 hover:shadow-lg ${
      isPopular 
        ? 'border-brand-primary shadow-lg scale-105' 
        : 'border-gray-200 hover:border-brand-primary/50'
    }`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-4 py-1 rounded-full text-[12px] font-semibold shadow-lg">
            Most Popular
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <h3 className={`${text.componentTitle} mb-2`}>{plan.display_name}</h3>
        
        {/* Pricing */}
        <div className="mb-4">
          {hasDiscount && (
            <div className="text-[14px] text-gray-500 line-through mb-1">
              ${plan.original_price.toFixed(2)}/{plan.billing_cycle}
            </div>
          )}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-[#273F4F]">
              ${plan.discounted_price.toFixed(2)}
            </span>
            <span className={`${text.caption} text-gray-600`}>
              /{plan.billing_cycle}
            </span>
          </div>
          {hasDiscount && (
            <div className="text-[12px] text-green-600 font-medium mt-1">
              Save ${(plan.original_price - plan.discounted_price).toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className={`${text.small} text-gray-700`}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Upgrade Button */}
      <button
        onClick={() => onUpgrade(plan.name)}
        disabled={isLoading}
        className={`w-full px-6 py-3 rounded-[8px] font-medium transition-all duration-150 active:scale-[0.98] ${
          isPopular
            ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl'
            : 'bg-brand-primary text-white hover:bg-brand-primary/90'
        } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Crown className="w-4 h-4" />
            <span>Upgrade Now</span>
          </>
        )}
      </button>
    </div>
  )
}
