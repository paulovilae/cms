import { enTranslations } from '@payloadcms/translations/languages/en'
import type { NestedKeysStripped } from '@payloadcms/translations'

export const customTranslations = {
  en: {
    general: {
      dashboard: 'Dashboard',
      welcome: 'Welcome to IntelliTrade CMS',
    },
    custom: {
      intellitrade: {
        productName: 'IntelliTrade',
        tagline: 'Blockchain-Powered Trade Finance Platform',
        features: 'Key Features',
        pricing: 'Pricing Plans',
        about: 'About Us',
        contact: 'Contact',
        getStarted: 'Get Started',
      },
      platform: {
        escrow: 'Smart Escrow System',
        tokens: 'Dual Token Architecture',
        verification: 'Oracle Verification',
        documentation: 'KYC/KYB and Document Processing',
      },
    },
  },
  es: {
    general: {
      dashboard: 'Panel de Control',
      welcome: 'Bienvenido al CMS de IntelliTrade',
    },
    custom: {
      intellitrade: {
        productName: 'IntelliTrade',
        tagline: 'Plataforma de Financiamiento Comercial con Blockchain',
        features: 'Características Principales',
        pricing: 'Planes de Precios',
        about: 'Sobre Nosotros',
        contact: 'Contacto',
        getStarted: 'Comenzar',
      },
      platform: {
        escrow: 'Sistema de Depósito en Garantía Inteligente',
        tokens: 'Arquitectura de Doble Token',
        verification: 'Verificación Oracle',
        documentation: 'KYC/KYB y Procesamiento de Documentos',
      },
    },
  },
}

export type CustomTranslationsObject = typeof customTranslations.en & typeof enTranslations
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>
