// Framer Motion animation presets for Apple-style interactions
export const animations = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  // Stagger children
  stagger: {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  },
  
  // Scale animations
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },
  
  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  // Scale in animation
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  // Bounce animation
  bounce: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        times: [0, 0.4, 1]
      }
    }
  },
  
  // Apple-style spring
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 17
  },
  
  // Apple-style ease
  ease: [0.25, 0.1, 0.25, 1]
} as const

export type AnimationVariant = keyof typeof animations
