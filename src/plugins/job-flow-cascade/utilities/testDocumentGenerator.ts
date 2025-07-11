import { FlowDocument, DocumentSection, DocumentStatus, SectionType } from '../types'

/**
 * Test document generation utilities for development and testing
 */

export interface TestDocumentOptions {
  title?: string
  businessUnit?: string
  includeContent?: boolean
  sectionCount?: number
  status?: DocumentStatus
}

/**
 * Generate a test document with sample content
 */
export function generateTestDocument(options: TestDocumentOptions = {}): FlowDocument {
  const {
    title = 'Senior Software Engineer',
    businessUnit = 'salarium',
    status = DocumentStatus.DRAFT,
  } = options

  return {
    id: `test_doc_${Date.now()}`,
    title,
    status,
    businessUnit,
    metadata: {
      createdAt: new Date().toISOString(),
      version: 1,
      jobTitle: title,
      author: 'Test Generator',
      lastGenerated: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Generate test sections for a document
 */
export function generateTestSections(
  documentId: string,
  options: TestDocumentOptions = {},
): DocumentSection[] {
  const { includeContent = true } = options

  const sections: DocumentSection[] = [
    {
      id: `section_${Date.now()}_1`,
      documentId,
      title: 'Job Title & Overview',
      type: SectionType.INTRODUCTION,
      order: 0,
      content: includeContent ? generateSampleContent('introduction') : null,
      isCompleted: includeContent,
      isGenerated: includeContent,
      lastGeneratedAt: includeContent ? new Date().toISOString() : undefined,
    },
    {
      id: `section_${Date.now()}_2`,
      documentId,
      title: 'Job Summary',
      type: SectionType.SUMMARY,
      order: 1,
      content: includeContent ? generateSampleContent('summary') : null,
      isCompleted: includeContent,
      isGenerated: includeContent,
      lastGeneratedAt: includeContent ? new Date().toISOString() : undefined,
    },
    {
      id: `section_${Date.now()}_3`,
      documentId,
      title: 'Key Responsibilities',
      type: SectionType.RESPONSIBILITIES,
      order: 2,
      content: includeContent ? generateSampleContent('responsibilities') : null,
      isCompleted: includeContent,
      isGenerated: includeContent,
      lastGeneratedAt: includeContent ? new Date().toISOString() : undefined,
    },
    {
      id: `section_${Date.now()}_4`,
      documentId,
      title: 'Requirements',
      type: SectionType.REQUIREMENTS,
      order: 3,
      content: includeContent ? generateSampleContent('requirements') : null,
      isCompleted: includeContent,
      isGenerated: includeContent,
      lastGeneratedAt: includeContent ? new Date().toISOString() : undefined,
    },
    {
      id: `section_${Date.now()}_5`,
      documentId,
      title: 'Qualifications',
      type: SectionType.QUALIFICATIONS,
      order: 4,
      content: includeContent ? generateSampleContent('qualifications') : null,
      isCompleted: includeContent,
      isGenerated: includeContent,
      lastGeneratedAt: includeContent ? new Date().toISOString() : undefined,
    },
    {
      id: `section_${Date.now()}_6`,
      documentId,
      title: 'Benefits & Compensation',
      type: SectionType.BENEFITS,
      order: 5,
      content: includeContent ? generateSampleContent('benefits') : null,
      isCompleted: includeContent,
      isGenerated: includeContent,
      lastGeneratedAt: includeContent ? new Date().toISOString() : undefined,
    },
  ]

  return sections
}

/**
 * Generate sample content for different section types
 */
function generateSampleContent(sectionType: string): any {
  const sampleContent = {
    introduction: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'We are seeking a highly skilled Senior Software Engineer to join our dynamic development team. This role offers the opportunity to work on cutting-edge projects and contribute to innovative solutions that impact thousands of users.',
          },
        ],
      },
    ],
    summary: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'As a Senior Software Engineer, you will be responsible for designing, developing, and maintaining high-quality software applications. You will collaborate with cross-functional teams to deliver scalable solutions and mentor junior developers.',
          },
        ],
      },
    ],
    responsibilities: [
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Design and develop robust, scalable software applications',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Collaborate with product managers and designers to implement new features',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Conduct code reviews and provide technical guidance to team members',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Optimize application performance and ensure code quality',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Participate in architectural decisions and technical planning',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    requirements: [
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: '5+ years of experience in software development',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Proficiency in modern programming languages (JavaScript, TypeScript, Python, or Java)',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Experience with web frameworks (React, Node.js, Express)',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Strong understanding of database design and optimization',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Experience with cloud platforms (AWS, Azure, or GCP)',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    qualifications: [
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: "Bachelor's degree in Computer Science or related field",
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Strong problem-solving and analytical skills',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Excellent communication and teamwork abilities',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Experience with Agile development methodologies',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Passion for learning new technologies and best practices',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    benefits: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'We offer a comprehensive benefits package including:',
          },
        ],
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Competitive salary range: $120,000 - $160,000',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Health, dental, and vision insurance',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Flexible work arrangements and remote work options',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Professional development opportunities and conference attendance',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'Stock options and performance bonuses',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  return sampleContent[sectionType as keyof typeof sampleContent] || []
}

/**
 * Generate a complete test document with sections
 */
export function generateCompleteTestDocument(options: TestDocumentOptions = {}): {
  document: FlowDocument
  sections: DocumentSection[]
} {
  const document = generateTestDocument(options)
  const sections = generateTestSections(document.id, options)

  return { document, sections }
}

/**
 * Generate multiple test documents for testing
 */
export function generateMultipleTestDocuments(count: number = 3): Array<{
  document: FlowDocument
  sections: DocumentSection[]
}> {
  const documents = []
  const titles = [
    'Senior Software Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist',
    'DevOps Engineer',
    'Marketing Specialist',
  ]

  for (let i = 0; i < count; i++) {
    const title = titles[i % titles.length]
    const status = [DocumentStatus.DRAFT, DocumentStatus.IN_PROGRESS, DocumentStatus.COMPLETED][
      i % 3
    ]

    documents.push(
      generateCompleteTestDocument({
        title,
        status,
        includeContent: i % 2 === 0, // Alternate between with and without content
      }),
    )
  }

  return documents
}

/**
 * Create a test document with specific business context
 */
export function generateBusinessSpecificTestDocument(businessUnit: string): {
  document: FlowDocument
  sections: DocumentSection[]
} {
  const businessTitles = {
    salarium: 'HR Business Partner',
    intellitrade: 'Trade Finance Specialist',
    latinos: 'Quantitative Trader',
    capacita: 'Learning Experience Designer',
  }

  const title = businessTitles[businessUnit as keyof typeof businessTitles] || 'Specialist'

  return generateCompleteTestDocument({
    title,
    businessUnit,
    includeContent: true,
    status: DocumentStatus.DRAFT,
  })
}
