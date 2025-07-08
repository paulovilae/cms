import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  TrendingUp,
  Zap,
  BarChart3,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { getBrandingForBusiness } from '@/utilities/branding'

export function LatinosHomepage() {
  const branding = getBrandingForBusiness('latinos')

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-orange-600" />,
      title: 'Trading Bots',
      description: 'Automated trading with advanced algorithmic strategies.',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      title: 'Real-time Analytics',
      description: 'Live market data and performance tracking.',
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: 'Strategy Builder',
      description: 'Create custom trading strategies with visual tools.',
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      title: 'Fast Execution',
      description: 'Lightning-fast trade execution and order management.',
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      title: 'Risk Management',
      description: 'Advanced risk controls and portfolio protection.',
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: '24/7 Trading',
      description: 'Continuous market monitoring and trading.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-red-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Trading Platform
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{branding.tagline}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{branding.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/demo/trading-bots">
                  Try Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Trading Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for successful automated trading in the stock market.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Automate Your Trading?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Start trading with intelligent automation and advanced analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/demo/trading-bots">
                Start Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
