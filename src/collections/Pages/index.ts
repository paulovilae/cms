import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

// Import new blocks
import { ParallaxHero } from '@/blocks/ParallaxHero/config'
import { AnimatedTimeline } from '@/blocks/AnimatedTimeline/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { StatCounter } from '@/blocks/StatCounter/config'
import { FloatingCTA } from '@/blocks/FloatingCTA/config'
import { SmartContractDemo } from '@/blocks/SmartContractDemo/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: {
      en: 'Page',
      es: 'Página',
    },
    plural: {
      en: 'Pages',
      es: 'Páginas',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: {
      en: 'Content',
      es: 'Contenido',
    },
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: {
        en: 'Title',
        es: 'Título',
      },
      admin: {
        placeholder: {
          en: 'Enter page title',
          es: 'Ingrese título de la página',
        },
      },
    },
    {
      name: 'pageType',
      type: 'select',
      label: {
        en: 'Page Type',
        es: 'Tipo de Página',
      },
      options: [
        {
          label: {
            en: 'Standard Page',
            es: 'Página Estándar',
          },
          value: 'standard',
        },
        {
          label: {
            en: 'Landing Page',
            es: 'Página de Aterrizaje',
          },
          value: 'landing',
        },
        {
          label: {
            en: 'Product Page',
            es: 'Página de Producto',
          },
          value: 'product',
        },
        {
          label: {
            en: 'Case Study',
            es: 'Caso de Estudio',
          },
          value: 'caseStudy',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: {
            en: 'Hero',
            es: 'Héroe',
          },
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: {
                en: 'Layout',
                es: 'Diseño',
              },
              blocks: [
                // Existing blocks
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                // New blocks for marketing site
                ParallaxHero,
                AnimatedTimeline,
                FeatureGrid,
                StatCounter,
                FloatingCTA,
                // Interactive demo block
                SmartContractDemo,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: {
            en: 'Content',
            es: 'Contenido',
          },
        },
        {
          name: 'meta',
          label: {
            en: 'SEO',
            es: 'SEO',
          },
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: {
        en: 'Published At',
        es: 'Fecha de Publicación',
      },
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
