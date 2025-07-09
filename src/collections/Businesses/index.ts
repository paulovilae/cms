import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const Businesses: CollectionConfig = {
  slug: 'businesses',
  labels: {
    singular: {
      en: 'Business',
      es: 'Negocio',
    },
    plural: {
      en: 'Businesses',
      es: 'Negocios',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access for business configuration
    update: authenticated,
  },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'slug', 'isActive', 'updatedAt'],
    group: {
      en: 'Configuration',
      es: 'Configuración',
    },
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: {
        en: 'Display Name',
        es: 'Nombre de Visualización',
      },
      admin: {
        placeholder: {
          en: 'e.g., IntelliTrade',
          es: 'ej., IntelliTrade',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: {
        en: 'Description',
        es: 'Descripción',
      },
      admin: {
        placeholder: {
          en: 'Brief description of the business',
          es: 'Breve descripción del negocio',
        },
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      label: {
        en: 'Tagline',
        es: 'Eslogan',
      },
      admin: {
        placeholder: {
          en: 'e.g., Revolutionizing Trade Finance',
          es: 'ej., Revolucionando las Finanzas Comerciales',
        },
      },
    },
    {
      name: 'badge',
      type: 'text',
      required: true,
      label: {
        en: 'Badge Text',
        es: 'Texto de Insignia',
      },
      admin: {
        placeholder: {
          en: 'e.g., Blockchain-Powered Trade Finance',
          es: 'ej., Finanzas Comerciales Impulsadas por Blockchain',
        },
      },
    },
    {
      name: 'colors',
      type: 'group',
      label: {
        en: 'Brand Colors',
        es: 'Colores de Marca',
      },
      fields: [
        {
          name: 'primary',
          type: 'text',
          required: true,
          label: {
            en: 'Primary Color',
            es: 'Color Primario',
          },
          admin: {
            placeholder: '#2563eb',
            description: {
              en: 'Hex color code for primary brand color',
              es: 'Código de color hex para el color primario de la marca',
            },
          },
        },
        {
          name: 'secondary',
          type: 'text',
          required: true,
          label: {
            en: 'Secondary Color',
            es: 'Color Secundario',
          },
          admin: {
            placeholder: '#64748b',
          },
        },
        {
          name: 'accent',
          type: 'text',
          required: true,
          label: {
            en: 'Accent Color',
            es: 'Color de Acento',
          },
          admin: {
            placeholder: '#059669',
          },
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: {
        en: 'Contact Information',
        es: 'Información de Contacto',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          label: {
            en: 'Contact Email',
            es: 'Email de Contacto',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: {
            en: 'Phone Number',
            es: 'Número de Teléfono',
          },
        },
        {
          name: 'address',
          type: 'text',
          label: {
            en: 'Address',
            es: 'Dirección',
          },
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: {
        en: 'Social Media',
        es: 'Redes Sociales',
      },
      fields: [
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter',
          admin: {
            placeholder: '@businessname',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn',
          admin: {
            placeholder: 'company/businessname',
          },
        },
        {
          name: 'github',
          type: 'text',
          label: 'GitHub',
          admin: {
            placeholder: 'businessname',
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'group',
      label: {
        en: 'Feature Flags',
        es: 'Banderas de Características',
      },
      fields: [
        {
          name: 'hasMarketingPages',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Has Marketing Pages',
            es: 'Tiene Páginas de Marketing',
          },
        },
        {
          name: 'hasDemo',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Has Demo',
            es: 'Tiene Demo',
          },
        },
        {
          name: 'hasAuth',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Has Authentication',
            es: 'Tiene Autenticación',
          },
        },
        {
          name: 'hasBlog',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Has Blog',
            es: 'Tiene Blog',
          },
        },
      ],
    },
    {
      name: 'demoUrl',
      type: 'text',
      label: {
        en: 'Demo URL',
        es: 'URL de Demo',
      },
      admin: {
        placeholder: {
          en: 'e.g., /salarium/job-flow?autoLogin=true',
          es: 'ej., /salarium/job-flow?autoLogin=true',
        },
        description: {
          en: 'URL for the Try Demo button',
          es: 'URL para el botón Probar Demo',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Is Active',
        es: 'Está Activo',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Whether this business is currently active',
          es: 'Si este negocio está actualmente activo',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      label: {
        en: 'Display Order',
        es: 'Orden de Visualización',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Order for displaying businesses (lower numbers first)',
          es: 'Orden para mostrar negocios (números menores primero)',
        },
      },
    },
    ...slugField(),
  ],
}
