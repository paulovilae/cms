'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

type StatItem = {
  label: string
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  color?: string
}

type StatCounterProps = {
  heading?: string
  description?: string
  layout?: 'row' | 'grid'
  stats?: StatItem[]
  backgroundColor?: 'light' | 'dark' | 'brand'
}

export const StatCounter: React.FC<StatCounterProps> = (props) => {
  const { heading, description, layout = 'row', stats = [], backgroundColor = 'light' } = props

  const statsRef = useRef<(HTMLDivElement | null)[]>([])
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0))
  const animationRef = useRef<boolean>(false)

  // Set up counter animation using intersection observer
  useEffect(() => {
    if (!stats.length || animationRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry && firstEntry.isIntersecting && !animationRef.current) {
          animationRef.current = true

          // Start animation for each stat
          stats.forEach((stat, index) => {
            const duration = stat.duration || 2 // Default to 2 seconds
            const targetValue = stat.value
            const startTime = Date.now()

            const animate = () => {
              const currentTime = Date.now()
              const elapsedTime = (currentTime - startTime) / 1000 // convert to seconds

              if (elapsedTime < duration) {
                // Calculate the current value based on elapsed time
                const newValue = Math.floor((elapsedTime / duration) * targetValue)

                setAnimatedValues((prev) => {
                  const updated = [...prev]
                  updated[index] = newValue
                  return updated
                })

                requestAnimationFrame(animate)
              } else {
                // Animation complete
                setAnimatedValues((prev) => {
                  const updated = [...prev]
                  updated[index] = targetValue
                  return updated
                })
              }
            }

            requestAnimationFrame(animate)
          })
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (statsRef.current[0]) {
      observer.observe(statsRef.current[0])
    }

    return () => observer.disconnect()
  }, [stats])

  // Set refs array size
  useEffect(() => {
    statsRef.current = statsRef.current.slice(0, stats.length)
  }, [stats])

  if (!stats || stats.length === 0) return null

  // Background styles
  const bgClasses =
    backgroundColor === 'dark'
      ? 'bg-gray-900 text-white'
      : backgroundColor === 'brand'
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-900'

  return (
    <div className={cn('py-16', bgClasses)}>
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {description && (
          <p className="text-lg mb-12 text-center max-w-3xl mx-auto">{description}</p>
        )}

        <div
          className={cn(
            layout === 'row'
              ? 'flex flex-wrap justify-center items-center gap-8 md:gap-16'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
          )}
        >
          {stats.map((stat, index) => {
            // Set up the ref callback for this stat
            const setStatRef = (el: HTMLDivElement | null) => {
              statsRef.current[index] = el
            }

            // Text color based on provided color or background
            const textColorClass = stat.color
              ? '' // If custom color is provided, use inline style
              : backgroundColor === 'dark'
                ? 'text-white'
                : backgroundColor === 'brand'
                  ? 'text-white'
                  : 'text-gray-900'

            return (
              <div
                key={index}
                ref={setStatRef}
                className={cn('text-center p-6', layout === 'row' ? 'flex-1 min-w-[200px]' : '')}
              >
                <div
                  className={cn('text-4xl md:text-5xl font-bold mb-2', textColorClass)}
                  style={stat.color ? { color: stat.color } : undefined}
                >
                  {stat.prefix || ''}
                  {animatedValues[index].toLocaleString()}
                  {stat.suffix || ''}
                </div>
                <div
                  className={cn(
                    'text-xl',
                    backgroundColor === 'dark'
                      ? 'text-gray-300'
                      : backgroundColor === 'brand'
                        ? 'text-blue-100'
                        : 'text-gray-600',
                  )}
                >
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
