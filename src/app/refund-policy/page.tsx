'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, CreditCard } from 'lucide-react'
import { text } from '@/lib/typography'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#EFEEEA]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`${text.heroTitle} mb-4`}>Refund Policy</h1>
          <p className={`${text.heroSubtitle} max-w-2xl mx-auto`}>
            Our commitment to fair and transparent refund practices
          </p>
          <div className="text-[13px] text-[#273F4F]/60 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8 sm:p-12 space-y-8">
          
          {/* 1. Refund Eligibility */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>1. Refund Eligibility</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                We offer refunds under the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Technical issues preventing service usage for more than 48 hours</li>
                <li>Billing errors or unauthorized charges</li>
                <li>Service cancellation within 7 days of initial subscription</li>
                <li>Failure to deliver promised features as described</li>
              </ul>
            </div>
          </section>

          {/* 2. Refund Process */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>2. Refund Process</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                To request a refund:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact our support team within 30 days of the charge</li>
                <li>Provide your account email and reason for refund</li>
                <li>Allow 5-10 business days for processing</li>
                <li>Refunds will be issued to the original payment method</li>
              </ul>
            </div>
          </section>

          {/* 3. Non-Refundable Items */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>3. Non-Refundable Items</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Completed document conversions and processing</li>
                <li>Subscriptions cancelled after 7 days of initial purchase</li>
                <li>Usage-based charges for consumed services</li>
                <li>Third-party service fees</li>
              </ul>
            </div>
          </section>

          {/* 4. Partial Refunds */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>4. Partial Refunds</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                Partial refunds may be considered for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service disruptions affecting a portion of the billing period</li>
                <li>Downgrade requests mid-billing cycle</li>
                <li>Pro-rated refunds for unused subscription time</li>
              </ul>
            </div>
          </section>

          {/* 5. Dispute Resolution */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>5. Dispute Resolution</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                If you disagree with our refund decision:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may escalate the matter to our management team</li>
                <li>We will review your case within 5 business days</li>
                <li>Final decisions will be communicated in writing</li>
                <li>You retain rights under applicable consumer protection laws</li>
              </ul>
            </div>
          </section>

          {/* 6. Contact Information */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>6. Contact Information</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                For refund requests or questions about this policy:
              </p>
              <div className="bg-black/[0.02] rounded-[8px] p-4 space-y-2">
                <p><strong>Email:</strong> support@kinddy.com</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </section>

          {/* 7. Policy Updates */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>7. Policy Updates</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                We may update this refund policy from time to time. Changes will be posted on this page 
                with an updated revision date. Continued use of our service after changes constitutes 
                acceptance of the updated policy.
              </p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/terms-of-service"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl border border-black/[0.08] text-[#273F4F] rounded-[8px] hover:bg-white transition-colors duration-150"
          >
            <Shield className="w-4 h-4" />
            Terms of Service
          </Link>
          <Link 
            href="/privacy-policy"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl border border-black/[0.08] text-[#273F4F] rounded-[8px] hover:bg-white transition-colors duration-150"
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
