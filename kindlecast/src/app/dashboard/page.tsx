'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { HomePage } from '@/components/dashboard/pages/HomePage'
import { HistoryPage } from '@/components/dashboard/pages/HistoryPage'
import { SettingsPage } from '@/components/dashboard/pages/SettingsPage'
import { TrialStatusBanner } from '@/components/ui/trial-status-banner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useSearchParams } from 'next/navigation'

function DashboardContent() {
  const { isLoading } = useAuth()
  const { userProfile } = useUserProfile()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('home')

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['home', 'history', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Cache all tab components to prevent re-rendering and flickering
  const cachedComponents = useMemo(() => ({
    home: <HomePage onSwitchTab={setActiveTab} />,
    history: <HistoryPage />,
    settings: <SettingsPage />
  }), [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center">
        <div className="text-[#273F4F] text-[15px]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EFEEEA] font-rubik">
      <div className="flex h-screen">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-hidden bg-[#EFEEEA] relative">
          {/* Render all tabs but show only the active one */}
          {Object.entries(cachedComponents).map(([tabKey, component]) => (
            <div
              key={tabKey}
              className={`absolute inset-0 transition-opacity duration-200 ${
                activeTab === tabKey ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Trial Status Banner - Inside each page */}
              <div className="h-full flex flex-col">
                {userProfile && (
                  <TrialStatusBanner
                    userSubscribed={userProfile.user_subscribed}
                    trialDaysRemaining={userProfile.trialDaysRemaining}
                  />
                )}
                <div className="flex-1 overflow-hidden">
                  {component}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  )
}
