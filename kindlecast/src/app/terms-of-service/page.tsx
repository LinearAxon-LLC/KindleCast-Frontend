import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, Users } from 'lucide-react';
import { text } from '@/lib/typography';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Kinddy - Content conversion service for Kindle devices',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#EFEEEA]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/[0.08] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-8 h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="6" width="6" height="12" rx="1" fill="currentColor"/>
                  <path d="M12 8L18 8M12 12L16 12M12 16L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className={`${text.componentTitle} text-[#273F4F]`}>Kinddy</span>
            </Link>
            
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-[#273F4F] hover:bg-black/[0.04] rounded-[8px] transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className={text.caption}>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] mx-auto flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className={`${text.pageTitle} mb-4`}>Terms of Service</h1>
          <p className={`${text.body} text-[#273F4F]/70 max-w-2xl mx-auto`}>
            These terms govern your use of Kinddy's content conversion services.
          </p>
          <p className={`${text.caption} text-[#273F4F]/50 mt-2`}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8 space-y-8">
          
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-blue-100 rounded-[6px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              1. Acceptance of Terms
            </h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                By accessing or using Kinddy ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, please do not use the Service.
              </p>
              <p>
                We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* 2. Service Description */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>2. Service Description</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                Kinddy provides content conversion services that transform web pages, articles, videos, and other digital content 
                into Kindle-compatible formats. Our service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Web page to PDF conversion</li>
                <li>Video transcript extraction and formatting</li>
                <li>AI-powered content summarization</li>
                <li>Direct delivery to Kindle devices</li>
              </ul>
            </div>
          </section>

          {/* 3. User Accounts */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>3. User Accounts</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information when creating your account</li>
                <li>Keep your login credentials secure</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Use the Service only for lawful purposes</li>
              </ul>
            </div>
          </section>

          {/* 4. Usage Limits and Billing */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>4. Usage Limits and Billing</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                Free accounts include limited monthly conversions. Premium subscriptions offer increased limits and additional features. 
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pay all applicable fees for premium services</li>
                <li>Respect usage limits for your account type</li>
                <li>Not attempt to circumvent usage restrictions</li>
              </ul>
              <p>
                Subscription fees are billed monthly in advance. You may cancel anytime.
                Refunds are subject to our Refund Policy and applicable consumer protection laws.
              </p>
            </div>
          </section>

          {/* 5. Content and Intellectual Property */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>5. Content and Intellectual Property</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                You retain ownership of content you submit for conversion. However, you grant us a limited license to process, 
                convert, and deliver your content. You represent that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You have the right to convert and use the content you submit</li>
                <li>Your use of the Service does not violate any third-party rights</li>
                <li>You will not submit illegal, harmful, or infringing content</li>
              </ul>
              <p>
                We do not claim ownership of your content and will delete processed files according to our retention policy.
              </p>
            </div>
          </section>

          {/* 6. Prohibited Uses */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>6. Prohibited Uses</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>You may not use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Convert copyrighted content without permission</li>
                <li>Distribute malicious or harmful content</li>
                <li>Attempt to reverse engineer or compromise our systems</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Spam or abuse our service infrastructure</li>
              </ul>
            </div>
          </section>

          {/* 7. Service Availability */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>7. Service Availability</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We reserve the right to modify, suspend, or discontinue the Service with reasonable notice.
              </p>
            </div>
          </section>

          {/* 8. Limitation of Liability */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>8. Limitation of Liability</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                The Service is provided "as is" without warranties. We are not liable for any indirect, incidental, 
                or consequential damages arising from your use of the Service. Our total liability is limited to 
                the amount you paid for the Service in the preceding 12 months.
              </p>
            </div>
          </section>

          {/* 9. Termination */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>9. Termination</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                Either party may terminate this agreement at any time. We may suspend or terminate your account 
                for violations of these Terms. Upon termination, your access to the Service will cease, 
                and we may delete your account data according to our retention policy.
              </p>
            </div>
          </section>

          {/* 10. Data Protection and Privacy */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>10. Data Protection and Privacy</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                Your privacy is important to us. Our processing of personal data is governed by our Privacy Policy,
                which complies with GDPR and other applicable data protection laws. You have rights regarding your personal data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to access, rectify, or delete your personal data</li>
                <li>Right to data portability and restriction of processing</li>
                <li>Right to withdraw consent at any time</li>
                <li>Right to lodge a complaint with supervisory authorities</li>
              </ul>
            </div>
          </section>

          {/* 11. Contact Information */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-green-100 rounded-[6px] flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              11. Contact Information
            </h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                For questions about these Terms or to exercise your data protection rights:
              </p>
              <div className="p-4 bg-gray-50 rounded-[8px]">
                <p><strong>Email:</strong> support@kinddy.com</p>
                <p><strong>Legal:</strong> legal@kinddy.com</p>
                <p><strong>Data Protection:</strong> privacy@kinddy.com</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
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
