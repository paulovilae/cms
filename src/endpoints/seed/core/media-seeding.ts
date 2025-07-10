import type { Payload, File } from 'payload'
import { image1 } from '../image-1'
import { image2 } from '../image-2'
import { imageHero1 } from '../image-hero-1'

export const seedMediaAndUsers = async (
  payload: Payload,
): Promise<{
  demoAuthor: any
  image1Doc: any
  image2Doc: any
  image3Doc: any
  imageHomeDoc: any
}> => {
  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
  ])

  return {
    demoAuthor,
    image1Doc,
    image2Doc,
    image3Doc,
    imageHomeDoc,
  }
}

export const seedCategories = async (payload: Payload): Promise<void> => {
  payload.logger.info(`— Seeding categories...`)

  const categories = [
    { title: 'Technology', url: '/technology' },
    { title: 'News', url: '/news' },
    { title: 'Finance', url: '/finance' },
    { title: 'Design', url: '/design' },
    { title: 'Software', url: '/software' },
    { title: 'Engineering', url: '/engineering' },
  ]

  await Promise.all(
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category.title,
          breadcrumbs: [
            {
              label: category.title,
              url: category.url,
            },
          ],
        },
      }),
    ),
  )
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
