import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import { text } from '@/lib/typography';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Kinddy - How we collect, use, and protect your personal information',
};

export default function PrivacyPolicy() {
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
            <Shield className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className={`${text.pageTitle} mb-4`}>Privacy Policy</h1>
          <p className={`${text.body} text-[#273F4F]/70 max-w-2xl mx-auto`}>
            We respect your privacy and are committed to protecting your personal information.
          </p>
          <p className={`${text.caption} text-[#273F4F]/50 mt-2`}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-8 space-y-8">
          
          {/* 1. Information We Collect */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-blue-100 rounded-[6px] flex items-center justify-center">
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              1. Information We Collect
            </h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>We collect information you provide directly to us and information automatically collected when you use our service:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className={`${text.componentTitle} mb-2`}>Account Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Email address and name (from OAuth providers)</li>
                    <li>Profile picture (if provided by OAuth provider)</li>
                    <li>Kindle email address (for content delivery)</li>
                    <li>Subscription and billing information</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className={`${text.componentTitle} mb-2`}>Usage Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>URLs and content you submit for conversion</li>
                    <li>Conversion preferences and settings</li>
                    <li>Usage statistics and service interactions</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-green-100 rounded-[6px] flex items-center justify-center">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
              2. How We Use Your Information
            </h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>We process your information based on the following legal grounds:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Contract Performance:</strong> To provide content conversion and delivery services</li>
                <li><strong>Legitimate Interest:</strong> To improve our service, ensure security, and prevent abuse</li>
                <li><strong>Legal Obligation:</strong> To comply with tax, accounting, and regulatory requirements</li>
                <li><strong>Consent:</strong> For marketing communications (where required by law)</li>
              </ul>
              <p>
                <strong>We do not sell your personal information to third parties.</strong>
                You have the right to withdraw consent at any time where processing is based on consent.
              </p>
            </div>
          </section>

          {/* 3. Content Processing and Storage */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>3. Content Processing and Storage</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                When you submit content for conversion, we temporarily process and store it to provide our service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Content is processed on secure servers</li>
                <li>Converted files are stored temporarily for delivery</li>
                <li>Files are automatically deleted based on your subscription plan (20-120 days)</li>
                <li>We do not read, analyze, or use your content for any purpose other than conversion</li>
              </ul>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-[8px]">
                <p className={`${text.caption} text-blue-800`}>
                  <strong>Important:</strong> Only submit content you have the right to convert and use. 
                  We are not responsible for copyright violations.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Information Sharing */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>4. Information Sharing</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>We may share your information only in these limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Third-party services that help us operate (payment processing, email delivery)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p>
                All third-party service providers are contractually required to protect your information 
                and use it only for the specified purposes.
              </p>
            </div>
          </section>

          {/* 5. Data Security */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-purple-100 rounded-[6px] flex items-center justify-center">
                <Lock className="w-4 h-4 text-purple-600" />
              </div>
              5. Data Security
            </h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and monitoring</li>
                <li>Automatic file deletion based on retention policies</li>
              </ul>
              <p>
                While we strive to protect your information, no method of transmission over the internet 
                is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* 6. Your Rights and Choices */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>6. Your Rights and Choices</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p>
                To exercise these rights, contact us at privacy@kindlecast.com or through your account settings.
              </p>
            </div>
          </section>

          {/* 7. Cookies and Tracking */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>7. Cookies and Tracking</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze website usage and performance</li>
                <li>Provide personalized experiences</li>
              </ul>
              <p>
                You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
              </p>
            </div>
          </section>

          {/* 8. International Data Transfers */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>8. International Data Transfers</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with this Privacy Policy and applicable laws.
              </p>
            </div>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>9. Children's Privacy</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected such information, 
                we will delete it promptly.
              </p>
            </div>
          </section>

          {/* 10. Changes to This Policy */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>10. Changes to This Policy</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes 
                by email or through our service. Your continued use of the service after changes become effective 
                constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* 11. Your Rights Under GDPR */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>11. Your Rights Under GDPR</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>If you are in the European Economic Area, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Complaint:</strong> Lodge a complaint with your data protection authority</li>
              </ul>
              <p>To exercise these rights, contact us at privacy@kindlecast.com. We will respond within 30 days.</p>
            </div>
          </section>

          {/* 12. Contact Us */}
          <section>
            <h2 className={`${text.sectionTitle} mb-4`}>12. Contact Us</h2>
            <div className={`${text.body} text-[#273F4F]/80 space-y-4`}>
              <p>
                For questions about this Privacy Policy or to exercise your rights:
              </p>
              <div className="p-4 bg-gray-50 rounded-[8px]">
                <p><strong>Privacy Officer:</strong> privacy@kinddy.com</p>
                <p><strong>General Support:</strong> support@kinddy.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@kinddy.com</p>
                <p><strong>Response Time:</strong> Within 30 days for privacy requests</p>
              </div>
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
