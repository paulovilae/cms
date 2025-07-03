/**
 * Helper functions for fetching files and resources for seeding
 */

import fetch from 'node-fetch'

/**
 * Fetch a file from a URL and return it as a Buffer
 */
export async function fetchFileByURL(url) {
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

export default {
  fetchFileByURL,
}
