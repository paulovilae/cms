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
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
