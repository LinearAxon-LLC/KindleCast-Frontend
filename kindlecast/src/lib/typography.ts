// Apple-inspired typography system for KindleCast
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
} as const

export type TypographyVariant = keyof typeof typography
