"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationDocuments = void 0;
exports.VerificationDocuments = {
    slug: 'verification-documents',
    admin: {
        useAsTitle: 'documentId',
        group: 'KYC Management',
    },
    fields: [
        {
            name: 'documentId',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'application',
            type: 'relationship',
            relationTo: 'kyc-applications',
            required: true,
        },
        {
            name: 'documentType',
            type: 'select',
            options: [
                { label: 'Passport', value: 'passport' },
                { label: 'Driver License', value: 'driver_license' },
                { label: 'National ID', value: 'national_id' },
                { label: 'Utility Bill', value: 'utility_bill' },
                { label: 'Bank Statement', value: 'bank_statement' },
                { label: 'Business Registration', value: 'business_registration' },
                { label: 'Tax Document', value: 'tax_document' },
            ],
            required: true,
        },
        {
            name: 'file',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'metadata',
            type: 'json',
        },
        {
            name: 'verificationStatus',
            type: 'select',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Verified', value: 'verified' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Expired', value: 'expired' },
            ],
            defaultValue: 'pending',
        },
        {
            name: 'verifiedAt',
            type: 'date',
        },
        {
            name: 'verifiedBy',
            type: 'relationship',
            relationTo: 'users',
        },
        {
            name: 'notes',
            type: 'textarea',
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, operation }) => {
                if (operation === 'create') {
                    // Generate unique document ID
                    data.documentId = `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                }
                return data;
            },
        ],
    },
};
