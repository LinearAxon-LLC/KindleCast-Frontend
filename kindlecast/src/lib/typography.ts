// Clean typography system for KindleCast
export const typography = {
  // Display text (Hero sections)
  display: 'text-4xl font-bold tracking-tight text-gray-900',

  // Large titles (Page headers)
  title1: 'text-3xl font-semibold tracking-tight text-gray-900',

  // Section headers
  title2: 'text-2xl font-semibold text-gray-900',

  // Subsection headers
  title3: 'text-xl font-medium text-gray-900',

  // Body text (primary)
  body: 'text-base text-gray-700 leading-relaxed',

  // Body text (secondary)
  bodySecondary: 'text-base text-gray-500 leading-relaxed',

  // Small text
  caption: 'text-sm text-gray-500',

  // Tiny text
  footnote: 'text-xs text-gray-400',

  // Interactive text
  link: 'text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer',
} as const

export type TypographyVariant = keyof typeof typography
