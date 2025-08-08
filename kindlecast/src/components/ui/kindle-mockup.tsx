'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Mail, MessageSquare } from 'lucide-react'

interface ContentExample {
  id: string
  type: 'article' | 'newsletter' | 'thread'
  icon: React.ReactNode
  title: string
  preview: string[]
  source: string
}

const contentExamples: ContentExample[] = [
  {
    id: 'article',
    type: 'article',
    icon: <Globe className="w-4 h-4" />,
    title: 'The Future of AI in Healthcare',
    preview: [
      'Artificial intelligence is revolutionizing',
      'healthcare delivery across the globe.',
      'From diagnostic imaging to drug',
      'discovery, AI systems are enabling...'
    ],
    source: 'TechCrunch'
  },
  {
    id: 'newsletter',
    type: 'newsletter',
    icon: <Mail className="w-4 h-4" />,
    title: 'Morning Brew: Tech Edition',
    preview: [
      'Good morning! Here\'s what you',
      'need to know in tech today.',
      '',
      '🚀 OpenAI announces GPT-5',
      '💰 Startup funding hits new high...'
    ],
    source: 'Morning Brew'
  },
  {
    id: 'thread',
    type: 'thread',
    icon: <MessageSquare className="w-4 h-4" />,
    title: 'Thread: Building in Public',
    preview: [
      '1/ Building in public has changed',
      'my entire approach to startups.',
      '',
      '2/ Here\'s what I\'ve learned after',
      '6 months of sharing everything...'
    ],
    source: '@builderperson'
  }
]

export function KindleMockup() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contentExamples.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const currentContent = contentExamples[currentIndex]

  return (
    <div className="relative">
      {/* Kindle Device Frame */}
      <div className="relative w-80 h-96 mx-auto">
        {/* Device Shadow */}
        <div className="absolute inset-0 bg-gray-900/10 rounded-lg blur-xl transform translate-y-4 scale-105" />
        
        {/* Device Body */}
        <div className="relative bg-gray-100 rounded-lg p-6 shadow-2xl border border-gray-200">
          {/* Screen */}
          <div className="bg-white rounded border border-gray-300 h-80 p-4 relative overflow-hidden">
            {/* Screen Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentContent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="h-full flex flex-col"
              >
                {/* Content Header */}
                <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
                  <div className="text-gray-600">
                    {currentContent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{currentContent.source}</p>
                  </div>
                </div>

                {/* Content Title */}
                <h3 className="text-sm font-semibold text-gray-900 mb-3 leading-tight">
                  {currentContent.title}
                </h3>

                {/* Content Preview */}
                <div className="flex-1 space-y-1">
                  {currentContent.preview.map((line, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-xs leading-relaxed ${
                        line === '' ? 'h-2' : 'text-gray-700'
                      }`}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                {/* Reading Progress */}
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Page 1 of 3</span>
                    <span>2 min read</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Kindle Logo/Brand */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="text-xs text-gray-400 font-medium">kindle</div>
          </div>
        </div>

        {/* Power Button */}
        <div className="absolute bottom-8 right-0 w-1 h-6 bg-gray-300 rounded-l" />
      </div>

      {/* Content Type Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {contentExamples.map((example, index) => (
          <button
            key={example.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-brand-primary scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Floating Source Icons Animation */}
      <div className="absolute -top-8 -left-8 w-full h-full pointer-events-none">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-12 left-4 text-brand-secondary"
        >
          <Globe className="w-6 h-6" />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className="absolute top-20 right-8 text-brand-tertiary"
        >
          <Mail className="w-5 h-5" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          className="absolute bottom-16 left-8 text-brand-primary"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.div>
      </div>
    </div>
  )
}
