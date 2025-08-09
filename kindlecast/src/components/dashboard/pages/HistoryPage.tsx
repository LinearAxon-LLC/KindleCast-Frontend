'use client'

import React, { useState } from 'react'
import { Download, ExternalLink, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react'

export function HistoryPage() {
  const [filter, setFilter] = useState('all')

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

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-[#273F4F] mb-2">Conversion History</h1>
            <p className="text-[15px] text-[#273F4F]/70">Track all your content conversions</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#273F4F]/60" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-white/80 border border-black/[0.08] rounded-[8px] text-[13px] text-[#273F4F] focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-black/[0.04] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#273F4F]/40" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#273F4F] mb-2">No conversions found</h3>
              <p className="text-[13px] text-[#273F4F]/60">Try adjusting your filter or start a new conversion</p>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.06]">
              {filteredJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-black/[0.02] transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(job.status)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[15px] font-semibold text-[#273F4F] truncate">
                            {job.title}
                          </h3>
                          <span className="text-[11px] px-2 py-1 bg-black/[0.06] text-[#273F4F]/70 rounded-full font-medium">
                            {job.format}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <ExternalLink className="w-3 h-3 text-[#273F4F]/40" />
                          <span className="text-[13px] text-[#273F4F]/60 truncate">
                            {job.url}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-[#273F4F]/50">
                          <span>Created {formatDate(job.createdAt)}</span>
                          {job.completedAt && (
                            <span>Completed {formatDate(job.completedAt)}</span>
                          )}
                          {job.fileSize && (
                            <span>{job.fileSize}</span>
                          )}
                        </div>

                        {/* Progress Bar for Processing */}
                        {job.status === 'processing' && job.progress && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-[#273F4F]/60">Processing...</span>
                              <span className="text-[11px] text-[#273F4F]/60">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-black/[0.06] rounded-full h-1.5">
                              <div 
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Error Message */}
                        {job.status === 'failed' && job.error && (
                          <div className="mt-2 text-[11px] text-red-500">
                            Error: {job.error}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
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
      </div>
    </div>
  )
}
