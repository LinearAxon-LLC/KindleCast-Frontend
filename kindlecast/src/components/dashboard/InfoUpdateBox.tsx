'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { text } from '@/lib/typography';

interface InfoUpdateBoxProps {
  onComplete?: () => void;
  onDismiss?: () => void;
}

export function InfoUpdateBox({ onComplete, onDismiss }: InfoUpdateBoxProps) {
  const [kindleEmail, setKindleEmail] = useState('');
  const [acknowledgment, setAcknowledgment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setupDevice, refetch } = useUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kindleEmail.trim() || acknowledgment.toLowerCase() !== 'yes') {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call setupDevice with the full kindle email and acknowledgment
      const fullKindleEmail = `${kindleEmail.trim()}@kindle.com`;
      const result = await setupDevice(fullKindleEmail, acknowledgment.trim());

      if (result.success) {
        setShowSuccess(true);

        console.log('🔍 InfoUpdateBox: API call successful, refreshing profile...');
        // Refresh user profile to get updated data
        await refetch();
        console.log('🔍 InfoUpdateBox: Profile refreshed, calling onComplete...');

        // Auto-complete after 2 seconds to go to main screen
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      } else {
        setError(result.error || 'Failed to connect your Kindle');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-green-200 rounded-[16px] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-[8px] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className={`${text.body} font-semibold text-green-800`}>Kindle Connected!</h3>
              <p className={`${text.caption} text-green-700`}>Your Kindle has been successfully connected</p>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-green-50 rounded-[8px]">
          <p className={`${text.small} text-green-800`}>
            ✓ Kindle email configured: {kindleEmail}@kindle.com
          </p>
          <p className={`${text.small} text-green-800`}>
            ✓ Mail whitelisting acknowledged
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="info-update-box" className="bg-white/80 backdrop-blur-xl border border-orange-200 rounded-[16px] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-[8px] flex items-center justify-center">
            <Mail className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className={`${text.body} font-semibold text-orange-800`}>Connect Your Kindle</h3>
            <p className={`${text.caption} text-orange-700`}>We need a few details to get you started</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-orange-100 rounded-[4px] transition-colors duration-150"
          >
            <X className="w-4 h-4 text-orange-600" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kindle Email Input */}
        <div>
          <label className={`${text.small} font-medium text-[#273F4F] mb-2 block`}>
            Your Kindle Email Address
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={kindleEmail}
              onChange={(e) => setKindleEmail(e.target.value)}
              placeholder="your-kindle-name"
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              required
            />
            <div className="px-3 py-2.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-[8px] text-[15px] text-gray-600">
              @kindle.com
            </div>
          </div>
          <p className={`${text.caption} text-gray-600 mt-1`}>
            Find this in your Kindle settings under "Send to Kindle Email"
          </p>
        </div>

        {/* Mail Whitelisting Acknowledgment */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-[8px]">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className={`${text.small} font-semibold text-blue-800 mb-1`}>
                Important: Email Whitelisting Required
              </h4>
              <p className={`${text.caption} text-blue-700 mb-2`}>
                To receive converted content, you must add our email to your Kindle's approved sender list:
              </p>
              <div className="p-2 bg-white border border-blue-200 rounded-[4px] font-mono text-sm text-blue-800">
                no-reply@kindlecast.com
              </div>
              <p className={`${text.caption} text-blue-700 mt-2`}>
                Go to Amazon → Manage Your Content and Devices → Preferences → Personal Document Settings → Add Email
              </p>
            </div>
          </div>
          
          <div>
            <label className={`${text.small} font-medium text-blue-800 mb-2 block`}>
              Type "YES" to confirm you've added our email to your approved sender list:
            </label>
            <input
              type="text"
              value={acknowledgment}
              onChange={(e) => setAcknowledgment(e.target.value)}
              placeholder="Type YES to confirm..."
              className="w-full px-3 py-2 border border-blue-300 rounded-[6px] text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[8px]">
            <p className={`${text.small} text-red-800`}>
              ❌ {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !kindleEmail.trim() || acknowledgment.toLowerCase() !== 'yes'}
          className="w-full px-6 py-3 bg-orange-600 text-white text-base font-medium rounded-[8px] hover:bg-orange-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <span>Connect Kindle</span>
          )}
        </button>

      </form>
    </div>
  );
}
