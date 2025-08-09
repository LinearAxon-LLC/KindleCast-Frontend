'use client'

import { LayoutDashboard, History, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, iconColor: 'text-blue-500' },
  { id: 'history', label: 'History', icon: History, iconColor: 'text-brand-primary' },
  { id: 'settings', label: 'Settings', icon: Settings, iconColor: 'text-green-500' },
]

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout() // This now calls signOut from NextAuth
  }

  return (
    <aside className="w-64 h-full bg-[#EFEEEA]/95 backdrop-blur-xl border-r border-[#273F4F]/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#273F4F]/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="6" height="12" rx="1" fill="currentColor"/>
              <path d="M12 8L18 8M12 12L16 12M12 16L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[17px] font-semibold text-[#273F4F]">KindleCast</span>
        </div>
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
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all duration-200 text-[15px]",
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
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
            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-[15px] text-[#273F4F] font-semibold truncate">
                {user?.name || 'User'}
              </div>
              <div className="bg-gradient-to-r from-brand-primary to-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                PRO
              </div>
            </div>
            <div className="text-[13px] text-[#273F4F]/70 truncate">
              {user?.email || 'user@example.com'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all duration-200 text-[15px] text-[#273F4F]/70 hover:text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
