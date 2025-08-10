'use client'

import React from 'react'
import { X } from 'lucide-react'

interface MacOSDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  icon?: React.ReactNode
  primaryButton: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'destructive'
  }
  secondaryButton?: {
    label: string
    onClick: () => void
  }
  children?: React.ReactNode
}

export function MacOSDialog({
  isOpen,
  onClose,
  title,
  message,
  icon,
  primaryButton,
  secondaryButton,
  children
}: MacOSDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-[#ececec] rounded-[12px] shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.3)] w-full max-w-[400px] mx-4 overflow-hidden">
        {/* Content */}
        <div className="px-6 pt-6 pb-4 text-center">
          {/* Icon */}
          {icon && (
            <div className="flex justify-center mb-4">
              {icon}
            </div>
          )}

          {/* Title */}
          <h2 className="text-[13px] font-semibold text-black mb-2 leading-tight">
            {title}
          </h2>

          {/* Message */}
          <p className="text-[11px] text-black/70 leading-relaxed mb-4">
            {message}
          </p>

          {/* Custom Content */}
          {children && (
            <div className="mb-4">
              {children}
            </div>
          )}
        </div>

        {/* Button Area */}
        <div className="flex border-t border-black/10">
          {/* Secondary Button */}
          {secondaryButton && (
            <button
              onClick={secondaryButton.onClick}
              className="flex-1 py-3 px-4 text-[13px] font-medium text-black hover:bg-black/5 active:bg-black/10 transition-colors duration-100 border-r border-black/10"
            >
              {secondaryButton.label}
            </button>
          )}

          {/* Primary Button */}
          <button
            onClick={primaryButton.onClick}
            className={`flex-1 py-3 px-4 text-[13px] font-medium transition-colors duration-100 ${
              primaryButton.variant === 'destructive'
                ? 'text-white bg-[#ff3b30] hover:bg-[#ff2d20] active:bg-[#ff1f10]'
                : 'text-white bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80'
            }`}
          >
            {primaryButton.label}
          </button>
        </div>
      </div>
    </div>
  )
}
