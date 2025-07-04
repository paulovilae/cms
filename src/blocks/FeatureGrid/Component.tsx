'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'

type Feature = {
  id: string | number
  title: string
  description: string
  icon?: any
  screenshot?: any
  category?: string
  userType?: string
  // other fields
}

type FeatureGridProps = {
  heading?: string
  description?: string
  layout?: '2col' | '3col' | '4col'
  features?: Feature[]
  showNumbers?: boolean
  animated?: boolean
  backgroundColor?: 'light' | 'dark' | 'brand'
}

export const FeatureGrid: React.FC<FeatureGridProps> = (props) => {
  const {
    heading,
    description,
    layout = '3col',
    features = [],
    showNumbers = true,
    animated = true,
    backgroundColor = 'light',
  } = props

  const gridRef = useRef<HTMLDivElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])

  // Set up intersection observer for animations
  useEffect(() => {
    if (!animated || !featureRefs.current.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-8')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      },
    )

    featureRefs.current.forEach((feature, index) => {
      if (feature) {
        feature.style.transitionDelay = `${index * 0.1}s`
        observer.observe(feature)
      }
    })

    return () => {
      featureRefs.current.forEach((feature) => {
        if (feature) observer.unobserve(feature)
      })
    }
  }, [animated, features])

  // Set refs array size
  useEffect(() => {
    featureRefs.current = featureRefs.current.slice(0, features.length)
  }, [features])

  if (!features || features.length === 0) return null

  // Determine grid columns based on layout
  const gridCols =
    layout === '2col'
      ? 'md:grid-cols-2'
      : layout === '4col'
        ? 'md:grid-cols-2 lg:grid-cols-4'
        : 'md:grid-cols-3'

  // Background styles
  const bgClasses =
    backgroundColor === 'dark'
      ? 'bg-gray-900 text-white'
      : backgroundColor === 'brand'
        ? 'bg-blue-600 text-white'
        : 'bg-background text-foreground'

  return (
    <div className={cn('py-16', bgClasses)}>
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {description && (
          <p className="text-lg mb-12 text-center max-w-3xl mx-auto">{description}</p>
        )}

        <div ref={gridRef} className={cn('grid grid-cols-1 gap-8', gridCols)}>
          {features.map((feature, index) => {
            // Set up the ref callback for this feature
            const setFeatureRef = (el: HTMLDivElement | null) => {
              featureRefs.current[index] = el
            }

            return (
              <div
                key={feature.id || index}
                ref={setFeatureRef}
                className={cn(
                  'p-6 rounded-lg shadow-md transition-all duration-500',
                  animated ? 'opacity-0 translate-y-8' : '',
                  backgroundColor === 'dark'
                    ? 'bg-gray-800'
                    : backgroundColor === 'brand'
                      ? 'bg-blue-700'
                      : 'bg-card',
                )}
              >
                <div className="flex items-start mb-4">
                  {showNumbers && (
                    <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-blue-600 text-white flex-shrink-0">
                      {index + 1}
                    </div>
                  )}
                  {feature.icon && (
                    <div className="w-12 h-12 mr-4 flex-shrink-0 relative overflow-hidden rounded-md bg-blue-100 flex items-center justify-center">
                      <Media resource={feature.icon} imgClassName="w-12 h-12 object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>

                <p
                  className={cn(
                    'mb-4',
                    backgroundColor === 'dark'
                      ? 'text-gray-300'
                      : backgroundColor === 'brand'
                        ? 'text-blue-100'
                        : 'text-muted-foreground',
                  )}
                >
                  {feature.description}
                </p>

                {feature.screenshot && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    {/* Render the actual screenshot media */}
                    <div className="w-full h-40 relative">
                      <Media
                        resource={feature.screenshot}
                        imgClassName="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
