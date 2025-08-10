'use client'

import React, { useState } from 'react'
import { User, Bell, Shield, CreditCard, Trash2, Smartphone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { text } from '@/lib/typography'

export function SettingsPage() {
  const { user } = useAuth()
  const { userProfile } = useUserProfile()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  })

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${text.sectionTitle} mb-2`}>Settings</h1>
          <p className={text.bodySecondary}>Manage your account and preferences</p>
        </div>

        <div className="max-w-4xl space-y-8">
          {/* Profile Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-[8px] flex items-center justify-center">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className={text.componentTitle}>Profile</h2>
                <p className={text.caption}>Update your personal information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-[#273F4F]/70 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#273F4F]/70 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="px-6 py-2.5 bg-brand-primary text-white text-[13px] font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150">
                Save Changes
              </button>
            </div>
          </div>

          {/* Device Settings Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-[8px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#273F4F]">Device Settings</h2>
                <p className="text-[13px] text-[#273F4F]/60">Manage your Kindle device connection</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/[0.02] rounded-[8px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[15px] font-medium text-[#273F4F]">Kindle Email</div>
                    <div className="text-[13px] text-[#273F4F]/60">
                      {userProfile?.kindle_email || 'Not configured'}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                    userProfile?.set_up_device
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {userProfile?.set_up_device ? 'Connected' : 'Not Setup'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/[0.02] rounded-[8px]">
                <div className="text-[15px] font-medium text-[#273F4F]">KTool Email</div>
                <div className="text-[13px] text-[#273F4F]/60 font-mono">
                  {userProfile?.ktool_email || 'Not generated'}
                </div>
              </div>

              <button className="px-4 py-2.5 bg-brand-primary text-white text-[13px] font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150">
                Reconfigure Device
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-[8px] flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#273F4F]">Notifications</h2>
                <p className="text-[13px] text-[#273F4F]/60">Choose what notifications you receive</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Get notified when conversions complete' },
                { key: 'push', label: 'Push Notifications', description: 'Browser notifications for real-time updates' },
                { key: 'marketing', label: 'Marketing Emails', description: 'Product updates and feature announcements' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-black/[0.02] rounded-[8px]">
                  <div>
                    <div className="text-[15px] font-medium text-[#273F4F]">{item.label}</div>
                    <div className="text-[13px] text-[#273F4F]/60">{item.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/10 rounded-[8px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#273F4F]">Security</h2>
                <p className="text-[13px] text-[#273F4F]/60">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-black/[0.02] rounded-[8px] hover:bg-black/[0.04] transition-colors duration-150">
                <div className="text-[15px] font-medium text-[#273F4F]">Change Password</div>
                <div className="text-[13px] text-[#273F4F]/60">Update your account password</div>
              </button>
              <button className="w-full text-left p-4 bg-black/[0.02] rounded-[8px] hover:bg-black/[0.04] transition-colors duration-150">
                <div className="text-[15px] font-medium text-[#273F4F]">Two-Factor Authentication</div>
                <div className="text-[13px] text-[#273F4F]/60">Add an extra layer of security</div>
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
                <h2 className="text-[17px] font-semibold text-[#273F4F]">Billing & Subscription</h2>
                <p className="text-[13px] text-[#273F4F]/60">Manage your subscription and billing</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-brand-primary/10 to-green-500/10 rounded-[8px] border border-brand-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-semibold text-[#273F4F]">Pro Plan</div>
                  <div className="text-[13px] text-[#273F4F]/60">100 conversions per month</div>
                </div>
                <div className="text-right">
                  <div className="text-[17px] font-bold text-brand-primary">$9.99/mo</div>
                  <div className="text-[11px] text-[#273F4F]/60">Next billing: Jan 15</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2.5 bg-black/[0.04] text-[#273F4F] text-[13px] font-medium rounded-[8px] hover:bg-black/[0.08] transition-colors duration-150">
                View Billing History
              </button>
              <button className="px-4 py-2.5 bg-black/[0.04] text-[#273F4F] text-[13px] font-medium rounded-[8px] hover:bg-black/[0.08] transition-colors duration-150">
                Update Payment Method
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white/80 backdrop-blur-xl border border-red-200 rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/10 rounded-[8px] flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-red-600">Danger Zone</h2>
                <p className="text-[13px] text-red-500/70">Irreversible actions</p>
              </div>
            </div>

            <button className="px-4 py-2.5 bg-red-50 text-red-600 text-[13px] font-medium rounded-[8px] hover:bg-red-100 transition-colors duration-150 border border-red-200">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
