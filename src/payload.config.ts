// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

// Import new collections
import { TeamMembers } from './collections/TeamMembers'
import { Testimonials } from './collections/Testimonials'
import { Features } from './collections/Features'
import { PricingPlans } from './collections/PricingPlans'
import { ExportTransactions } from './collections/ExportTransactions'
import { Companies } from './collections/Companies'
import { Routes } from './collections/Routes'
import { SmartContracts } from './collections/SmartContracts'
import { AIProviders } from './collections/AIProviders'

// Import Salarium collections
import { FlowTemplates } from './collections/FlowTemplates'
import { FlowInstances } from './collections/FlowInstances'
import { Organizations } from './collections/Organizations'
import { JobFamilies } from './collections/JobFamilies'
import { Departments } from './collections/Departments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
      // Add language switcher to the navigation sidebar
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
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    // Add new collections
    TeamMembers,
    Testimonials,
    Features,
    PricingPlans,
    ExportTransactions,
    Companies,
    Routes,
    SmartContracts,
    AIProviders,
    // Salarium collections
    FlowTemplates,
    FlowInstances,
    Organizations,
    JobFamilies,
    Departments,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, es },
    // Core translations for admin UI and system messages
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
          welcome: 'Welcome to IntelliTrade CMS',
          intellitrade: {
            productName: 'IntelliTrade',
            features: 'Key Features',
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
          welcome: 'Bienvenido al CMS de IntelliTrade',
          intellitrade: {
            productName: 'IntelliTrade',
            features: 'Características Principales',
          },
        },
      },
    },
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
