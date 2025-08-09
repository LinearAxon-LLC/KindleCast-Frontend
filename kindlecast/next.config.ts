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
    ],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  poweredByHeader: false,

  // Static optimization
  output: 'standalone',
};

export default nextConfig;
