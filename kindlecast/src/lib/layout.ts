// Apple-inspired layout system for KindleCast
export const layout = {
  // Page containers
  page: 'min-h-screen bg-gray-50 dark:bg-dark-50',
  container: 'max-w-7xl mx-auto px-6 py-8',
  section: 'py-12 sm:py-16',
  
  // Content spacing
  stack: {
    xs: 'space-y-2',
    sm: 'space-y-4', 
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12',
  },
  
  // Grid systems
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
    cols3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    cols4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
  }
} as const

export type LayoutVariant = keyof typeof layout
export type StackVariant = keyof typeof layout.stack
export type GridVariant = keyof typeof layout.grid
