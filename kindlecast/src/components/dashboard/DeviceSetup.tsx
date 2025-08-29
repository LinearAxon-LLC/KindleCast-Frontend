"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Copy, ExternalLink } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface DeviceSetupProps {
  onComplete: () => void;
}

export function DeviceSetup({ onComplete }: DeviceSetupProps) {
  const { setupDevice } = useUserProfile();
  const [step, setStep] = useState(1);
  const [kindleEmail, setKindleEmail] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const KINDDY_SENDER_EMAIL = "send@kinddy.com";

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
      setStep(2);
    } else if (step === 2) {
      // This is now the submit step
      if (confirmed.toLowerCase() !== "yes") {
        setError(
          'Please enter "YES" to confirm you have whitelisted our email'
        );
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        // Append @kindle.com to the email prefix
        const fullKindleEmail = `${kindleEmail}@kindle.com`;
        const result = await setupDevice(fullKindleEmail, confirmed);

        if (result.success) {
          // Success! Call onComplete to hide DeviceSetup and show main screen
          // onComplete()
          // onComplete()
          window.location.reload();
        } else {
          setError(result.error || "Failed to connect your Kindle");
        }
      } catch (err) {
        setError("An error occurred while connecting your Kindle");
      }

      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div data-testid="device-setup" className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[24px] font-bold text-[#273F4F] mb-2">
            Connect Your Kindle
          </h2>
          <p className="text-[15px] text-[#273F4F]/70">
            Connect your Kindle to start receiving converted content
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                step >= 1
                  ? "bg-brand-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
            </div>
            <div
              className={`w-12 h-0.5 ${
                step >= 2 ? "bg-brand-primary" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                step >= 2
                  ? "bg-brand-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step >= 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[15px] font-medium text-[#273F4F] mb-3">
                Your Send-to-Kindle email address
                <a
                  href="#"
                  className="text-brand-primary text-[13px] ml-2 hover:underline"
                >
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
                Kinddy Sender Email Address
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={KINDDY_SENDER_EMAIL}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-l-[8px] text-[15px] bg-gray-50 text-gray-700"
                />
                <button
                  onClick={() => copyToClipboard(KINDDY_SENDER_EMAIL)}
                  className="px-4 py-3 bg-brand-primary text-white rounded-r-[8px] hover:bg-brand-primary/90 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-[8px] p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[15px] font-semibold text-blue-800 mb-2">
                    Important: Whitelist Our Email
                  </h4>
                  <p className="text-[13px] text-blue-700 mb-3">
                    Amazon only accepts documents from approved email addresses.
                    You must add <strong>{KINDDY_SENDER_EMAIL}</strong> to your
                    Kindle's approved sender list to receive converted content.
                  </p>
                  <div className="bg-white border border-blue-200 rounded-[6px] p-3 mb-3">
                    <p className="text-[13px] text-blue-800 font-medium mb-2">
                      How to whitelist:
                    </p>
                    <ol className="text-[13px] text-blue-700 space-y-1 list-decimal list-inside">
                      <li>
                        Go to Amazon → Manage Your Content and Devices{" "}
                        <u>
                          <a
                            rel="noopener noreferrer"
                            target="_blank"
                            href="https://www.amazon.com/hz/mycd/preferences/myx#/home/settings/"
                          >
                            [Link ↗️]
                          </a>
                        </u>
                      </li>
                      <li>
                        Click "Preferences" → "Personal Document Settings"
                      </li>
                      <li>
                        Under "Approved Personal Document E-mail List", click
                        "Add a new approved e-mail address"
                      </li>
                      <li>
                        Enter: <strong>{KINDDY_SENDER_EMAIL}</strong>
                      </li>
                      <li>Click "Add Address"</li>
                    </ol>
                  </div>
                  <div className="mt-4">
                    <p className="text-[13px] text-blue-700 mb-2 font-medium">
                      Type "YES" below to confirm you've whitelisted our email:
                    </p>
                    <input
                      type="text"
                      value={confirmed}
                      onChange={(e) => setConfirmed(e.target.value)}
                      placeholder="Type YES to confirm..."
                      className="w-full px-3 py-2 border border-blue-300 rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>
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
                ? "text-[#273F4F] hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed"
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
            {isLoading
              ? "Connecting..."
              : step === 2
              ? "Connect Kindle"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
