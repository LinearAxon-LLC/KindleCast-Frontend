import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "KindleCast - Transform Your Books Into Audio Experiences",
  description: "Convert your digital books into high-quality audiobooks using advanced AI voice technology.",
  keywords: ["audiobooks", "AI", "text-to-speech", "books", "reading", "accessibility"],
  authors: [{ name: "KindleCast Team" }],
  creator: "KindleCast",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kindlecast.com",
    title: "KindleCast - Transform Your Books Into Audio Experiences",
    description: "Convert your digital books into high-quality audiobooks using advanced AI voice technology.",
    siteName: "KindleCast",
  },
  twitter: {
    card: "summary_large_image",
    title: "KindleCast - Transform Your Books Into Audio Experiences",
    description: "Convert your digital books into high-quality audiobooks using advanced AI voice technology.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
