export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kinddy",
    "alternateName": "Kinddy App",
    "url": "https://kinddy.com",
    "logo": "https://kinddy.com/logo.png",
    "description": "Transform web pages, newsletters, podcasts, videos & threads into perfectly formatted Kindle reading. Reduce eye strain with Kinddy's smart content conversion.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-KINDDY",
      "contactType": "customer service",
      "email": "support@kinddy.com",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://twitter.com/kinddy_app",
      "https://linkedin.com/company/kinddy"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "service": {
      "@type": "Service",
      "name": "Content to Kindle Conversion",
      "description": "Convert web content to Kindle-optimized formats for better reading experience",
      "provider": {
        "@type": "Organization",
        "name": "Kinddy"
      },
      "serviceType": "Content Conversion",
      "areaServed": "Worldwide"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema)
      }}
    />
  )
}
