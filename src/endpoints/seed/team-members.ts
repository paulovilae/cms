// Sample team members based on IntelliTrade product information
export const teamMembers = [
  {
    name: 'Elena Rodriguez',
    position: 'CEO & Founder',
    // Simple data without richText structure since it will be handled in the index
    department: 'leadership' as const,
    order: 1,
    socialLinks: [
      {
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/in/elenarodriguez',
      },
      {
        platform: 'twitter' as const,
        url: 'https://twitter.com/elenarodriguez',
      },
    ],
  },
  {
    name: 'Carlos Mendez',
    position: 'CTO',
    // Simple data without richText structure since it will be handled in the index
    department: 'leadership' as const,
    order: 2,
    socialLinks: [
      {
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/in/carlosmendez',
      },
      {
        platform: 'github' as const,
        url: 'https://github.com/carlosmendez',
      },
    ],
  },
  {
    name: 'Maria Santos',
    position: 'Head of Oracle Systems',
    // Simple data without richText structure since it will be handled in the index
    department: 'engineering' as const,
    order: 3,
    socialLinks: [
      {
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/in/mariasantos',
      },
    ],
  },
  {
    name: 'Juan Perez',
    position: 'Chief Compliance Officer',
    // Simple data without richText structure since it will be handled in the index
    department: 'operations' as const,
    order: 4,
    socialLinks: [
      {
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/in/juanperez',
      },
    ],
  },
  {
    name: 'Gabriela Fuentes',
    position: 'Product Manager',
    // Simple data without richText structure since it will be handled in the index
    department: 'product' as const,
    order: 5,
    socialLinks: [
      {
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/in/gabrielafuentes',
      },
      {
        platform: 'website' as const,
        url: 'https://gabrielafuentes.com',
      },
    ],
  },
]
