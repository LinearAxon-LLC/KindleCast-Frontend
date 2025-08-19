import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable React Strict Mode to prevent double API calls in development
  reactStrictMode: false,

  // Development configuration
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  // Image optimization - Allow any URL
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Disable optimization for external images
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  poweredByHeader: false,

  // Fix chunk loading issues in production
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,

  // Use standard build instead of standalone to avoid chunk issues
  // output: 'standalone', // Commented out - causes chunk loading issues
};

export default nextConfig;
