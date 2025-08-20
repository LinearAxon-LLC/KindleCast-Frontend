'use client'

import React from 'react'
import { X, Zap, Brain, BookOpen, Wand2 } from 'lucide-react'

interface FormatInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormatInfoModal({ isOpen, onClose }: FormatInfoModalProps) {
  if (!isOpen) return null

  const formats = [
    {
      name: 'Quick Send',
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      description: 'Send content directly to your Kindle with minimal processing. Perfect for articles and web pages you want to read as-is.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      name: 'Summarize',
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      description: 'AI creates a concise summary highlighting key points and main ideas. Great for long articles or research papers.',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      name: 'Study Guide',
      icon: <BookOpen className="w-5 h-5 text-green-600" />,
      description: 'Transform content into a structured study guide with key concepts, definitions, and important takeaways.',
      color: 'bg-green-50 border-green-200'
    },
    {
      name: 'Custom',
      icon: <Wand2 className="w-5 h-5 text-orange-600" />,
      description: 'Tell AI exactly how you want the content formatted. Use your own instructions for personalized processing.',
      color: 'bg-orange-50 border-orange-200'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Dialog */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-[480px] mx-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 flex items-center justify-center transition-colors duration-150 z-10"
        >
          <X className="w-4 h-4 text-black/60" />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6">
          {/* Icon */}
          {/*<div className="flex justify-center mb-6">*/}
          {/*  <div className="w-16 h-16 bg-brand-primary rounded-[12px] flex items-center justify-center">*/}
          {/*    <BookOpen className="w-8 h-8 text-white" />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* Title */}
          <h2 className="text-[17px] font-semibold text-black mb-2 text-center leading-tight">
            Format Options
          </h2>

          {/* Message */}
          <p className="text-[13px] text-black/70 text-center leading-relaxed mb-6">
            Choose how you want your content processed before sending to your Kindle.
          </p>

          {/* Format List */}
          <div className="space-y-4">
            {formats.map((format, index) => (
              <div key={index} className={`p-4 rounded-[12px] border ${format.color}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {format.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-black mb-1">
                      {format.name}
                    </h3>
                    <p className="text-[13px] text-black/70 leading-relaxed">
                      {format.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-black/[0.04] hover:bg-black/[0.08] active:bg-black/[0.12] text-black/80 rounded-[10px] transition-all duration-150 active:scale-[0.98]"
            >
              <span className="text-[15px] font-medium">Got it</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
