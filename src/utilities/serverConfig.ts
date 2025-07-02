/**
 * Server Configuration
 * This file serves as the single source of truth for server URL and port configuration
 */

// Default port to use across the application
export const DEFAULT_PORT = 3003

// Get the server URL from environment or use the default
export const getServerURL = (): string => {
  // Use VERCEL_PROJECT_PRODUCTION_URL for production deployments
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Use environment variable if available
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  // Use Next.js private origin if available
  if (process.env.__NEXT_PRIVATE_ORIGIN) {
    return process.env.__NEXT_PRIVATE_ORIGIN
  }

  // Fall back to localhost with default port
  return `http://localhost:${DEFAULT_PORT}`
}

// Export the server URL for direct imports
export const SERVER_URL = getServerURL()
