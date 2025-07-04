'use client'

import React, { useEffect, useRef } from 'react'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface TimelineStep {
  title: string
  description?: string
  icon?: any // Media resource type
  image?: any // Media resource type
  highlightColor?: string
}

interface AnimatedTimelineProps {
  heading?: string
  description?: string
  orientation?: 'vertical' | 'horizontal'
  steps: TimelineStep[]
  animationSpeed?: 'slow' | 'medium' | 'fast'
  showProgress?: boolean
}

export const AnimatedTimeline: React.FC<AnimatedTimelineProps> = (props) => {
  const { heading, description, orientation, steps, animationSpeed, showProgress } = props

  const timelineRef = useRef<HTMLDivElement>(null)
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([])

  // Set up Intersection Observer for scroll-based animations
  useEffect(() => {
    if (!stepsRefs.current.length) return

    const animationDuration =
      animationSpeed === 'slow' ? '1s' : animationSpeed === 'fast' ? '0.3s' : '0.6s'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-4')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      },
    )

    stepsRefs.current.forEach((step, index) => {
      if (step) {
        step.style.transitionDelay = `${index * 0.15}s`
        step.style.transitionDuration = animationDuration
        observer.observe(step)
      }
    })

    return () => {
      stepsRefs.current.forEach((step) => {
        if (step) observer.unobserve(step)
      })
    }
  }, [steps, animationSpeed])

  // Track progress bar as user scrolls
  useEffect(() => {
    if (!showProgress || !timelineRef.current) return

    const handleScroll = () => {
      if (!timelineRef.current) return

      const timeline = timelineRef.current
      const rect = timeline.getBoundingClientRect()

      // Calculate how much of the timeline is visible
      const timelineHeight = rect.height
      const timelineTop = rect.top
      const timelineBottom = rect.bottom
      const windowHeight = window.innerHeight

      let progress = 0

      if (timelineTop < windowHeight && timelineBottom > 0) {
        const visibleTop = Math.max(0, timelineTop)
        const visibleBottom = Math.min(windowHeight, timelineBottom)
        const visibleHeight = visibleBottom - visibleTop

        progress = (visibleHeight / timelineHeight) * 100
      } else if (timelineBottom <= 0) {
        progress = 100
      }

      // Update the progress line
      const progressLine = timeline.querySelector('.timeline-progress')
      if (progressLine) {
        if (orientation === 'vertical') {
          ;(progressLine as HTMLElement).style.height = `${progress}%`
        } else {
          ;(progressLine as HTMLElement).style.width = `${progress}%`
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [showProgress, orientation])

  if (!steps || steps.length === 0) return null

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {description && (
          <p className="text-lg mb-12 text-center max-w-3xl mx-auto">{description}</p>
        )}

        <div
          ref={timelineRef}
          className={cn(
            'relative',
            orientation === 'vertical'
              ? 'flex flex-col space-y-12 pl-8'
              : 'flex flex-col md:flex-row md:space-x-8',
          )}
        >
          {/* Progress Line */}
          {showProgress && (
            <div
              className={cn(
                'absolute bg-gray-200',
                orientation === 'vertical'
                  ? 'w-1 h-full left-0 top-0'
                  : 'h-1 w-full top-4 left-0 hidden md:block',
              )}
            >
              <div
                className={cn(
                  'timeline-progress bg-blue-600 transition-all',
                  orientation === 'vertical' ? 'w-full h-0' : 'h-full w-0',
                )}
              ></div>
            </div>
          )}

          {/* Timeline Steps */}
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                stepsRefs.current[index] = el
              }}
              className={cn(
                'transition-all transform opacity-0 translate-y-4',
                orientation === 'vertical' ? 'relative' : 'flex-1',
              )}
              style={{ backgroundColor: step.highlightColor }}
            >
              {/* Step Number/Dot for Vertical */}
              {orientation === 'vertical' && (
                <div className="absolute -left-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                  {index + 1}
                </div>
              )}

              {/* Step Content */}
              <div
                className={cn(
                  'bg-white rounded-lg shadow-md p-6',
                  step.highlightColor ? 'border-l-4' : '',
                )}
              >
                {step.icon && (
                  <div className="mb-4">
                    <Media resource={step.icon} className="w-12 h-12" />
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                {step.description && <p className="text-muted-foreground">{step.description}</p>}

                {step.image && (
                  <div className="mt-4">
                    <Media resource={step.image} className="w-full rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
