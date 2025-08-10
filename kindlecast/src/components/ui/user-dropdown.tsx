'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Settings, LogOut, Zap } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface UserDropdownProps {
  className?: string
}

export function UserDropdown({ className = '' }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuClick = (action: string) => {
    setIsOpen(false)
    
    switch (action) {
      case 'dashboard':
        router.push('/dashboard')
        break
      case 'quick-send':
        router.push('/dashboard?tab=home')
        break
      case 'settings':
        router.push('/dashboard?tab=settings')
        break
      case 'logout':
        logout()
        break
    }
  }

  if (!user) return null

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-black/5 transition-colors duration-200"
      >
        <Image
          src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format"}
          alt={user.name || 'User'}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border-2 border-brand-primary/20"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-black/[0.08]">
            <div className="flex items-center space-x-3">
              <Image
                src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format"}
                alt={user.name || 'User'}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-brand-primary/20"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-black/85 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-[12px] text-black/60 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleMenuClick('dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-[14px] text-black/70 hover:bg-black/5 hover:text-black/85 transition-colors duration-150"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => handleMenuClick('quick-send')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-[14px] text-black/70 hover:bg-black/5 hover:text-black/85 transition-colors duration-150"
            >
              <Zap className="w-4 h-4" />
              <span>Quick Send</span>
            </button>
            
            <button
              onClick={() => handleMenuClick('settings')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-[14px] text-black/70 hover:bg-black/5 hover:text-black/85 transition-colors duration-150"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-black/[0.08] py-2">
            <button
              onClick={() => handleMenuClick('logout')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-[14px] text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
