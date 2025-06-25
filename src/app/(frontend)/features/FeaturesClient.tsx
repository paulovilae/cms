'use client'

import React, { useState } from 'react'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { FeatureGrid } from '@/blocks/FeatureGrid/Component'

type Feature = {
  id: string | number
  title: string
  description: string
  icon?: any
  screenshot?: any
  category?: string
  userType?: string
}

type Category = {
  id: string
  name: string
  description: string
  features: Feature[]
}

type FeaturesClientProps = {
  categoriesData: Category[]
}

export default function FeaturesClient({ categoriesData }: FeaturesClientProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border border-gray-200`}
          >
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border border-gray-200 border-l-0`}
          >
            Grid View
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-16">
          {categoriesData.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div
                className={cn(
                  'p-8',
                  category.id === 'kyc'
                    ? 'bg-blue-600 text-white'
                    : category.id === 'oracle'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900',
                )}
              >
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-lg">{category.description}</p>
              </div>

              <div className="divide-y divide-gray-200">
                {category.features.map((feature) => (
                  <div key={feature.id} className="p-6 flex items-start">
                    {feature.icon && (
                      <div className="w-12 h-12 mr-4 flex-shrink-0 relative overflow-hidden rounded-md bg-blue-100 flex items-center justify-center">
                        <Media resource={feature.icon} imgClassName="w-12 h-12 object-cover" />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>

                      {feature.screenshot && (
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <div className="w-full h-40 relative">
                            <Media
                              resource={feature.screenshot}
                              imgClassName="w-full h-40 object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="space-y-16">
          {categoriesData.map((category, index) => (
            <FeatureGrid
              key={category.id}
              heading={category.name}
              description={category.description}
              features={category.features}
              layout="3col"
              showNumbers={false}
              animated={true}
              backgroundColor={index % 3 === 0 ? 'light' : index % 3 === 1 ? 'dark' : 'brand'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
