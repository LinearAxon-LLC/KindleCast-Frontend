import { cn } from '@/lib/utils'
import { typography, type TypographyVariant } from '@/lib/typography'
import { forwardRef } from 'react'

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant
  children: React.ReactNode
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ variant, children, className, as = 'span', ...props }, ref) => {
    const Component = as
    
    return (
      <Component
        ref={ref as any}
        className={cn(typography[variant], className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Text.displayName = 'Text'
