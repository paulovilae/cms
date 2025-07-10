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

// Business plugins
import { intellitradePlugin } from './plugins/business/intellitrade'
import { salariumPlugin } from './plugins/business/salarium'
import { latinosPlugin } from './plugins/business/latinos'

// Shared feature plugins
import { aiManagementPlugin } from './plugins/shared/ai-management'
// import { affineIntegrationPlugin } from './plugins/shared/affine-integration' // Disabled - causing import errors

// Utilities
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { getBusinessMode, getDatabasePath, getEnabledFeatures } from './utilities/environment'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Get active business plugins based on environment
 * For shared schema architecture, always load all business plugins
 * but collections will be filtered by business mode in access control
 */
const getBusinessPlugins = () => {
  const businessMode = getBusinessMode()

  // Always load all business plugins to maintain shared schema
  // Individual services will filter collections through access control
  return [intellitradePlugin(), salariumPlugin(), latinosPlugin()]
}

/**
 * Get active shared feature plugins based on environment
 */
const getSharedFeaturePlugins = () => {
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
    plugins.push(aiManagementPlugin())
  }
  // if (pluginsToInclude.has('affineIntegration')) {
  //   plugins.push(affineIntegrationPlugin())
  // }
  // Add more shared plugins here as they're created
  // if (pluginsToInclude.has('gamification')) {
  //   plugins.push(gamificationPlugin())
  // }
  // if (pluginsToInclude.has('digitalPayments')) {
  //   plugins.push(digitalPaymentsPlugin())
  // }

  return plugins
}

/**
 * Get all active plugins
 */
const getActivePlugins = () => {
  return [
    // Core plugins (always active)
    ...plugins,

    // Shared feature plugins (configurable)
    ...getSharedFeaturePlugins(),

    // Business plugins (based on BUSINESS_MODE)
    ...getBusinessPlugins(),
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
