'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { redirect } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth()

  // Show loading while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[13px] text-black/60">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }
    redirect(redirectTo)
  }

  return <>{children}</>
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { redirectTo?: string } = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute redirectTo={options.redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for conditional rendering based on auth status
export function useAuthGuard() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth()

  return {
    isAuthenticated,
    isLoading: !isInitialized || isLoading,
    canRender: isInitialized && !isLoading,
    requiresAuth: isInitialized && !isLoading && !isAuthenticated,
  }
}
