"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Smartphone,
  Crown,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { usePayment } from "@/hooks/usePayment";
import Image from "next/image";
import { useBillingPortal } from "@/hooks/useBillingPortal";
import { text } from "@/lib/typography";
import { UpgradePlansModal } from "@/components/ui/upgrade-plans-modal";
import { ConfigureDeviceModal } from "@/components/ui/configure-device-modal";
import { useUserUsage } from "@/hooks/useUserUsage";

export function SettingsPage() {
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  const { plans, getUserCurrentPlan } = usePricingPlans();
  const { redirectToPayment, isLoading: paymentLoading } = usePayment();
  const { openBillingPortal, isLoading: billingLoading } = useBillingPortal();
  const { usage } = useUserUsage();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showConfigureDeviceModal, setShowConfigureDeviceModal] =
    useState(false);

  // Get user's current plan and premium plan for upgrade
  const currentPlan = getUserCurrentPlan(user?.subscription_name);
  const premiumPlan = plans.find(
    (plan) => plan.subscription_type.toLowerCase() === "premium"
  );
  const isFreePlan = currentPlan?.subscription_type.toLowerCase() === "free";
  const isPremiumPlan =
    currentPlan?.subscription_type.toLowerCase() === "premium";

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handleConfigureDevice = () => {
    setShowConfigureDeviceModal(true);
  };

  const handleDeviceConfigured = () => {
    // Refresh user profile to get updated data
    window.location.reload();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${text.sectionTitle} mb-2`}>Settings</h1>
          <p className={text.bodySecondary}>
            Manage your account and preferences
          </p>
        </div>

        <div className="max-w-4xl space-y-8">
          {/* Profile Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10  rounded-[8px] flex items-center justify-center">
                <img
                  src={
                    user?.avatar ||
                    "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png"
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png";
                  }}
                />
              </div>
              <div>
                <h2 className={text.componentTitle}>Your Profile</h2>
                {/*<p className={text.caption}>Update your personal information</p>*/}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-[#273F4F]/70 mb-2">
                  Display Name
                </label>
                <input
                  disabled
                  type="text"
                  defaultValue={user?.name || ""}
                  className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#273F4F]/70 mb-2">
                  Email (Signed Up)
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue={user?.email || ""}
                  className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/*<div className="flex justify-end mt-6">*/}
            {/*  <button className="px-6 py-2.5 bg-brand-primary text-white text-[13px] font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150">*/}
            {/*    Save Changes*/}
            {/*  </button>*/}
            {/*</div>*/}
          </div>

          {/* Device Settings Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-[8px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#273F4F]">
                  Device Settings
                </h2>
                <p className="text-[13px] text-[#273F4F]/60">
                  Manage your Kindle device connection
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/[0.02] rounded-[8px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[15px] font-medium text-[#273F4F]">
                      Kindle Email
                    </div>
                    <div className="text-[13px] text-[#273F4F]/60">
                      {userProfile?.kindle_email || "Not configured"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/[0.02] rounded-[8px]">
                <div className="text-[15px] font-medium text-[#273F4F]">
                  Kinddy Sender Email
                </div>
                <p className={text.caption}>
                  You will receive converted content from this email.
                </p>
                <div className="text-lg text-brand-primary font-regular mt-4">
                  hello@kinddy.com
                </div>
              </div>

              <button
                onClick={handleConfigureDevice}
                className="px-4 py-2.5 bg-brand-primary text-white text-[13px] font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150"
              >
                {userProfile?.kindle_email
                  ? "Change Kindle Email"
                  : "Configure Device"}
              </button>
            </div>
          </div>

          {/* Billing Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-[8px] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#273F4F]">
                  Billing & Subscription
                </h2>
                <p className="text-[13px] text-[#273F4F]/60">
                  Manage your subscription and billing
                </p>
              </div>
            </div>

            {/* Current Plan Display */}
            <div
              className={`p-4 rounded-[8px] border ${
                isFreePlan
                  ? "bg-gray-50 border-gray-200"
                  : "bg-gradient-to-r from-brand-primary/10 to-green-500/10 border-brand-primary/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-semibold text-[#273F4F]">
                    {currentPlan?.display_name || "Free Plan"}
                  </div>
                  <div className="text-[13px] text-[#273F4F]/60">
                    {`${
                      usage?.basic_monthly_limit === -1
                        ? "Unlimited"
                        : usage?.basic_monthly_limit
                    } basic conversions & ${
                      usage?.ai_monthly_limit
                    } AI conversions per month`}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-[17px] font-bold ${
                      isFreePlan ? "text-gray-600" : "text-brand-primary"
                    }`}
                  >
                    ${currentPlan?.discounted_price?.toFixed(2) || "0.00"}/
                    {currentPlan?.billing_cycle || "month"}
                  </div>
                  {!isFreePlan && (
                    <div className="text-[11px] text-[#273F4F]/60">
                      Active subscription
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upgrade Button for Free Users */}
            {isFreePlan && premiumPlan && (
              <div className="mt-4 p-4 bg-gradient-to-r from-brand-primary/5 to-purple-500/5 rounded-[8px] border border-brand-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-brand-primary" />
                    <div>
                      <div className="text-[15px] font-semibold text-[#273F4F]">
                        Upgrade to {premiumPlan.display_name}
                      </div>
                      <div className="text-[13px] text-[#273F4F]/60">
                        Get unlimited conversions and premium features
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    disabled={false}
                    className="px-4 py-2.5 bg-brand-primary text-white text-[13px] font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}

            {isPremiumPlan && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={openBillingPortal}
                  disabled={billingLoading}
                  className="px-4 py-2.5 bg-black/[0.04] text-[#273F4F] text-[13px] font-medium rounded-[8px] hover:bg-black/[0.08] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {billingLoading && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  View Billing History
                </button>
                <button
                  onClick={openBillingPortal}
                  disabled={billingLoading}
                  className="px-4 py-2.5 bg-black/[0.04] text-[#273F4F] text-[13px] font-medium rounded-[8px] hover:bg-black/[0.08] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {billingLoading && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  Update Payment Method
                </button>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          {/*<div className="bg-white/80 backdrop-blur-xl border border-red-200 rounded-[16px] p-6">*/}
          {/*  <div className="flex items-center gap-3 mb-6">*/}
          {/*    <div className="w-10 h-10 bg-red-500/10 rounded-[8px] flex items-center justify-center">*/}
          {/*      <Trash2 className="w-5 h-5 text-red-500" />*/}
          {/*    </div>*/}
          {/*    <div>*/}
          {/*      <h2 className="text-[17px] font-semibold text-red-600">Danger Zone</h2>*/}
          {/*      <p className="text-[13px] text-red-500/70">Irreversible actions</p>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <button className="px-4 py-2.5 bg-red-50 text-red-600 text-[13px] font-medium rounded-[8px] hover:bg-red-100 transition-colors duration-150 border border-red-200">*/}
          {/*    Delete Account*/}
          {/*  </button>*/}
          {/*</div>*/}
        </div>
      </div>

      {/* Upgrade Plans Modal */}
      <UpgradePlansModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Configure Device Modal */}
      <ConfigureDeviceModal
        isOpen={showConfigureDeviceModal}
        onClose={() => setShowConfigureDeviceModal(false)}
        onSuccess={handleDeviceConfigured}
      />
    </div>
  );
}
