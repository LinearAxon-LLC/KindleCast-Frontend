// Apple-inspired typography system following blueprint.md
export const typography = {
  // Display text (Hero sections) - 48px
  display: 'text-4xl font-bold tracking-tight',

  // Large titles (Page headers) - 32px
  title1: 'text-3xl font-semibold tracking-tight',

  // Section headers - 24px
  title2: 'text-2xl font-semibold',

  // Subsection headers - 20px
  title3: 'text-xl font-medium',

  // Card/Component headers - 16px
  heading: 'text-lg font-medium',

  // Body text (primary) - 13px
  body: 'text-base leading-relaxed',

  // Body text (secondary) - 13px
  bodySecondary: 'text-base leading-relaxed',

  // Small text - 12px
  caption: 'text-sm',

  // Tiny text - 11px
  footnote: 'text-xs',

  // Interactive text
  link: 'text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer',

  // Button text
  button: 'text-base font-medium',
  buttonSmall: 'text-sm font-medium',

  // Form labels
  label: 'text-sm font-medium',

  // Status text
  success: 'text-xs text-green-600',
  error: 'text-xs text-red-600',
  warning: 'text-xs text-orange-600',
  info: 'text-xs text-blue-600',
} as const

// Color variants for text
export const textColors = {
  primary: 'text-[#273F4F]',
  secondary: 'text-[#273F4F]/70',
  tertiary: 'text-[#273F4F]/60',
  muted: 'text-[#273F4F]/50',
  disabled: 'text-[#273F4F]/40',
}

// Combined typography with colors for easy use
export const text = {
  // Page titles
  pageTitle: `${typography.title1} ${textColors.primary}`,

  // Section headers
  sectionTitle: `${typography.title2} ${textColors.primary}`,

  // Component headers
  componentTitle: `${typography.heading} ${textColors.primary}`,

  // Body text
  body: `${typography.body} ${textColors.primary}`,
  bodySecondary: `${typography.body} ${textColors.secondary}`,

  // Captions and small text
  caption: `${typography.caption} ${textColors.secondary}`,
  footnote: `${typography.footnote} ${textColors.muted}`,

  // Form elements
  label: `${typography.label} ${textColors.primary}`,

  // Interactive
  link: `${typography.link}`,

  // Status
  success: `${typography.success}`,
  error: `${typography.error}`,
  warning: `${typography.warning}`,
  info: `${typography.info}`,
}

export type TypographyVariant = keyof typeof typography
