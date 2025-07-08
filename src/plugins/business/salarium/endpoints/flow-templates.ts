import { PayloadRequest, Endpoint } from 'payload'

/**
 * Flow Templates API Endpoint for Salarium
 * Provides access to flow templates for the job flow interface
 */
export const flowTemplatesEndpoint: Endpoint = {
  path: '/salarium/flow-templates',
  method: 'get',
  handler: async (req: any) => {
    try {
      const { payload } = req

      // Get query parameters
      const url = new URL(req.url)
      const templateId = url.searchParams.get('id')
      const category = url.searchParams.get('category')
      const isActive = url.searchParams.get('active')

      // Build query conditions
      const where: any = {}

      if (templateId) {
        where.id = { equals: templateId }
      }

      if (category) {
        where.category = { equals: category }
      }

      if (isActive !== null) {
        where.isActive = { equals: isActive === 'true' }
      }

      // If requesting a specific template by ID, return single template
      if (templateId) {
        const template = await payload.findByID({
          collection: 'flow-templates',
          id: templateId,
          depth: 2, // Include related AI provider data
        })

        if (!template) {
          return Response.json({ success: false, error: 'Template not found' }, { status: 404 })
        }

        return Response.json({
          success: true,
          template: template,
        })
      }

      // Otherwise, return list of templates
      const templates = await payload.find({
        collection: 'flow-templates',
        where,
        depth: 1,
        limit: 50,
        sort: '-updatedAt',
      })

      return Response.json({
        success: true,
        templates: templates.docs,
        totalDocs: templates.totalDocs,
        page: templates.page,
        totalPages: templates.totalPages,
      })
    } catch (error) {
      console.error('Flow templates endpoint error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch templates',
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Flow Template by Slug Endpoint
 * Allows fetching templates by their slug for SEO-friendly URLs
 */
export const flowTemplateBySlugEndpoint: Endpoint = {
  path: '/salarium/flow-templates/slug/[slug]',
  method: 'get',
  handler: async (req: any) => {
    try {
      const { payload } = req
      const url = new URL(req.url)
      const slug = url.pathname.split('/').pop()

      if (!slug) {
        return Response.json(
          { success: false, error: 'Slug parameter is required' },
          { status: 400 },
        )
      }

      const templates = await payload.find({
        collection: 'flow-templates',
        where: {
          slug: { equals: slug },
          isActive: { equals: true },
        },
        depth: 2,
        limit: 1,
      })

      if (templates.docs.length === 0) {
        return Response.json({ success: false, error: 'Template not found' }, { status: 404 })
      }

      return Response.json({
        success: true,
        template: templates.docs[0],
      })
    } catch (error) {
      console.error('Flow template by slug endpoint error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch template',
        },
        { status: 500 },
      )
    }
  },
}

export default flowTemplatesEndpoint
