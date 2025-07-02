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
  // Turbopack configuration (Next.js 15.3.0+)
  turbopack: {
    // Empty configuration to acknowledge Turbopack usage
    // This tells Next.js we're aware of Turbopack and using default settings
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
