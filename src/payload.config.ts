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
 */
const getBusinessPlugins = () => {
  const businessMode = getBusinessMode()

  const businessPlugins = {
    intellitrade: [intellitradePlugin()],
    salarium: [salariumPlugin()],
    latinos: [latinosPlugin()],
    all: [intellitradePlugin(), salariumPlugin(), latinosPlugin()],
  }

  return businessPlugins[businessMode] || []
}

/**
 * Get active shared feature plugins based on environment
 */
const getSharedFeaturePlugins = () => {
  const enabledFeatures = getEnabledFeatures()
  const businessMode = getBusinessMode()

  const sharedPlugins: { [key: string]: any } = {
    aiManagement: aiManagementPlugin(),
    // affineIntegration: affineIntegrationPlugin(), // Disabled - causing import errors
    // Add more shared plugins here as they're created
    // gamification: gamificationPlugin(),
    // digitalPayments: digitalPaymentsPlugin(),
  }

  // Always include AI Management if Salarium is active (since it has AI provider relationships)
  const requiredPlugins = []
  if (businessMode === 'salarium' || businessMode === 'all') {
    requiredPlugins.push(aiManagementPlugin())
  }

  // Always include AFFiNE Integration for Universal Block System
  // requiredPlugins.push(affineIntegrationPlugin()) // Disabled - causing import errors

  const featurePlugins = enabledFeatures
    .filter((feature) => sharedPlugins[feature])
    .map((feature) => sharedPlugins[feature])

  // Combine required plugins with feature plugins, avoiding duplicates
  const allPlugins = [...requiredPlugins, ...featurePlugins]
  return allPlugins.filter((plugin, index, self) => index === self.findIndex((p) => p === plugin))
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

    // Business-specific collections are added via plugins
    // AFFiNE Integration collections are added via affineIntegrationPlugin (currently disabled)
  ],
  cors: [getServerSideURL()].filter(Boolean),
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
