/**
 * Quick Access Utilities for Development
 *
 * Provides helper functions to generate URLs with automatic authentication
 * for faster development and testing workflows.
 */

export interface QuickAccessOptions {
  email?: string
  password?: string
  token?: string
  autoLogin?: boolean
}

/**
 * Generate a URL with authentication parameters for quick access
 */
export function generateQuickAccessUrl(baseUrl: string, options: QuickAccessOptions = {}): string {
  const url = new URL(baseUrl)

  if (options.autoLogin) {
    url.searchParams.set('autoLogin', 'true')
  } else if (options.email && options.password) {
    url.searchParams.set('email', options.email)
    url.searchParams.set('password', options.password)
  } else if (options.token) {
    url.searchParams.set('token', options.token)
  }

  return url.toString()
}

/**
 * Common quick access URLs for development
 */
export const quickAccessUrls = {
  // Salarium URLs
  salarium: {
    jobFlow: (baseUrl: string) => ({
      autoLogin: generateQuickAccessUrl(`${baseUrl}/salarium/job-flow`, { autoLogin: true }),
      testUser: generateQuickAccessUrl(`${baseUrl}/salarium/job-flow`, {
        email: 'test@test.com',
        password: 'test',
      }),
      adminUser: generateQuickAccessUrl(`${baseUrl}/salarium/job-flow`, {
        email: 'admin@admin.com',
        password: 'admin',
      }),
    }),
    flowInstances: (baseUrl: string) => ({
      autoLogin: generateQuickAccessUrl(`${baseUrl}/salarium/flow-instances`, { autoLogin: true }),
      testUser: generateQuickAccessUrl(`${baseUrl}/salarium/flow-instances`, {
        email: 'test@test.com',
        password: 'test',
      }),
    }),
  },

  // IntelliTrade URLs
  intellitrade: {
    home: (baseUrl: string) => ({
      autoLogin: generateQuickAccessUrl(`${baseUrl}/intellitrade`, { autoLogin: true }),
    }),
  },

  // Latinos URLs
  latinos: {
    home: (baseUrl: string) => ({
      autoLogin: generateQuickAccessUrl(`${baseUrl}/latinos`, { autoLogin: true }),
    }),
  },

  // Admin URLs
  admin: {
    dashboard: (baseUrl: string) => ({
      autoLogin: generateQuickAccessUrl(`${baseUrl}/admin`, { autoLogin: true }),
      testUser: generateQuickAccessUrl(`${baseUrl}/admin`, {
        email: 'test@test.com',
        password: 'test',
      }),
    }),
  },
}

/**
 * Print quick access URLs to console for easy copying
 */
export function printQuickAccessUrls(baseUrl: string = 'http://localhost:3003') {
  console.log('\n🚀 Quick Access URLs for Development:')
  console.log('=====================================')

  console.log('\n📋 Salarium (HR Workflows):')
  console.log('• Job Flow (Auto-login):', quickAccessUrls.salarium.jobFlow(baseUrl).autoLogin)
  console.log(
    '• Flow Instances (Auto-login):',
    quickAccessUrls.salarium.flowInstances(baseUrl).autoLogin,
  )

  console.log('\n💼 IntelliTrade (Trade Finance):')
  console.log('• Home (Auto-login):', quickAccessUrls.intellitrade.home(baseUrl).autoLogin)

  console.log('\n📈 Latinos (Trading Bots):')
  console.log('• Home (Auto-login):', quickAccessUrls.latinos.home(baseUrl).autoLogin)

  console.log('\n⚙️ Admin Dashboard:')
  console.log('• Dashboard (Auto-login):', quickAccessUrls.admin.dashboard(baseUrl).autoLogin)

  console.log('\n💡 Usage Tips:')
  console.log('• Add ?autoLogin=true to any URL for instant test user login')
  console.log('• Add ?email=your@email.com&password=yourpass for custom login')
  console.log('• Add ?token=your-jwt-token for token-based authentication')
  console.log('=====================================\n')
}

/**
 * Development helper to create bookmarkable URLs
 */
export function createBookmarkableUrls(baseUrl: string = 'http://localhost:3003') {
  return {
    'Salarium Job Flow (Auto-login)': quickAccessUrls.salarium.jobFlow(baseUrl).autoLogin,
    'Salarium Flow Instances (Auto-login)':
      quickAccessUrls.salarium.flowInstances(baseUrl).autoLogin,
    'IntelliTrade Home (Auto-login)': quickAccessUrls.intellitrade.home(baseUrl).autoLogin,
    'Latinos Home (Auto-login)': quickAccessUrls.latinos.home(baseUrl).autoLogin,
    'Admin Dashboard (Auto-login)': quickAccessUrls.admin.dashboard(baseUrl).autoLogin,
  }
}

/**
 * Generate a JWT token for API access (development only)
 * Note: This is a simplified example. In production, use proper JWT libraries.
 */
export function generateDevToken(userId: string, email: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      userId,
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    }),
  )
  const signature = btoa('dev-signature') // In production, use proper HMAC

  return `${header}.${payload}.${signature}`
}

// Export for console usage in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  ;(window as any).quickAccess = {
    generateUrl: generateQuickAccessUrl,
    urls: quickAccessUrls,
    print: printQuickAccessUrls,
    bookmarks: createBookmarkableUrls,
    generateToken: generateDevToken,
  }
}
