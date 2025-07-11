import { Block } from 'payload'
import React from 'react'

// Import will be created later
// This is a temporary placeholder until we create the component
const AutoCascadeBlockComponent: React.FC<any> = () => null

/**
 * AutoCascadeBlock Definition
 *
 * This block allows embedding the document generation functionality
 * in any content model using Payload's block system.
 */
export const AutoCascadeBlock: Block = {
  slug: 'auto-cascade',
  labels: {
    singular: 'Auto Cascade Document',
    plural: 'Auto Cascade Documents',
  },
  fields: [
    {
      name: 'documentId',
      type: 'relationship',
      relationTo: 'flow-documents',
      label: 'Document',
      required: false,
      admin: {
        description: 'Link to an existing document or leave empty to create a new one',
      },
    },
    {
      name: 'initialTitle',
      type: 'text',
      label: 'Initial Title',
      admin: {
        description: 'Title for a new document (ignored if document is selected)',
        condition: (_: any, siblingData: { documentId?: string }) => !siblingData.documentId,
      },
    },
    {
      name: 'readOnly',
      type: 'checkbox',
      label: 'Read Only',
      defaultValue: false,
    },
    {
      name: 'embedded',
      type: 'checkbox',
      label: 'Embedded Mode',
      defaultValue: true,
      admin: {
        description: 'Show in embedded mode with reduced controls',
      },
    },
  ],
}

export default AutoCascadeBlock
