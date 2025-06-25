'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

interface CTAProps {
  text?: string
  link?: string
}

interface ParallaxHeroProps {
  heading?: string
  subheading?: string
  backgroundType?: 'image' | 'video' | 'color'
  backgroundImage?: any // Media resource type
  backgroundVideo?: any // Media resource type
  backgroundColor?: string
  foregroundImage?: any // Media resource type
  parallaxSpeed?: 'slow' | 'medium' | 'fast'
  cta?: CTAProps
  height?: 'full' | 'large' | 'medium'
  textColor?: 'light' | 'dark'
  mouseParallax?: boolean
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = (props) => {
  const {
    heading,
    subheading,
    backgroundType,
    backgroundImage,
    backgroundVideo,
    backgroundColor,
    foregroundImage,
    parallaxSpeed,
    cta,
    height,
    textColor,
    mouseParallax,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)

  // Simple parallax effect on scroll
  useEffect(() => {
    if (!mouseParallax) return

    const handleScroll = () => {
      if (backgroundRef.current && foregroundRef.current) {
        const scrollPosition = window.scrollY
        const speed = parallaxSpeed === 'slow' ? 0.1 : parallaxSpeed === 'fast' ? 0.3 : 0.2

        backgroundRef.current.style.transform = `translateY(${scrollPosition * speed * 0.5}px)`
        if (foregroundImage) {
          foregroundRef.current.style.transform = `translateY(${scrollPosition * -speed}px)`
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallaxSpeed, mouseParallax, foregroundImage])

  // Mouse movement parallax effect
  useEffect(() => {
    if (!mouseParallax) return

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && backgroundRef.current && foregroundRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2

        const moveX = mouseX * 0.01
        const moveY = mouseY * 0.01

        backgroundRef.current.style.transform = `translate(${-moveX}px, ${-moveY}px)`
        if (foregroundImage) {
          foregroundRef.current.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px)`
        }
      }
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [mouseParallax, foregroundImage])

  const heightClass =
    height === 'full' ? 'min-h-screen' : height === 'large' ? 'min-h-[80vh]' : 'min-h-[50vh]'

  const backgroundStyles: React.CSSProperties = {}
  if (backgroundType === 'color' && backgroundColor) {
    backgroundStyles.backgroundColor = backgroundColor
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', heightClass)}
      style={backgroundStyles}
    >
      {/* Background Layer */}
      <div ref={backgroundRef} className="absolute inset-0 z-0">
        {backgroundType === 'image' && backgroundImage && (
          <Media
            resource={backgroundImage}
            className="object-cover w-full h-full"
            imgClassName="object-cover w-full h-full"
          />
        )}
        {backgroundType === 'video' && backgroundVideo && (
          <Media
            resource={backgroundVideo}
            className="object-cover w-full h-full"
            imgClassName="object-cover w-full h-full"
          />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-16">
        <div
          className={cn(
            'container mx-auto text-center',
            textColor === 'light' ? 'text-white' : 'text-gray-900',
          )}
        >
          {heading && (
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">{heading}</h1>
          )}
          {subheading && <p className="mx-auto mb-8 text-xl md:text-2xl max-w-3xl">{subheading}</p>}
          {cta && cta.text && cta.link && (
            <CMSLink
              className="inline-block px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              label={cta.text}
              url={cta.link}
            />
          )}
        </div>
      </div>

      {/* Foreground Layer */}
      {foregroundImage && (
        <div ref={foregroundRef} className="absolute z-20 pointer-events-none">
          <Media
            resource={foregroundImage}
            className="object-contain"
            imgClassName="object-contain"
          />
        </div>
      )}
    </div>
  )
}
