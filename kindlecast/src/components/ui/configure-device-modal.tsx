"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  MonitorCog,
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { text } from "@/lib/typography";

interface ConfigureDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ConfigureDeviceModal({
  isOpen,
  onClose,
  onSuccess,
}: ConfigureDeviceModalProps) {
  const { userProfile, setupDevice } = useUserProfile();
  const [step, setStep] = useState(1);
  const [kindleEmail, setKindleEmail] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const KINDDY_SENDER_EMAIL = "send@kinddy.com";
  const isConfigured = Boolean(
    userProfile?.kindle_email &&
      userProfile?.acknowledged_mail_whitelisting?.toLowerCase() === "yes"
  );

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isConfigured && userProfile?.kindle_email) {
        // Extract email prefix for editing
        const emailPrefix = userProfile.kindle_email.replace("@kindle.com", "");
        setKindleEmail(emailPrefix);
        setConfirmed("yes");
        setStep(1); // For configured users, we only need step 1
      } else {
        // Reset for new configuration
        setKindleEmail("");
        setConfirmed("");
        setStep(1);
      }
      setError("");
    }
  }, [isOpen, isConfigured, userProfile?.kindle_email]);

  const handleNext = async () => {
    if (step === 1) {
      if (!kindleEmail.trim()) {
        setError("Please enter your Kindle email prefix");
        return;
      }
      // Validate that it doesn't contain @ (since we append @kindle.com)
      if (kindleEmail.includes("@")) {
        setError("Please enter only the part before @kindle.com");
        return;
      }
      setError("");

      if (isConfigured) {
        // For configured users, submit directly
        await handleSubmit();
      } else {
        // For new users, go to whitelisting step
        setStep(2);
      }
    } else if (step === 2) {
      // This is the whitelisting confirmation step
      if (confirmed.toLowerCase() !== "yes") {
        setError(
          'Please enter "YES" to confirm you have whitelisted our email'
        );
        return;
      }
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Append @kindle.com to the email prefix
      const fullKindleEmail = `${kindleEmail}@kindle.com`;
      const result = await setupDevice(fullKindleEmail, confirmed || "yes");

      if (result.success) {
        // Success! Close modal and call success callback
        onClose();
        if (onSuccess) {
          window.location.reload();
        }
      } else {
        setError(result.error || "Failed to configure device");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-[480px] mx-4 overflow-hidden">
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
              <MonitorCog className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[17px] font-semibold text-black mb-2 text-center leading-tight">
            {isConfigured ? "Update Kindle Email" : "Configure Your Kindle"}
          </h2>

          {/* Message */}
          <p className="text-[13px] text-black/70 text-center leading-relaxed mb-6">
            {isConfigured
              ? "Update your Kindle email address below."
              : "Set up your Kindle to receive converted content directly."}
          </p>

          {/* Step 1: Kindle Email Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-black/80 mb-2 flex items-center justify-between">
                  <span>Enter your Send-To-Kindle Email </span>
                  <u className="text-[10px]">
                    <a
                      className="text-brand-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.amazon.com/hz/mycd/preferences/myx#/home/settings/"
                    >
                      [↗ Under "Personal Document Settings"]
                    </a>
                  </u>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={kindleEmail}
                    onChange={(e) => setKindleEmail(e.target.value)}
                    placeholder="your-kindle-email"
                    className="w-full px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] text-[15px] placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-black/50">
                    @kindle.com
                  </div>
                </div>
                <p className="text-[11px] text-black/60 mt-1">
                  Enter only the part before @kindle.com
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[8px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-[13px] text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={isLoading || !kindleEmail.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-[10px] hover:bg-brand-primary/90 active:bg-brand-primary/80 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-primary disabled:active:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[15px] font-medium">
                      {isConfigured ? "Updating..." : "Configuring..."}
                    </span>
                  </>
                ) : (
                  <span className="text-[15px] font-medium">
                    {isConfigured ? "Update Email" : "Next"}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Whitelisting Confirmation (only for new configurations) */}
          {step === 2 && !isConfigured && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
                <h4 className="text-[15px] font-semibold text-blue-800 mb-2">
                  Important: Whitelist Our Email
                </h4>
                <p className="text-[12px] text-blue-700 mb-3">
                  To receive content on your Kindle, you must add{" "}
                  <strong className="text-[14px]">{KINDDY_SENDER_EMAIL}</strong>{" "}
                  to your approved email list in your Amazon account.
                </p>
                <div className="text-[13px] text-blue-600">
                  <p className="mb-1">
                    1. Go to Amazon → Manage Your Content and Devices{" "}
                    <u>
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href="https://www.amazon.com/hz/mycd/preferences/myx#/home/settings/"
                      >
                        [Link ↗]
                      </a>
                    </u>
                  </p>
                  <p className="mb-1">
                    2. Click "Preferences" → "Personal Document Settings"
                  </p>
                  <p>
                    3. Add{" "}
                    <strong className="text-[14px]">
                      {KINDDY_SENDER_EMAIL}
                    </strong>{" "}
                    to approved email list
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black/80 mb-2">
                  Confirm Whitelisting
                </label>
                <input
                  type="text"
                  value={confirmed}
                  onChange={(e) => setConfirmed(e.target.value)}
                  placeholder="Type YES to confirm"
                  className="w-full px-4 py-3 bg-white border border-black/[0.08] rounded-[10px] text-[15px] placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30"
                />
                <p className="text-[11px] text-black/60 mt-1">
                  Type "YES" to confirm you have whitelisted our email
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[8px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-[13px] text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white border border-black/[0.08] text-black rounded-[10px] hover:bg-black/[0.02] active:bg-black/[0.05] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-[15px] font-medium">Back</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={isLoading || confirmed.toLowerCase() !== "yes"}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-[10px] hover:bg-brand-primary/90 active:bg-brand-primary/80 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-primary disabled:active:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-[15px] font-medium">
                        Configuring...
                      </span>
                    </>
                  ) : (
                    <span className="text-[15px] font-medium">
                      Complete Setup
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
