'use client'

import { motion } from 'framer-motion'
import { animations } from '@/lib/animations'

export const AnimatedDiv = motion.div
export const AnimatedSection = motion.section
export const AnimatedArticle = motion.article
export const AnimatedHeader = motion.header
export const AnimatedMain = motion.main

// Pre-configured animated components
interface FadeInSectionProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeInSection({ children, delay = 0, className }: FadeInSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: animations.ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

export function SlideIn({ children, direction = 'up', delay = 0, className }: SlideInProps) {
  const variants = {
    up: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
  }

  return (
    <motion.div
      initial={variants[direction].initial}
      animate={variants[direction].animate}
      transition={{ duration: 0.4, delay, ease: animations.ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScaleIn({ children, delay = 0, className }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay, ease: animations.ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4, ease: animations.ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Interactive animation components
interface PressableProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Pressable({ children, className, onClick }: PressableProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={animations.spring}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
