import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import type { PricingPlan } from '@/payload-types'

interface PricingCardProps {
  plan: PricingPlan
  business: string
}

export function PricingCard({ plan, business }: PricingCardProps) {
  const [isYearly, setIsYearly] = useState(false)

  const getBusinessColor = () => {
    switch (business) {
      case 'intellitrade':
        return 'bg-blue-600 hover:bg-blue-700 border-blue-600'
      case 'salarium':
        return 'bg-violet-600 hover:bg-violet-700 border-violet-600'
      case 'latinos':
        return 'bg-orange-600 hover:bg-orange-700 border-orange-600'
      case 'capacita':
        return 'bg-green-600 hover:bg-green-700 border-green-600'
      default:
        return 'bg-gray-600 hover:bg-gray-700 border-gray-600'
    }
  }

  const getFeaturedBadgeColor = () => {
    switch (business) {
      case 'intellitrade':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'salarium':
        return 'bg-violet-100 text-violet-800 border-violet-200'
      case 'latinos':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'capacita':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const currentPrice = isYearly ? plan.priceYearly : plan.priceMonthly
  const billingPeriod = isYearly ? 'year' : 'month'
  const savings = isYearly ? plan.priceMonthly * 12 - plan.priceYearly : 0

  return (
    <Card
      className={`relative hover:shadow-lg transition-shadow ${plan.featured ? 'ring-2 ring-blue-500' : ''}`}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className={getFeaturedBadgeColor()}>Most Popular</Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        {plan.description && <p className="text-gray-600 mt-2">{plan.description}</p>}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              !isYearly ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isYearly ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">${currentPrice}</span>
            <span className="text-gray-600 ml-2">/{billingPeriod}</span>
          </div>

          {isYearly && savings > 0 && (
            <div className="mt-2">
              <Badge variant="destructive">Save ${savings}/year</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                  {feature.feature}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Plan Type Badge */}
        {plan.planType && (
          <div className="mb-4">
            <Badge variant="outline" className="capitalize">
              {plan.planType}
            </Badge>
          </div>
        )}

        {/* CTA Button */}
        <Button
          asChild
          className={`w-full ${plan.featured ? getBusinessColor() : ''}`}
          variant={plan.featured ? 'default' : 'outline'}
          size="lg"
        >
          <Link href={`/${business}?autoLogin=true`}>Get Started</Link>
        </Button>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 text-center mt-4">No setup fees • Cancel anytime</p>
      </CardContent>
    </Card>
  )
}
