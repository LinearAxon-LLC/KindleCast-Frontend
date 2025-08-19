'use client'

import React, { useState, useEffect } from 'react'
import { Download, ExternalLink, Clock, CheckCircle, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { text } from '@/lib/typography'
import { useConversionHistory } from '@/hooks/useConversionHistory'
import { ConversionHistoryShimmer } from '@/components/ui/shimmer'
import { ProcessingStatus, Conversion } from '@/types/api'

interface HistoryPageProps {
  isActive?: boolean
}

export function HistoryPage({ isActive = false }: HistoryPageProps) {
  const [filter, setFilter] = useState<ProcessingStatus | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    conversions,
    isLoading,
    error,
    fetchHistory,
    filterByStatus
  } = useConversionHistory({
    pageSize: itemsPerPage,
    autoFetch: false // We'll fetch manually when tab becomes active
  })

  // Fetch data when the History tab becomes active
  useEffect(() => {
    // Only fetch if tab is active, no data exists, not currently loading, and no error
    if (isActive && conversions.length === 0 && !isLoading && !error) {
      console.log('History tab became active, fetching data...')
      fetchHistory(1)
    }
  }, [isActive]) // Only depend on isActive to prevent re-renders

  const getStatusIcon = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.OK: return <CheckCircle className="w-5 h-5 text-green-500" />
      case ProcessingStatus.PROCESSING: return <Clock className="w-5 h-5 text-blue-500" />
      case ProcessingStatus.FAILED: return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.OK: return 'Completed'
      case ProcessingStatus.PROCESSING: return 'Processing'
      case ProcessingStatus.FAILED: return 'Failed'
      default: return 'Unknown'
    }
  }

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.OK: return 'bg-green-100 text-green-700'
      case ProcessingStatus.PROCESSING: return 'bg-blue-100 text-blue-700'
      case ProcessingStatus.FAILED: return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const extractTitleFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '') + urlObj.pathname
    } catch {
      return url
    }
  }

  const formatType = (formatType: string, secondaryFormatType: string) => {
    if (secondaryFormatType && secondaryFormatType !== formatType) {
      return `${formatType} + ${secondaryFormatType}`
    }
    return formatType
  }

  // Apply filter to conversions
  const filteredConversions = filterByStatus(filter)

  // Client-side pagination for filtered results
  const totalPages = Math.ceil(filteredConversions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedConversions = filteredConversions.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle filter change
  const handleFilterChange = (newFilter: ProcessingStatus | 'all') => {
    setFilter(newFilter)
    setCurrentPage(1) // Reset to first page when filtering
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`${text.sectionTitle} mb-2`}>Conversion History</h1>
            <p className={text.bodySecondary}>Track all your content conversions</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#273F4F]/60" />
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value as ProcessingStatus | 'all')}
              className={`px-3 py-2 bg-white/80 border border-black/[0.08] rounded-[8px] ${text.caption} text-[#273F4F] focus:outline-none focus:ring-2 focus:ring-brand-primary/20`}
            >
              <option value="all">All Status</option>
              <option value={ProcessingStatus.OK}>Success</option>
              <option value={ProcessingStatus.PROCESSING}>Processing</option>
              <option value={ProcessingStatus.FAILED}>Failed</option>
            </select>
          </div>
        </div>

        {/* Conversions List */}
        {isLoading ? (
          <ConversionHistoryShimmer count={5} />
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`${text.componentTitle} mb-2`}>Failed to load conversions</h3>
              <p className={text.caption}>Please try refreshing the page</p>
              <button
                onClick={() => fetchHistory(1)}
                className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] overflow-hidden">
            {paginatedConversions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-black/[0.04] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-[#273F4F]/40" />
                </div>
                <h3 className={`${text.componentTitle} mb-2`}>No conversions found</h3>
                <p className={text.caption}>
                  {filter === 'all'
                    ? 'Start your first conversion to see it here'
                    : 'Try adjusting your filter or start a new conversion'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.06]">
                {paginatedConversions.map((conversion, index) => (
                  <div key={`${conversion.file_id}-${index}`} className="p-4 hover:bg-black/[0.02] transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(conversion.processing_status)}

                        <div className="flex-1 min-w-0">
                          <h3 className={`${text.body} font-medium truncate mb-1`}>
                            {extractTitleFromUrl(conversion.source_url)}
                          </h3>

                          <div className="flex items-center gap-3">
                            <span className={`${text.footnote} text-[#273F4F]/50`}>
                              {formatDate(conversion.created_at)}
                            </span>
                            <span className={`${text.footnote} px-1.5 py-0.5 bg-gray-100 rounded`}>
                              {formatType(conversion.format_type, conversion.secondary_format_type)}
                            </span>
                            {conversion.processing_time > 0 && (
                              <span className={`${text.footnote} text-[#273F4F]/50`}>
                                {conversion.processing_time}s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`${text.footnote} font-medium px-2 py-1 rounded-full ${getStatusColor(conversion.processing_status)}`}>
                          {getStatusText(conversion.processing_status)}
                        </span>

                        {conversion.processing_status === ProcessingStatus.OK && (
                          <button className="p-2 hover:bg-black/[0.06] rounded-[6px] transition-colors duration-150">
                            <Download className="w-4 h-4 text-[#273F4F]/60" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className={text.caption}>
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredConversions.length)} of {filteredConversions.length} results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-[6px] transition-colors duration-150 ${
                  currentPage === 1
                    ? 'text-[#273F4F]/30 cursor-not-allowed'
                    : 'text-[#273F4F]/60 hover:bg-black/[0.06]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-[6px] ${text.footnote} font-medium transition-colors duration-150 ${
                      currentPage === page
                        ? 'bg-brand-primary text-white'
                        : 'text-[#273F4F]/60 hover:bg-black/[0.06]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-[6px] transition-colors duration-150 ${
                  currentPage === totalPages
                    ? 'text-[#273F4F]/30 cursor-not-allowed'
                    : 'text-[#273F4F]/60 hover:bg-black/[0.06]'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
