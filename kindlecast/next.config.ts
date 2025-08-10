import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development configuration
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
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
