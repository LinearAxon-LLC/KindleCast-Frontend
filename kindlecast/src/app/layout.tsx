import type { Metadata } from "next";
import { Rubik, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/auth/ErrorBoundary";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebApplicationSchema } from "@/components/seo/WebApplicationSchema";

// const rubik = Rubik({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kinddy.com"),
  title: {
    default: "Kinddy - Save Your Eyes. Read Anything on Kindle.",
    template: "%s | Kinddy",
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  description:
    "Transform web pages, newsletters, podcasts, videos & threads into perfectly formatted Kindle reading. Reduce eye strain with Kinddy's smart content conversion. Free to start.",
  keywords: [
    "kindle converter",
    "webpage to kindle",
    "newsletter to kindle",
    "podcast transcript to kindle",
    "video transcript to pdf",
    "thread reader kindle",
    "eye strain relief",
    "digital reading comfort",
    "content conversion tool",
    "kindle formatting service",
    "screen to kindle converter",
    "pdf generator for kindle",
    "reading comfort app",
    "kindle pdf maker",
    "web content to ebook",
  ],
  authors: [{ name: "Kinddy Team", url: "https://kinddy.com" }],
  creator: "Kinddy",
  publisher: "Kinddy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kinddy.com",
    title: "Kinddy - Save Your Eyes. Read Anything on Kindle.",
    description:
      "Transform web pages, newsletters, podcasts, videos & threads into perfectly formatted Kindle reading. Reduce eye strain with Kinddy's smart content conversion.",
    siteName: "Kinddy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kinddy - Convert any content to Kindle format and save your eyes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinddy - Save Your Eyes. Read Anything on Kindle.",
    description:
      "Transform web pages, newsletters, podcasts, videos & threads into perfectly formatted Kindle reading. Reduce eye strain with smart content conversion.",
    images: ["/twitter-image.png"],
    creator: "@kinddy_app",
  },
  alternates: {
    canonical: "https://kinddy.com",
  },
  category: "Productivity",
  classification: "Content Conversion Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8F87F1" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kinddy" />
        <meta name="application-name" content="Kinddy" />
        <meta name="msapplication-TileColor" content="#8F87F1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo_send.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        <OrganizationSchema />
        <WebApplicationSchema />

        {/* Umami Analytics - Only in production */}
        {process.env.NODE_ENV === "production" && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="313e2b7e-32bb-4123-b29c-c39b9b97d209"
            strategy="afterInteractive"
          />
        )}
      </head>
      {/* <body className={`${rubik.variable} font-sans antialiased bg-[#EFEEEA]`}> */}
      <body className={`${inter.variable} font-sans antialiased bg-[#EFEEEA]`}>
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
