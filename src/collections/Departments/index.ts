import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const Departments: CollectionConfig = {
  slug: 'departments',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated, // Only authenticated users can see departments
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'organization', 'parentDepartment', 'headcount', 'updatedAt'],
    group: 'Salarium',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Department name (e.g., "Engineering", "Human Resources")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Department description and purpose',
      },
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
      admin: {
        description: 'Organization this department belongs to',
      },
    },
    {
      name: 'parentDepartment',
      type: 'relationship',
      relationTo: 'departments',
      admin: {
        description: 'Parent department for hierarchical structure',
      },
    },
    {
      name: 'headOfDepartment',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Department head/manager',
      },
    },
    {
      name: 'departmentType',
      type: 'select',
      options: [
        { label: 'Core Business', value: 'core' },
        { label: 'Support', value: 'support' },
        { label: 'Administrative', value: 'administrative' },
        { label: 'Strategic', value: 'strategic' },
        { label: 'Operational', value: 'operational' },
      ],
      defaultValue: 'operational',
      admin: {
        description: 'Type of department',
      },
    },
    {
      name: 'budget',
      type: 'group',
      admin: {
        description: 'Department budget information',
      },
      fields: [
        {
          name: 'annualBudget',
          type: 'number',
          admin: {
            description: 'Annual budget in USD',
          },
        },
        {
          name: 'currency',
          type: 'select',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
            { label: 'CAD', value: 'CAD' },
            { label: 'AUD', value: 'AUD' },
            { label: 'BRL', value: 'BRL' },
            { label: 'MXN', value: 'MXN' },
            { label: 'COP', value: 'COP' },
          ],
          defaultValue: 'USD',
        },
        {
          name: 'budgetPeriod',
          type: 'select',
          options: [
            { label: 'Annual', value: 'annual' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Monthly', value: 'monthly' },
          ],
          defaultValue: 'annual',
        },
        {
          name: 'spentToDate',
          type: 'number',
          admin: {
            description: 'Amount spent in current period',
          },
        },
        {
          name: 'lastUpdated',
          type: 'date',
          admin: {
            description: 'When budget was last updated',
          },
        },
      ],
    },
    {
      name: 'headcount',
      type: 'group',
      admin: {
        description: 'Department staffing information',
      },
      fields: [
        {
          name: 'currentHeadcount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Current number of employees',
          },
        },
        {
          name: 'targetHeadcount',
          type: 'number',
          admin: {
            description: 'Target number of employees',
          },
        },
        {
          name: 'contractors',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of contractors/consultants',
          },
        },
        {
          name: 'openPositions',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of open positions',
          },
        },
        {
          name: 'breakdown',
          type: 'array',
          fields: [
            {
              name: 'level',
              type: 'select',
              options: [
                { label: 'Executive', value: 'executive' },
                { label: 'Senior Management', value: 'senior-management' },
                { label: 'Middle Management', value: 'middle-management' },
                { label: 'Senior', value: 'senior' },
                { label: 'Mid-Level', value: 'mid-level' },
                { label: 'Junior', value: 'junior' },
                { label: 'Intern', value: 'intern' },
              ],
              required: true,
            },
            {
              name: 'count',
              type: 'number',
              required: true,
            },
          ],
          admin: {
            description: 'Headcount breakdown by level',
          },
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      admin: {
        description: 'Department location information',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Physical Office', value: 'physical' },
            { label: 'Remote', value: 'remote' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'Distributed', value: 'distributed' },
          ],
          defaultValue: 'physical',
          required: true,
        },
        {
          name: 'primaryLocation',
          type: 'group',
          fields: [
            {
              name: 'country',
              type: 'text',
            },
            {
              name: 'state',
              type: 'text',
            },
            {
              name: 'city',
              type: 'text',
            },
            {
              name: 'address',
              type: 'textarea',
            },
            {
              name: 'floor',
              type: 'text',
            },
          ],
        },
        {
          name: 'additionalLocations',
          type: 'array',
          fields: [
            {
              name: 'country',
              type: 'text',
              required: true,
            },
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'headcount',
              type: 'number',
              admin: {
                description: 'Number of employees at this location',
              },
            },
          ],
          admin: {
            description: 'Additional office locations for this department',
          },
        },
      ],
    },
    {
      name: 'responsibilities',
      type: 'array',
      fields: [
        {
          name: 'responsibility',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Primary Function', value: 'primary' },
            { label: 'Secondary Function', value: 'secondary' },
            { label: 'Support Function', value: 'support' },
            { label: 'Compliance', value: 'compliance' },
            { label: 'Strategic', value: 'strategic' },
          ],
          defaultValue: 'primary',
          required: true,
        },
      ],
      admin: {
        description: 'Department responsibilities and scope',
      },
    },
    {
      name: 'jobFamilies',
      type: 'array',
      fields: [
        {
          name: 'jobFamily',
          type: 'relationship',
          relationTo: 'job-families',
          required: true,
        },
        {
          name: 'relevance',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Occasional', value: 'occasional' },
          ],
          defaultValue: 'primary',
          required: true,
        },
        {
          name: 'currentCount',
          type: 'number',
          admin: {
            description: 'Current number of employees in this job family',
          },
        },
        {
          name: 'targetCount',
          type: 'number',
          admin: {
            description: 'Target number of employees in this job family',
          },
        },
      ],
      admin: {
        description: 'Job families present in this department',
      },
    },
    {
      name: 'goals',
      type: 'array',
      fields: [
        {
          name: 'goal',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Annual', value: 'annual' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Project-based', value: 'project' },
            { label: 'Ongoing', value: 'ongoing' },
          ],
          defaultValue: 'annual',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Not Started', value: 'not-started' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'On Track', value: 'on-track' },
            { label: 'At Risk', value: 'at-risk' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          defaultValue: 'not-started',
          required: true,
        },
        {
          name: 'targetDate',
          type: 'date',
        },
        {
          name: 'progress',
          type: 'number',
          admin: {
            description: 'Progress percentage (0-100)',
          },
        },
      ],
      admin: {
        description: 'Department goals and objectives',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Additional department metadata',
      },
      fields: [
        {
          name: 'establishedDate',
          type: 'date',
          admin: {
            description: 'When the department was established',
          },
        },
        {
          name: 'costCenter',
          type: 'text',
          admin: {
            description: 'Cost center code for accounting',
          },
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Tags for categorizing and filtering',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this department currently active?',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Internal notes about this department',
          },
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from name if not provided
        if (data?.name && !data?.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        // Calculate total headcount from breakdown
        if (data?.headcount?.breakdown && Array.isArray(data.headcount.breakdown)) {
          const total = data.headcount.breakdown.reduce((sum, item) => sum + (item.count || 0), 0)
          if (!data.headcount.currentHeadcount) {
            data.headcount.currentHeadcount = total
          }
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log department changes for audit trail
        console.log(`Department ${operation}: ${doc.name} (${doc.slug})`)
      },
    ],
  },
}
