// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'

// Core collections (always active)
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'

// Marketing collections (shared across businesses)
import { TeamMembers } from './collections/TeamMembers'
import { Testimonials } from './collections/Testimonials'
import { Features } from './collections/Features'
import { PricingPlans } from './collections/PricingPlans'
import { Businesses } from './collections/Businesses'

// Globals
import { Footer } from './Footer/config'
import { Header } from './Header/config'

// Core plugins
import { plugins } from './plugins'

// Business plugins - imported dynamically to avoid build-time dependency issues
// import { intellitradePlugin } from './plugins/business/intellitrade'
// import { salariumPlugin } from './plugins/business/salarium'
// import { latinosPlugin } from './plugins/business/latinos'

// Shared feature plugins - imported dynamically to avoid build-time dependency issues
// import { aiManagementPlugin } from './plugins/shared/ai-management'
// import { affineIntegrationPlugin } from './plugins/shared/affine-integration' // Disabled - causing import errors
// import jobFlowCascadePlugin from './plugins/job-flow-cascade'

// Utilities
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { getBusinessMode, getDatabasePath, getEnabledFeatures } from './utilities/environment'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Get active business plugins based on environment
 * Dynamic import to avoid build-time dependency issues
 */
const getBusinessPlugins = async () => {
  const businessMode = getBusinessMode()

  const plugins = []

  // Only import and load plugins for the current business mode
  // This prevents build-time dependency conflicts
  if (businessMode === 'intellitrade' || businessMode === 'all') {
    try {
      const { intellitradePlugin } = await import('./plugins/business/intellitrade')
      plugins.push(intellitradePlugin())
    } catch (error) {
      console.warn('Failed to load intellitrade plugin:', error.message)
    }
  }

  if (businessMode === 'salarium' || businessMode === 'all') {
    try {
      const { salariumPlugin } = await import('./plugins/business/salarium')
      plugins.push(salariumPlugin())
    } catch (error) {
      console.warn('Failed to load salarium plugin:', error.message)
    }
  }

  if (businessMode === 'latinos' || businessMode === 'all') {
    try {
      const { latinosPlugin } = await import('./plugins/business/latinos')
      plugins.push(latinosPlugin())
    } catch (error) {
      console.warn('Failed to load latinos plugin:', error.message)
    }
  }

  return plugins
}

/**
 * Get active shared feature plugins based on environment
 * Dynamic import to avoid build-time dependency issues
 */
const getSharedFeaturePlugins = async () => {
  const enabledFeatures = getEnabledFeatures()
  const businessMode = getBusinessMode()

  // Track which plugins should be included to avoid duplicates
  const pluginsToInclude = new Set<string>()

  // Always include AI Management if Salarium is active (since it has AI provider relationships)
  if (businessMode === 'salarium' || businessMode === 'all') {
    pluginsToInclude.add('aiManagement')
  }

  // Add enabled features
  enabledFeatures.forEach((feature) => {
    pluginsToInclude.add(feature)
  })

  // Always include AFFiNE Integration for Universal Block System
  // pluginsToInclude.add('affineIntegration') // Disabled - causing import errors

  // Create plugin instances only once per unique plugin
  const plugins = []

  if (pluginsToInclude.has('aiManagement')) {
    try {
      const { aiManagementPlugin } = await import('./plugins/shared/ai-management')
      plugins.push(aiManagementPlugin())
    } catch (error) {
      console.warn('Failed to load ai-management plugin:', (error as Error).message)
    }
  }

  // if (pluginsToInclude.has('affineIntegration')) {
  //   try {
  //     const { affineIntegrationPlugin } = await import('./plugins/shared/affine-integration')
  //     plugins.push(affineIntegrationPlugin())
  //   } catch (error) {
  //     console.warn('Failed to load affine-integration plugin:', (error as Error).message)
  //   }
  // }

  // Always include Job Flow Cascade plugin when Salarium is active
  if (businessMode === 'salarium' || businessMode === 'all') {
    try {
      const jobFlowCascadePlugin = await import('./plugins/job-flow-cascade')
      plugins.push(jobFlowCascadePlugin.default())
    } catch (error) {
      console.warn('Failed to load job-flow-cascade plugin:', (error as Error).message)
    }
  }

  // Add more shared plugins here as they're created
  // if (pluginsToInclude.has('gamification')) {
  //   try {
  //     const { gamificationPlugin } = await import('./plugins/shared/gamification')
  //     plugins.push(gamificationPlugin())
  //   } catch (error) {
  //     console.warn('Failed to load gamification plugin:', (error as Error).message)
  //   }
  // }

  return plugins
}

/**
 * Get all active plugins
 * IMPORTANT: For shared database architecture, ALL business plugins must be loaded
 * in ALL containers to maintain schema consistency, regardless of business mode
 */
const getActivePlugins = () => {
  const businessMode = getBusinessMode()

  // Import business plugins synchronously - they must all be available for shared schema
  let businessPlugins = []

  try {
    const { intellitradePlugin } = require('./plugins/business/intellitrade')
    businessPlugins.push(intellitradePlugin())
  } catch (error) {
    console.warn('Failed to load intellitrade plugin:', (error as Error).message)
  }

  try {
    const { salariumPlugin } = require('./plugins/business/salarium')
    businessPlugins.push(salariumPlugin())
  } catch (error) {
    console.warn('Failed to load salarium plugin:', (error as Error).message)
  }

  try {
    const { latinosPlugin } = require('./plugins/business/latinos')
    businessPlugins.push(latinosPlugin())
  } catch (error) {
    console.warn('Failed to load latinos plugin:', (error as Error).message)
  }

  // Import shared plugins
  let sharedPlugins = []

  try {
    const { aiManagementPlugin } = require('./plugins/shared/ai-management')
    sharedPlugins.push(aiManagementPlugin())
  } catch (error) {
    console.warn('Failed to load ai-management plugin:', (error as Error).message)
  }

  // Only load job-flow-cascade for Salarium and all modes (to avoid slate issues in other modes)
  if (businessMode === 'salarium' || businessMode === 'all') {
    try {
      const jobFlowCascadePlugin = require('./plugins/job-flow-cascade').default
      sharedPlugins.push(jobFlowCascadePlugin())
    } catch (error) {
      console.warn('Failed to load job-flow-cascade plugin:', (error as Error).message)
    }
  }

  console.log(
    `🔧 ${businessMode} mode: Loaded ${businessPlugins.length} business plugins, ${sharedPlugins.length} shared plugins`,
  )

  return [
    // Core plugins (always active)
    ...plugins,
    // Business plugins (all loaded for schema consistency)
    ...businessPlugins,
    // Shared plugins (conditionally loaded)
    ...sharedPlugins,
  ]
}

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterNavLinks: ['@/components/LanguageSwitcher'],
      graphics: {
        Logo: '@/components/AdminLogo',
        Icon: '@/components/AdminLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  db: sqliteAdapter({
    client: {
      url: getDatabasePath(),
    },
  }),
  collections: [
    // Core collections (always active)
    Pages,
    Posts,
    Media,
    Categories,
    Users,

    // Marketing collections (shared across businesses)
    TeamMembers,
    Testimonials,
    Features,
    PricingPlans,
    Businesses,

    // Business-specific collections are added via plugins
    // AFFiNE Integration collections are added via affineIntegrationPlugin (currently disabled)
  ],
  cors: [
    getServerSideURL(),
    // Production domains for Salarium
    'https://salarium.paulovila.org',
    'http://salarium.paulovila.org',
    // Production domains for other businesses
    'https://intellitrade.paulovila.org',
    'http://intellitrade.paulovila.org',
    'https://latinos.paulovila.org',
    'http://latinos.paulovila.org',
    'https://trade.paulovila.org',
    'http://trade.paulovila.org',
    // Development domains
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
  ].filter(Boolean),
  globals: [Header, Footer],
  plugins: getActivePlugins(),
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, es },
    translations: {
      en: {
        general: {
          dashboard: 'Dashboard',
          collections: 'Collections',
          globals: 'Globals',
          cancel: 'Cancel',
          save: 'Save',
          none: 'None',
          create: 'Create',
          logout: 'Logout',
          new: 'New',
          drafts: 'Drafts',
          published: 'Published',
          preview: 'Preview',
          login: 'Login',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          createFirstUser: 'Create First User',
          forgotPassword: 'Forgot Password',
          resetPassword: 'Reset Password',
          fields: 'Fields',
          submit: 'Submit',
          content: 'Content',
          mediaLibrary: 'Media Library',
          upload: 'Upload',
          users: 'Users',
          account: 'Account',
          settings: 'Settings',
          language: 'Language',
        },
        custom: {
          welcome: 'Welcome to Multi-Tenant CMS',
          intellitrade: {
            productName: 'IntelliTrade',
            features: 'Key Features',
          },
          salarium: {
            productName: 'Salarium',
            features: 'HR Features',
          },
          latinos: {
            productName: 'Latinos',
            features: 'Trading Features',
          },
          affine: {
            workspaces: 'AFFiNE Workspaces',
            documents: 'Workflow Documents',
            collaboration: 'Real-time Collaboration',
          },
        },
      },
      es: {
        general: {
          dashboard: 'Panel de Control',
          collections: 'Colecciones',
          globals: 'Globales',
          cancel: 'Cancelar',
          save: 'Guardar',
          none: 'Ninguno',
          create: 'Crear',
          logout: 'Cerrar Sesión',
          new: 'Nuevo',
          drafts: 'Borradores',
          published: 'Publicado',
          preview: 'Vista Previa',
          login: 'Iniciar Sesión',
          email: 'Correo Electrónico',
          password: 'Contraseña',
          confirmPassword: 'Confirmar Contraseña',
          createFirstUser: 'Crear Primer Usuario',
          forgotPassword: 'Olvidé mi Contraseña',
          resetPassword: 'Restablecer Contraseña',
          fields: 'Campos',
          submit: 'Enviar',
          content: 'Contenido',
          mediaLibrary: 'Biblioteca de Medios',
          upload: 'Subir',
          users: 'Usuarios',
          account: 'Cuenta',
          settings: 'Configuración',
          language: 'Idioma',
        },
        custom: {
          welcome: 'Bienvenido al CMS Multi-Tenant',
          intellitrade: {
            productName: 'IntelliTrade',
            features: 'Características Principales',
          },
          salarium: {
            productName: 'Salarium',
            features: 'Características de RRHH',
          },
          latinos: {
            productName: 'Latinos',
            features: 'Características de Trading',
          },
          affine: {
            workspaces: 'Espacios de Trabajo AFFiNE',
            documents: 'Documentos de Flujo de Trabajo',
            collaboration: 'Colaboración en Tiempo Real',
          },
        },
      },
    },
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
