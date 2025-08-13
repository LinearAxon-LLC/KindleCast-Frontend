/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable to prevent double API calls in development
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig
