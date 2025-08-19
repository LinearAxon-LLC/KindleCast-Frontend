'use client'

import React from 'react'

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className = '' }: ShimmerProps) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-black/[0.04] via-black/[0.08] to-black/[0.04] bg-[length:200%_100%] ${className}`}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite'
      }}
    />
  )
}

interface ConversionHistoryShimmerProps {
  count?: number
}

export function ConversionHistoryShimmer({ count = 5 }: ConversionHistoryShimmerProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] overflow-hidden">
      <div className="divide-y divide-black/[0.06]">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Status icon shimmer */}
                <Shimmer className="w-5 h-5 rounded-full" />

                <div className="flex-1 min-w-0">
                  {/* Title shimmer */}
                  <Shimmer className="h-4 w-3/4 rounded mb-2" />

                  <div className="flex items-center gap-3">
                    {/* Date shimmer */}
                    <Shimmer className="h-3 w-20 rounded" />
                    {/* Format shimmer */}
                    <Shimmer className="h-5 w-16 rounded" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Status badge shimmer */}
                <Shimmer className="h-6 w-20 rounded-full" />
                {/* Download button shimmer */}
                <Shimmer className="w-8 h-8 rounded-[6px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Add the shimmer animation to global CSS
export const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`
