import { BusinessSearchConfig } from '../../types/business-config.types'

/**
 * Salarium-specific search configuration
 * Optimized for HR and job description content with specialized fields and
 * AI customizations for HR terminology
 */
export const salariumSearchConfig: BusinessSearchConfig = {
  searchFields: [
    // Job information fields with high weights
    { name: 'title', weight: 2.5, boost: 'exact' },
    { name: 'requiredSkills', weight: 2.0, boost: 'fuzzy', type: 'array' },
    { name: 'jobDescription', weight: 1.8, type: 'richText' },

    // Organizational fields with medium weights
    { name: 'organization.name', weight: 1.5, type: 'relationship' },
    { name: 'department.name', weight: 1.5, type: 'relationship' },

    // Experience and compensation fields with lower weights
    { name: 'experienceLevel', weight: 1.2 },
    { name: 'compensationRange', weight: 1.0 },
    { name: 'location', weight: 1.0 },
    { name: 'employmentType', weight: 0.8 },
  ],

  filters: [
    // Organizational hierarchy filters
    {
      key: 'organization',
      label: 'Organization',
      type: 'relationship',
      relationTo: 'organizations',
      fieldPath: 'organization',
    },
    {
      key: 'department',
      label: 'Department',
      type: 'relationship',
      relationTo: 'departments',
      fieldPath: 'department',
      dependsOn: 'organization',
    },

    // Experience and skill filters
    {
      key: 'experienceLevel',
      label: 'Experience Level',
      type: 'select',
      options: [
        { label: 'Entry Level', value: 'entry' },
        { label: 'Mid Level', value: 'mid' },
        { label: 'Senior', value: 'senior' },
        { label: 'Executive', value: 'executive' },
      ],
      fieldPath: 'experienceLevel',
    },
    {
      key: 'requiredSkills',
      label: 'Required Skills',
      type: 'multiselect',
      options: 'dynamic',
      fieldPath: 'requiredSkills',
    },

    // Compensation range filter
    {
      key: 'compensationRange',
      label: 'Compensation Range',
      type: 'range',
      min: 0,
      max: 500000,
      step: 10000,
      unit: '$',
      fieldPath: 'compensationRange',
    },

    // Employment type filter
    {
      key: 'employmentType',
      label: 'Employment Type',
      type: 'select',
      options: [
        { label: 'Full-time', value: 'fulltime' },
        { label: 'Part-time', value: 'parttime' },
        { label: 'Contract', value: 'contract' },
        { label: 'Temporary', value: 'temporary' },
      ],
      fieldPath: 'employmentType',
    },

    // Status filter
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Filled', value: 'filled' },
        { label: 'Draft', value: 'draft' },
      ],
      fieldPath: 'status',
    },
  ],

  actions: [
    {
      id: 'view',
      label: 'View Job Description',
      icon: 'Eye',
      requiresSelection: true,
      handler: 'viewJobDescription',
      permission: ({ user }) => !!user,
    },
    {
      id: 'edit',
      label: 'Edit Job Description',
      icon: 'Edit',
      requiresSelection: true,
      handler: 'editJobDescription',
      permission: ({ user, item }) =>
        !!user && (user.role === 'admin' || user.id === item.createdBy),
    },
    {
      id: 'duplicate',
      label: 'Duplicate Job',
      icon: 'Copy',
      requiresSelection: true,
      handler: 'duplicateJob',
      permission: ({ user }) => !!user && (user.role === 'admin' || user.role === 'hr'),
    },
    {
      id: 'archive',
      label: 'Archive Job',
      icon: 'Archive',
      requiresSelection: true,
      handler: 'archiveJob',
      permission: ({ user, item }) =>
        !!user && (user.role === 'admin' || user.id === item.createdBy),
      dynamicLabel: (item) => (item.status === 'archived' ? 'Unarchive Job' : 'Archive Job'),
    },
  ],

  previewConfig: {
    layout: 'card',
    fields: [
      {
        key: 'title',
        label: 'Job Title',
        formatter: 'highlightMatch',
        typographyVariant: 'h3',
        highlightMatches: true,
      },
      {
        key: 'organization.name',
        label: 'Organization',
        formatter: 'relationship',
        typographyVariant: 'body1',
      },
      {
        key: 'department.name',
        label: 'Department',
        formatter: 'relationship',
        typographyVariant: 'body2',
      },
      {
        key: 'requiredSkills',
        label: 'Required Skills',
        formatter: 'tags',
        maxItems: 5,
        typographyVariant: 'body2',
      },
      {
        key: 'experienceLevel',
        label: 'Experience',
        formatter: 'badge',
        statusColors: {
          entry: 'green',
          mid: 'blue',
          senior: 'purple',
          executive: 'gold',
        },
      },
      {
        key: 'status',
        label: 'Status',
        formatter: 'badge',
        statusColors: {
          open: 'green',
          filled: 'blue',
          draft: 'gray',
          archived: 'red',
        },
      },
      {
        key: 'compensationRange',
        label: 'Compensation',
        formatter: 'currency',
        typographyVariant: 'body2',
      },
    ],
    thumbnail: {
      field: 'organization.logo',
      fallback: '/images/default-company-logo.png',
      width: 64,
      height: 64,
      alt: 'Organization Logo',
    },
  },

  aiPromptCustomizations: {
    systemPrompt:
      'You are an HR assistant helping to find job descriptions and organizational information. ' +
      'You understand HR terminology, job requirements, and organizational hierarchies.',

    queryEnhancement:
      'Given the user\'s search query "{query}" about job descriptions, expand this into a more comprehensive search. ' +
      'Consider skills, experience levels, and job titles that might be relevant. ' +
      'If abbreviations are used (like "Sr" for Senior), expand them.',

    contextData: {
      entityType: 'job description',
      terminology: {
        sr: 'senior',
        jr: 'junior',
        mgr: 'manager',
        dev: 'developer',
        eng: 'engineer',
        exp: 'experience',
        yr: 'year',
        ft: 'full-time',
        pt: 'part-time',
        ba: 'bachelor',
        bs: 'bachelor of science',
        ms: 'master of science',
        phd: 'doctorate',
      },
      experienceLevels: ['entry level', 'junior', 'mid-level', 'senior', 'principal', 'executive'],
      commonSkills: [
        'javascript',
        'typescript',
        'react',
        'node.js',
        'python',
        'java',
        'c#',
        'project management',
        'leadership',
        'communication',
      ],
    },

    suggestionPrompt:
      "Based on the user's job search for '{query}', suggest 3-5 related searches that might help them find relevant positions. " +
      'Consider alternative job titles, related skills, or different experience levels.',
  },
}
