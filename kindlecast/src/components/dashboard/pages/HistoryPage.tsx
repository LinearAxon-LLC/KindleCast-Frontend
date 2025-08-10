'use client'

import React, { useState } from 'react'
import { Download, ExternalLink, Clock, CheckCircle, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { text } from '@/lib/typography'

export function HistoryPage() {
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const jobs = [
    {
      id: 1,
      title: 'The Complete Guide to Machine Learning',
      url: 'https://en.wikipedia.org/wiki/Machine_learning',
      status: 'completed',
      format: 'PDF',
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:32:00Z',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'React Hooks Tutorial - Complete Guide',
      url: 'https://www.youtube.com/watch?v=example',
      status: 'processing',
      format: 'Summary',
      createdAt: '2024-01-15T09:15:00Z',
      progress: 65
    },
    {
      id: 3,
      title: 'Best Programming Practices Discussion',
      url: 'https://www.reddit.com/r/programming/comments/example',
      status: 'failed',
      format: 'Learning Ready',
      createdAt: '2024-01-14T16:45:00Z',
      error: 'Content not accessible'
    },
    {
      id: 4,
      title: 'JavaScript ES2024 Features',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      status: 'completed',
      format: 'Custom',
      createdAt: '2024-01-14T14:20:00Z',
      completedAt: '2024-01-14T14:23:00Z',
      fileSize: '1.8 MB'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing': return <Clock className="w-5 h-5 text-blue-500" />
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'processing': return 'Processing'
      case 'failed': return 'Failed'
      default: return 'Unknown'
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

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true
    return job.status === filter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage)

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
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1) // Reset to first page when filtering
              }}
              className={`px-3 py-2 bg-white/80 border border-black/[0.08] rounded-[8px] ${text.caption} text-[#273F4F] focus:outline-none focus:ring-2 focus:ring-brand-primary/20`}
            >
              <option value="all">All Status</option>
              <option value="completed">Success</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] overflow-hidden">
          {paginatedJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-black/[0.04] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#273F4F]/40" />
              </div>
              <h3 className={`${text.componentTitle} mb-2`}>No conversions found</h3>
              <p className={text.caption}>Try adjusting your filter or start a new conversion</p>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.06]">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-black/[0.02] transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(job.status)}

                      <div className="flex-1 min-w-0">
                        <h3 className={`${text.body} font-medium truncate mb-1`}>
                          {job.title}
                        </h3>

                        <div className="flex items-center gap-3">
                          <span className={`${text.footnote} text-[#273F4F]/50`}>
                            {formatDate(job.createdAt)}
                          </span>
                          <span className={`${text.footnote} px-1.5 py-0.5 bg-gray-100 rounded`}>
                            {job.format}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`${text.footnote} font-medium px-2 py-1 rounded-full ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' :
                        job.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {getStatusText(job.status)}
                      </span>

                      {job.status === 'completed' && (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className={text.caption}>
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredJobs.length)} of {filteredJobs.length} results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                    onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
