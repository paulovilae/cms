import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '@/payload-types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const getTestimonialTypeColor = (type: string) => {
    switch (type) {
      case 'exporter':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'importer':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'partner':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTestimonialTypeLabel = (type: string) => {
    switch (type) {
      case 'exporter':
        return 'Exporter'
      case 'importer':
        return 'Importer'
      case 'partner':
        return 'Partner'
      default:
        return type
    }
  }

  const renderStars = (rating: string) => {
    const numRating = parseInt(rating)
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <Card
      className={`hover:shadow-lg transition-shadow h-full ${testimonial.featured ? 'ring-2 ring-blue-500' : ''}`}
    >
      {testimonial.featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">Featured</Badge>
        </div>
      )}

      <CardHeader className="relative">
        <Quote className="w-8 h-8 text-gray-300 absolute top-4 right-4" />

        <div className="flex items-start space-x-4">
          {testimonial.photo && typeof testimonial.photo === 'object' && (
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={testimonial.photo.url || ''}
                alt={testimonial.photo.alt || testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{testimonial.name}</h3>
            <p className="text-sm text-gray-600 truncate">{testimonial.position}</p>
            <p className="text-sm text-gray-500 truncate">{testimonial.company}</p>

            <div className="flex items-center justify-between mt-2">
              {renderStars(testimonial.rating)}
              {testimonial.testimonialType && (
                <Badge
                  variant="outline"
                  className={`text-xs ${getTestimonialTypeColor(testimonial.testimonialType)}`}
                >
                  {getTestimonialTypeLabel(testimonial.testimonialType)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <blockquote className="text-gray-700 italic leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </CardContent>
    </Card>
  )
}
