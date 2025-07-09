import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Feature } from '@/payload-types'

interface FeatureCardProps {
  feature: Feature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'escrow':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'blockchain':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'oracle':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'kyc':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'payments':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'exporter':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'importer':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'both':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'escrow':
        return 'Smart Escrow'
      case 'blockchain':
        return 'Blockchain'
      case 'oracle':
        return 'Oracle Verification'
      case 'kyc':
        return 'KYC/KYB'
      case 'payments':
        return 'Payments'
      default:
        return category
    }
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'exporter':
        return 'For Exporters'
      case 'importer':
        return 'For Importers'
      case 'both':
        return 'For All Users'
      default:
        return userType
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          {feature.icon && typeof feature.icon === 'object' && (
            <div className="w-12 h-12 flex-shrink-0">
              <img
                src={feature.icon.url || ''}
                alt={feature.icon.alt || feature.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 ml-auto">
            <Badge className={getCategoryColor(feature.category)}>
              {getCategoryLabel(feature.category)}
            </Badge>
            <Badge variant="outline" className={getUserTypeColor(feature.userType)}>
              {getUserTypeLabel(feature.userType)}
            </Badge>
          </div>
        </div>

        <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm mb-4">{feature.description}</p>

        {/* Screenshot Preview */}
        {feature.screenshot && typeof feature.screenshot === 'object' && (
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={feature.screenshot.url || ''}
              alt={feature.screenshot.alt || `${feature.title} screenshot`}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Long Description - Note: This is rich text, would need proper rendering */}
        {feature.longDescription && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">Additional details available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
