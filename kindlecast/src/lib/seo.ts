import { Metadata } from 'next'

interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

const defaultConfig = {
  siteName: 'Kinddy',
  domain: 'https://kinddy.com',
  defaultTitle: 'Kinddy - Save Your Eyes. Read Anything on Kindle.',
  defaultDescription: 'Transform web pages, newsletters, podcasts, videos & threads into perfectly formatted Kindle reading. Reduce eye strain with smart content conversion. Free to start.',
  defaultImage: '/og-image.png',
  twitterHandle: '@kinddy_app'
}

export function generateSEOMetadata(config: SEOConfig = {}): Metadata {
  const {
    title = defaultConfig.defaultTitle,
    description = defaultConfig.defaultDescription,
    keywords = [],
    image = defaultConfig.defaultImage,
    url = defaultConfig.domain,
    type = 'website',
    publishedTime,
    modifiedTime
  } = config

  const fullTitle = title === defaultConfig.defaultTitle ? title : `${title} | ${defaultConfig.siteName}`
  const fullUrl = url.startsWith('http') ? url : `${defaultConfig.domain}${url}`
  const fullImageUrl = image.startsWith('http') ? image : `${defaultConfig.domain}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [
      'kindle converter',
      'webpage to kindle',
      'newsletter to kindle',
      'podcast transcript to kindle',
      'video transcript to pdf',
      'thread reader kindle',
      'eye strain relief',
      'digital reading comfort',
      'content conversion tool',
      'kindle formatting service',
      ...keywords
    ],
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImageUrl],
      creator: defaultConfig.twitterHandle,
    },
    alternates: {
      canonical: fullUrl,
    },
  }

  return metadata
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${defaultConfig.domain}${item.url}`
    }))
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function generateHowToSchema(steps: Array<{ name: string; text: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Convert Web Content to Kindle Format',
    description: 'Step-by-step guide to convert web pages, newsletters, and other content to Kindle-friendly format using Kinddy',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text
    }))
  }
}
