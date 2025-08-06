/* eslint-env node */
/** @type {import('next').NextConfig} */
const nextConfig = {

  // Image optimization
  images: {
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Environment variables for production deployment
  env: {
    THERAPY_ENGAGE_ENV: process.env.NODE_ENV || 'development',
    BACKEND_GRAPHQL_URL: process.env.BACKEND_GRAPHQL_URL || 'https://20.82.234.39.sslip.io/graphql'
  },

  // Redirects for SPA-like behavior during development
  async redirects() {
    return []
  },

  // Security headers for healthcare data protection
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' *.sslip.io wss: https:;"
          }
        ]
      }
    ]
  },

  // Webpack configuration for SVG and asset handling
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    
    return config
  },

  // Output configuration for static deployment
  output: 'standalone',
  
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig