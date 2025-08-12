'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback

      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  retry: () => void
}

function DefaultErrorFallback({ error, retry }: ErrorFallbackProps) {
  const isAuthError = error?.message.includes('auth') || error?.message.includes('token')

  return (
    <div className="min-h-screen bg-[#EFEEEA] flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-[17px] font-semibold text-black mb-3">
          {isAuthError ? 'Authentication Error' : 'Something went wrong'}
        </h2>

        <p className="text-[13px] text-black/70 mb-6 leading-relaxed">
          {isAuthError
            ? 'There was a problem with your authentication. Please try signing in again.'
            : 'An unexpected error occurred. Please try refreshing the page.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-[10px] hover:bg-brand-primary/90 active:bg-brand-primary/80 transition-all duration-150 active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-[15px] font-medium">Try Again</span>
          </button>

          {isAuthError && (
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-3 bg-white border border-black/[0.08] text-black rounded-[10px] hover:bg-black/[0.02] active:bg-black/[0.05] transition-all duration-150 active:scale-[0.98]"
            >
              <span className="text-[15px] font-medium">Go to Home</span>
            </button>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="text-[12px] text-black/50 cursor-pointer hover:text-black/70">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-[10px] text-red-600 bg-red-50 p-3 rounded-lg overflow-auto max-h-32">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

// Hook for handling async errors in components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error)
    } else {
      setError(new Error(String(error)))
    }
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, clearError }
}
