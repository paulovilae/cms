import { withPayload } from '@payloadcms/next/withPayload'
import { SERVER_URL } from './src/utilities/serverConfig.js'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = SERVER_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      // Add production domain for image optimization
      {
        hostname: 'trade.paulovila.org',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: true,
  redirects,
  // Enable standalone output for Docker
  output: 'standalone',
  // Transpile slate modules for proper resolution
  transpilePackages: ['slate', 'slate-react', 'slate-history', 'slate-hyperscript'],
  // Webpack configuration for pnpm symlink resolution
  webpack: (config, { isServer }) => {
    // Handle pnpm symlinks properly
    config.resolve.symlinks = false

    // Add fallbacks for slate modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
    }

    // Business-specific module exclusion to prevent dependency conflicts
    const businessMode = process.env.BUSINESS_MODE || 'all'

    if (businessMode === 'intellitrade') {
      console.log('🔧 IntelliTrade mode: Dependencies now properly available')
    }

    return config
  },
  // Turbopack configuration (Next.js 15.3.0+)
  // Turbopack handles CSS modules automatically, no explicit configuration needed
  turbopack: {
    // Resolve aliases for better module resolution
    resolveAlias: {
      // Add custom aliases if needed in the future
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
