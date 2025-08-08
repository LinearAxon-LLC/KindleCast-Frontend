'use client'

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  openItems: Set<string>
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  children: React.ReactNode
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  className?: string
}

function Accordion({ children, type = 'single', defaultValue, className }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
    }
    return new Set()
  })

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        if (type === 'single') {
          newSet.clear()
        }
        newSet.add(value)
      }
      return newSet
    })
  }, [type])

  const contextValue = React.useMemo(() => ({
    openItems,
    toggleItem,
    type
  }), [openItems, toggleItem, type])

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("space-y-2", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
  value: string
  className?: string
}

function AccordionItem({ children, value, className }: AccordionItemProps) {
  return (
    <div 
      className={cn(
        "border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm",
        className
      )}
      data-value={value}
    >
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  const itemElement = React.useContext(AccordionItemContext)
  
  if (!context) {
    throw new Error('AccordionTrigger must be used within an Accordion')
  }
  
  if (!itemElement) {
    throw new Error('AccordionTrigger must be used within an AccordionItem')
  }

  const { openItems, toggleItem } = context
  const { value } = itemElement
  const isOpen = openItems.has(value)

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between p-6 text-left font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
        className
      )}
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
    >
      <span className="text-gray-900">{children}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </motion.div>
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

function AccordionContent({ children, className }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  const itemElement = React.useContext(AccordionItemContext)
  
  if (!context) {
    throw new Error('AccordionContent must be used within an Accordion')
  }
  
  if (!itemElement) {
    throw new Error('AccordionContent must be used within an AccordionItem')
  }

  const { openItems } = context
  const { value } = itemElement
  const isOpen = openItems.has(value)

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={cn("px-6 pb-6 pt-0 text-gray-600", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Context for AccordionItem to provide value to children
interface AccordionItemContextValue {
  value: string
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null)

// Enhanced AccordionItem with context
function AccordionItemWithContext({ children, value, className }: AccordionItemProps) {
  const contextValue = React.useMemo(() => ({ value }), [value])
  
  return (
    <AccordionItemContext.Provider value={contextValue}>
      <AccordionItem value={value} className={className}>
        {children}
      </AccordionItem>
    </AccordionItemContext.Provider>
  )
}

export {
  Accordion,
  AccordionItemWithContext as AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
