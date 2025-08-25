'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { HomePage } from '@/components/dashboard/pages/HomePage'
import { HistoryPage } from '@/components/dashboard/pages/HistoryPage'
import { SettingsPage } from '@/components/dashboard/pages/SettingsPage'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useSearchParams, useRouter } from 'next/navigation'

function DashboardContent() {
  const { isLoading } = useAuth()
  const { userProfile } = useUserProfile()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')

  // Clean checkout parameters from URL
  useEffect(() => {
    const checkoutId = searchParams.get('checkout_id')
    const orderId = searchParams.get('order_id')
    const customerId = searchParams.get('customer_id')
    const subscriptionId = searchParams.get('subscription_id')
    const productId = searchParams.get('product_id')
    const signature = searchParams.get('signature')

    // If any checkout parameters exist, clean the URL
    if (checkoutId || orderId || customerId || subscriptionId || productId || signature) {
      console.log('Cleaning checkout parameters from URL')

      // Get current tab parameter if it exists
      const tab = searchParams.get('tab')

      // Build clean URL
      const cleanUrl = tab ? `/dashboard?tab=${tab}` : '/dashboard'

      // Replace current URL without adding to history
      router.replace(cleanUrl)
      return
    }

    // Handle normal tab switching
    const tab = searchParams.get('tab')
    if (tab && ['home', 'history', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams, router])

  // Cache all tab components to prevent re-rendering and flickering
  const cachedComponents = useMemo(() => ({
    home: <HomePage onSwitchTab={setActiveTab} />,
    history: <HistoryPage isActive={activeTab === 'history'} />,
    settings: <SettingsPage />
  }), [activeTab])

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
        <main className="flex-1 overflow-hidden bg-[#EFEEEA] relative lg:ml-0">
          {/* Render all tabs but show only the active one */}
          {Object.entries(cachedComponents).map(([tabKey, component]) => (
            <div
              key={tabKey}
              className={`absolute inset-0 transition-opacity duration-200 ${
                activeTab === tabKey ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="h-full overflow-hidden">
                {component}
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
