import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    singular: {
      en: 'Team Member',
      es: 'Miembro del Equipo',
    },
    plural: {
      en: 'Team Members',
      es: 'Miembros del Equipo',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'order', 'updatedAt'],
    group: {
      en: 'Content',
      es: 'Contenido',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        en: 'Name',
        es: 'Nombre',
      },
      admin: {
        placeholder: {
          en: 'Enter full name',
          es: 'Ingrese nombre completo',
        },
      },
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      label: {
        en: 'Position',
        es: 'Cargo',
      },
      admin: {
        placeholder: {
          en: 'Enter job position',
          es: 'Ingrese cargo laboral',
        },
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: {
        en: 'Photo',
        es: 'Fotografía',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      label: {
        en: 'Biography',
        es: 'Biografía',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures],
      }),
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: {
        en: 'Social Links',
        es: 'Redes Sociales',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: {
            en: 'Platform',
            es: 'Plataforma',
          },
          options: [
            {
              label: {
                en: 'LinkedIn',
                es: 'LinkedIn',
              },
              value: 'linkedin',
            },
            {
              label: {
                en: 'Twitter',
                es: 'Twitter',
              },
              value: 'twitter',
            },
            {
              label: {
                en: 'GitHub',
                es: 'GitHub',
              },
              value: 'github',
            },
            {
              label: {
                en: 'Website',
                es: 'Sitio Web',
              },
              value: 'website',
            },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: {
            en: 'URL',
            es: 'URL',
          },
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: {
        en: 'Order',
        es: 'Orden',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Display order (lower numbers appear first)',
          es: 'Orden de visualización (números menores aparecen primero)',
        },
      },
    },
    {
      name: 'department',
      type: 'select',
      label: {
        en: 'Department',
        es: 'Departamento',
      },
      options: [
        {
          label: {
            en: 'Leadership',
            es: 'Liderazgo',
          },
          value: 'leadership',
        },
        {
          label: {
            en: 'Engineering',
            es: 'Ingeniería',
          },
          value: 'engineering',
        },
        {
          label: {
            en: 'Product',
            es: 'Producto',
          },
          value: 'product',
        },
        {
          label: {
            en: 'Marketing',
            es: 'Marketing',
          },
          value: 'marketing',
        },
        {
          label: {
            en: 'Operations',
            es: 'Operaciones',
          },
          value: 'operations',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
}
