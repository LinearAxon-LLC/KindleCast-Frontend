import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "KindleCast - Save Your Eyes. Read Anything on Kindle.",
    template: "%s | KindleCast"
  },
  description: "Transform any webpage, article, or document into perfectly formatted Kindle reading. No more screen glare, no more eye strain. Join 2,847+ readers who upgraded their reading experience.",
  keywords: [
    "kindle pdf converter",
    "webpage to kindle",
    "video transcript to pdf",
    "audio to kindle",
    "document converter",
    "eye strain relief",
    "digital reading",
    "content conversion",
    "kindle formatting",
    "screen to kindle",
    "pdf generator",
    "reading comfort"
  ],
  authors: [{ name: "KindleCast Team", url: "https://kindlecast.app" }],
  creator: "KindleCast",
  publisher: "KindleCast",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kindlecast.app",
    title: "KindleCast - Save Your Eyes. Read Anything on Kindle.",
    description: "Transform any webpage, article, or document into perfectly formatted Kindle reading. No more screen glare, no more eye strain. Join 2,847+ readers who upgraded their reading experience.",
    siteName: "KindleCast",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KindleCast - Save Your Eyes. Read Anything on Kindle.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KindleCast - Save Your Eyes. Read Anything on Kindle.",
    description: "Transform any webpage, article, or document into perfectly formatted Kindle reading. No more screen glare, no more eye strain. Join 2,847+ readers who upgraded their reading experience.",
    images: ["/twitter-image.png"],
    creator: "@kindlecast_app",
  },
  alternates: {
    canonical: "https://kindlecast.app",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'KindleCast',
    description: 'Transform any webpage, article, or document into perfectly formatted Kindle reading. No more screen glare, no more eye strain.',
    url: 'https://kindlecast.app',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier with 3 conversions'
    },
    creator: {
      '@type': 'Organization',
      name: 'KindleCast Team'
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8F87F1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
