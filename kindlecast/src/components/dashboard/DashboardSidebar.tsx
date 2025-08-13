'use client'

import { LayoutDashboard, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUsageDisplay } from '@/hooks/useUserUsage'
import { text } from '@/lib/typography'
import Image from 'next/image'

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, iconColor: 'text-blue-500' },
  { id: 'history', label: 'My Files', icon: FileText, iconColor: 'text-brand-primary' },
  { id: 'settings', label: 'Settings', icon: Settings, iconColor: 'text-green-500' },
]

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const { user } = useAuth()
  const { userProfile } = useUserProfile()
  const { usage, formatUsageText, isUnlimited } = useUsageDisplay()

  return (
    <aside className="w-64 h-full bg-[#EFEEEA]/95 backdrop-blur-xl border-r border-[#273F4F]/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#273F4F]/10">
        <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
          <div className="w-8 h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="6" height="12" rx="1" fill="currentColor"/>
              <path d="M12 8L18 8M12 12L16 12M12 16L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={text.componentTitle}>Kinddy</span>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 pt-6">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    `w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-light transition-all duration-200 ${text.body}`,
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-[#273F4F] hover:text-[#273F4F] hover:bg-white/40"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : item.iconColor
                  )} />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#273F4F]/20">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={user?.avatar || "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png"}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={`${text.body} font-semibold truncate`}>
                {user?.name || 'User'}
              </div>
              <div className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
                userProfile?.user_subscribed ? 'bg-brand-primary' : 'bg-gray-400'
              }`}>
                {userProfile?.user_subscribed ? 'PRO' : 'FREE'}
              </div>
            </div>
            <div className={`${text.caption} truncate`}>
              {user?.email || 'user@example.com'}
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        {userProfile && usage && (
          <div className="mt-4 p-3 bg-white/60 backdrop-blur-xl border border-black/[0.08] rounded-[12px]">
            <h4 className={`${text.caption} font-semibold mb-3`}>Usage This Month</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={text.footnote}>Quick Send</span>
                  <span className={`${text.footnote} font-medium`}>
                    {formatUsageText('basic')}
                  </span>
                </div>
                {!isUnlimited('basic') && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-brand-primary h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (usage.used_basic_monthly / usage.basic_monthly_limit) * 100)}%`
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={text.footnote}>AI Formatting</span>
                  <span className={`${text.footnote} font-medium`}>
                    {formatUsageText('ai')}
                  </span>
                </div>
                {!isUnlimited('ai') && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (usage.used_ai_monthly / usage.ai_monthly_limit) * 100)}%`
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  )
}
