'use client'

import { generateHowToSchema, generateFAQSchema } from '@/lib/seo'

export function HomePageStructuredData() {
  const howToSteps = [
    {
      name: 'Paste Your Link',
      text: 'Copy and paste any web page, newsletter, podcast, video, or thread URL into Kinddy\'s input box.'
    },
    {
      name: 'Choose Format',
      text: 'Select your preferred format: Just PDF, Summarize, Learning Ready, or Custom with your own instructions.'
    },
    {
      name: 'Get Kindle-Ready Content',
      text: 'Kinddy converts your content into a perfectly formatted, eye-friendly document ready for your Kindle.'
    }
  ]

  const faqs = [
    {
      question: 'What types of content can I convert with Kinddy?',
      answer: 'Kinddy can convert web pages, newsletters, podcast transcripts, video transcripts, social media threads, and most online text content into Kindle-friendly formats.'
    },
    {
      question: 'How does Kinddy help reduce eye strain?',
      answer: 'By converting bright screen content to your Kindle\'s e-ink display, Kinddy eliminates blue light exposure and screen glare, making reading more comfortable for your eyes.'
    },
    {
      question: 'Is Kinddy free to use?',
      answer: 'Yes! Kinddy offers a free plan with 5 Quick Send conversions and 3 AI Formatting conversions per month. Premium plans are available for unlimited usage.'
    },
    {
      question: 'How long does content conversion take?',
      answer: 'Most conversions complete within 30-60 seconds. Complex content with AI formatting may take up to 2-3 minutes.'
    },
    {
      question: 'Can I customize how my content is formatted?',
      answer: 'Absolutely! Choose from preset formats like Summarize or Learning Ready, or use Custom format with your own instructions for personalized formatting.'
    }
  ]

  const howToSchema = generateHowToSchema(howToSteps)
  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
