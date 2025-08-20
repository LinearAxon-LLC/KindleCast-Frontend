export function WebApplicationSchema() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kinddy",
    "url": "https://kinddy.com",
    "description": "Transform web pages, newsletters, podcasts, videos & threads into perfectly formatted Kindle reading. Reduce eye strain with smart content conversion.",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "author": {
      "@type": "Organization",
      "name": "Kinddy"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Plan",
        "price": "0",
        "priceCurrency": "USD",
        "description": "5 Quick Send/month, 3 AI Formatting/month, 20 days retention",
        "category": "Free"
      },
      {
        "@type": "Offer",
        "name": "Premium Plan",
        "price": "9.99",
        "priceCurrency": "USD",
        "description": "Unlimited Quick Send, 100 AI Formatting/month, 120 days retention",
        "category": "Premium"
      }
    ],
    "featureList": [
      "Web page to Kindle conversion",
      "Newsletter to Kindle delivery",
      "Podcast transcript conversion",
      "Video transcript to PDF",
      "Social media thread reader",
      "Eye strain relief",
      "AI-powered formatting",
      "Direct Kindle delivery"
    ],
    "screenshot": "https://kinddy.com/screenshot.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(webAppSchema)
      }}
    />
  )
}
