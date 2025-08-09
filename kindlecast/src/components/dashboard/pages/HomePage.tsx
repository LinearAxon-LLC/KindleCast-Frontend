'use client'

import React, { useState } from 'react'
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useLinkProcessor } from '@/hooks/useLinkProcessor'

interface HomePageProps {
  onSwitchTab: (tab: string) => void
}

export function HomePage({ onSwitchTab }: HomePageProps) {
  const [url, setUrl] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('Just PDF')
  const [customPrompt, setCustomPrompt] = useState('')
  const { isLoading, isSuccess, error, submitLink } = useLinkProcessor()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitLink(url, selectedFormat, customPrompt)
  }

  const recentJobs = [
    { id: 1, title: 'Wikipedia: Machine Learning', status: 'completed', format: 'PDF', time: '2 hours ago' },
    { id: 2, title: 'YouTube: React Tutorial', status: 'processing', format: 'Summary', time: '5 minutes ago' },
    { id: 3, title: 'Reddit: Programming Tips', status: 'failed', format: 'Learning', time: '1 day ago' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing': return <Clock className="w-4 h-4 text-blue-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#273F4F] mb-2">Welcome back!</h1>
          <p className="text-[15px] text-[#273F4F]/70">Convert your content to Kindle-ready formats</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Convert Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-[8px] flex items-center justify-center">
                  <Plus className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-[17px] font-semibold text-[#273F4F]">Quick Convert</h2>
                  <p className="text-[13px] text-[#273F4F]/60">Convert any link to Kindle format</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* URL Input */}
                <div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your link here..."
                    className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-[13px] font-medium text-[#273F4F]/70 mb-2">Format</label>
                  <div className="flex flex-wrap gap-2">
                    {['Just PDF', 'Summarize', 'Learning Ready', 'Custom'].map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => setSelectedFormat(format)}
                        className={`px-4 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-150 ${
                          selectedFormat === format
                            ? 'bg-brand-primary text-white'
                            : 'bg-black/[0.04] hover:bg-black/[0.08] text-black/70 border border-black/[0.06]'
                        }`}
                        disabled={isLoading}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt */}
                {selectedFormat === 'Custom' && (
                  <div>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe how you want the content formatted..."
                      className="w-full px-4 py-3 bg-black/[0.03] border border-black/[0.08] rounded-[8px] text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all duration-200 resize-none"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white text-[15px] font-medium py-3 px-6 rounded-[8px] transition-all duration-150 flex items-center justify-center ${
                    isLoading 
                      ? 'bg-brand-primary/70 cursor-not-allowed' 
                      : isSuccess 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? 'Processing...' : isSuccess ? 'Sent!' : 'Convert Now'}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-[13px] text-center">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Jobs */}
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-semibold text-[#273F4F]">Recent Jobs</h3>
                <button
                  onClick={() => onSwitchTab('history')}
                  className="text-[13px] text-brand-primary hover:text-brand-primary/80 font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-start gap-3 p-3 bg-black/[0.02] rounded-[8px]">
                    {getStatusIcon(job.status)}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#273F4F] truncate">
                        {job.title}
                      </div>
                      <div className="text-[11px] text-[#273F4F]/60">
                        {job.format} • {job.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-6">
              <h3 className="text-[17px] font-semibold text-[#273F4F] mb-4">Usage This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#273F4F]/70">Conversions</span>
                  <span className="text-[15px] font-semibold text-[#273F4F]">12 / 100</span>
                </div>
                <div className="w-full bg-black/[0.06] rounded-full h-2">
                  <div className="bg-brand-primary h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
