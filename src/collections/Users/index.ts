import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'businessAccess',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'IntelliTrade',
          value: 'intellitrade',
        },
        {
          label: 'Salarium',
          value: 'salarium',
        },
        {
          label: 'Latinos',
          value: 'latinos',
        },
        {
          label: 'All Businesses',
          value: 'all',
        },
      ],
      defaultValue: ['all'],
      admin: {
        position: 'sidebar',
        description: 'Select which businesses this user can access',
      },
    },
  ],
  timestamps: true,
}
