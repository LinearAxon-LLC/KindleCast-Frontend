# KindleCast - Apple Design Blueprint
*Next.js + Tailwind CSS + shadcn/ui + Framer Motion*

## 🎯 Project Overview
Design system for KindleCast frontend following Apple's Human Interface Guidelines to create an authentic macOS/iOS experience with premium feel and smooth interactions.

## 📦 Dependencies Setup

```bash
# Core Next.js setup
npx create-next-app@latest kindlecast --typescript --tailwind --eslint --app

# UI & Animation
npm install framer-motion lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
npm install class-variance-authority clsx tailwind-merge
npm install @next/font

# Performance
npm install @vercel/analytics @vercel/speed-insights
```

## 🎨 Design Token System

### Tailwind Configuration
```javascript
// tailwind.config.ts
import { fontFamily } from "tailwindcss/defaultTheme"

module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // KindleCast Brand Colors (Purple Gradient Palette)
        brand: {
          primary: '#8F87F1',     // Deep purple
          secondary: '#C68EFD',   // Medium purple
          tertiary: '#E9A5F1',    // Light purple
          accent: '#FED2E2',      // Very light pink
        },
        // Apple System Colors
        apple: {
          blue: '#007AFF',
          indigo: '#5856D6',
          purple: '#AF52DE',
          pink: '#FF2D92',
          red: '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          green: '#34C759',
          mint: '#00C7BE',
          teal: '#30B0C7',
          cyan: '#32D74B',
        },
        // Semantic grays (light mode)
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Dark mode variants
        dark: {
          50: '#1C1C1E',
          100: '#2C2C2E',
          200: '#3A3A3C',
          300: '#48484A',
          400: '#636366',
          500: '#8E8E93',
          600: '#AEAEB2',
          700: '#C7C7CC',
          800: '#D1D1D6',
          900: '#F2F2F7',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', ...fontFamily.sans],
        mono: ['SF Mono', 'Consolas', 'Monaco', ...fontFamily.mono],
      },
      fontSize: {
        // Apple's type scale
        'xs': ['11px', { lineHeight: '16px', letterSpacing: '0.066em' }],
        'sm': ['12px', { lineHeight: '18px', letterSpacing: '0.033em' }],
        'base': ['13px', { lineHeight: '20px', letterSpacing: '0' }],
        'lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.022em' }],
        'xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.022em' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.022em' }],
        '3xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.025em' }],
        '4xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.025em' }],
      },
      spacing: {
        // 4px base unit system
        '18': '72px',
        '88': '352px',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      }
    }
  }
}
```

## 📝 Typography System

### Type Scale Classes
```typescript
// lib/typography.ts
export const typography = {
  // Display text (Hero sections)
  display: 'text-4xl font-bold tracking-tight text-gray-900 dark:text-white',
  
  // Large titles (Page headers)
  title1: 'text-3xl font-semibold tracking-tight text-gray-900 dark:text-white',
  
  // Section headers
  title2: 'text-2xl font-semibold text-gray-900 dark:text-white',
  
  // Subsection headers
  title3: 'text-xl font-medium text-gray-900 dark:text-white',
  
  // Body text (primary)
  body: 'text-base text-gray-700 dark:text-gray-300 leading-relaxed',
  
  // Body text (secondary)
  bodySecondary: 'text-base text-gray-500 dark:text-gray-400 leading-relaxed',
  
  // Small text
  caption: 'text-sm text-gray-500 dark:text-gray-400',
  
  // Tiny text
  footnote: 'text-xs text-gray-400 dark:text-gray-500',
  
  // Interactive text
  link: 'text-apple-blue hover:text-apple-blue/80 transition-colors cursor-pointer',
}
```

### Usage Example
```tsx
// components/ui/text.tsx
import { cn } from '@/lib/utils'
import { typography } from '@/lib/typography'

interface TextProps {
  variant: keyof typeof typography
  children: React.ReactNode
  className?: string
}

export function Text({ variant, children, className }: TextProps) {
  return (
    <span className={cn(typography[variant], className)}>
      {children}
    </span>
  )
}
```

## 🏗️ Layout System

### Container & Spacing
```tsx
// lib/layout.ts
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
}
```

## 🎪 Component Library

### Button System (shadcn/ui enhanced)
```tsx
// components/ui/button.tsx
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-apple-blue text-white hover:bg-apple-blue/90 focus:ring-apple-blue/50 active:scale-[0.98]',
        secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-300 active:scale-[0.98]',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300 active:scale-[0.98]',
        destructive: 'bg-apple-red text-white hover:bg-apple-red/90 focus:ring-apple-red/50',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    }
  }
)
```

### Card Component
```tsx
// components/ui/card.tsx
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  hover?: boolean
  className?: string
}

const cardVariants = cva(
  'rounded-2xl p-6 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-dark-100 shadow-sm',
        elevated: 'bg-white dark:bg-dark-100 shadow-lg',
        outlined: 'bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-200',
      },
      hover: {
        true: 'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
      }
    }
  }
)
```

### Input System
```tsx
// components/ui/input.tsx
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base',
          'placeholder:text-gray-400 focus:border-apple-blue focus:outline-none focus:ring-2 focus:ring-apple-blue/20',
          'disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-200 dark:bg-dark-100',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

## 🎬 Animation System

### Framer Motion Presets
```tsx
// lib/animations.ts
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
  }
}
```

### Animated Components
```tsx
// components/ui/animated.tsx
import { motion } from 'framer-motion'
import { animations } from '@/lib/animations'

export const AnimatedDiv = motion.div
export const AnimatedSection = motion.section

// Pre-configured components
export function FadeInSection({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

## 🎯 Page Structure Templates

### Landing Page Template
```tsx
// app/page.tsx structure
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-dark-50 dark:to-dark-100">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FadeInSection>
            <h1 className={typography.display}>
              Transform Your Books Into<br />
              <span className="text-apple-blue">Audio Experiences</span>
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={0.2}>
            <p className={cn(typography.body, "text-xl max-w-2xl mx-auto")}>
              KindleCast converts your digital books into high-quality audiobooks using advanced AI voice technology.
            </p>
          </FadeInSection>
          
          <FadeInSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="shadow-lg">
                Get Started Free
              </Button>
              <Button variant="secondary" size="xl">
                Watch Demo
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
```

### Dashboard Layout Template
```tsx
// components/layout/dashboard-layout.tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-100 border-r border-gray-200 dark:border-dark-200">
        <div className="p-6 space-y-6">
          {/* Navigation */}
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
```

## 🎨 Dark Mode Implementation

### Theme Provider Setup
```tsx
// components/theme-provider.tsx
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

### Theme Toggle Component
```tsx
// components/ui/theme-toggle.tsx
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  
  return (
    <Button
      variant="ghost" 
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

## ⚡ Performance Optimizations

### Image Optimization
```tsx
// components/ui/optimized-image.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function OptimizedImage({ src, alt, className, priority = false }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority={priority}
      className={cn('rounded-xl object-cover', className)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  )
}
```

### Bundle Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}

module.exports = nextConfig
```

## 📱 Responsive Design Breakpoints

```typescript
// lib/breakpoints.ts
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Large desktop
}

// Usage in components
const ResponsiveGrid = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
```

## 🎯 Implementation Checklist

### Phase 1: Foundation
- [ ] Next.js 14 with App Router setup
- [ ] Tailwind CSS configuration with Apple design tokens
- [ ] shadcn/ui components installation
- [ ] Typography system implementation
- [ ] Dark mode provider setup

### Phase 2: Core Components
- [ ] Button variants with Apple styling
- [ ] Input and form components
- [ ] Card and surface components
- [ ] Navigation components
- [ ] Layout components

### Phase 3: Advanced Features
- [ ] Framer Motion animations
- [ ] Page transitions
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Toast notifications

### Phase 4: Optimization
- [ ] Image optimization with Next.js Image
- [ ] Bundle analysis and optimization
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Accessibility testing

## 🎪 File Structure

```
/app
  /globals.css
  /layout.tsx
  /page.tsx
  /(auth)/
  /(dashboard)/
/components
  /ui/
    button.tsx
    card.tsx
    input.tsx
    text.tsx
  /layout/
  /features/
/lib
  /utils.ts
  /typography.ts
  /animations.ts
  /constants.ts
/public
  /images/
  /icons/
```

## 🚀 Quick Start Commands

```bash
# Create project
npx create-next-app@latest kindlecast --typescript --tailwind --app

# Install dependencies
npm install framer-motion lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu class-variance-authority clsx tailwind-merge next-themes

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add core components
npx shadcn-ui@latest add button card input

# Start development
npm run dev
```

This blueprint provides a complete foundation for building a premium Apple-inspired KindleCast frontend. Follow the implementation phases systematically for best results.