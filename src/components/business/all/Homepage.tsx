import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Bot, Globe, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import { getCurrentBranding } from '@/utilities/branding'

export function MultiTenantHomepage() {
  const branding = getCurrentBranding()

  const businesses = [
    {
      name: 'IntelliTrade',
      description: 'Blockchain-powered trade finance solutions',
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      color: 'blue',
      link: '/?business=intellitrade',
      features: ['Smart Escrow', 'Oracle Verification', 'Global Trade'],
    },
    {
      name: 'Salarium',
      description: 'AI-powered HR document workflows',
      icon: <Users className="w-12 h-12 text-violet-600" />,
      color: 'violet',
      link: '/?business=salarium',
      features: ['Smart Workflows', 'Document Generation', 'Team Management'],
    },
    {
      name: 'Latinos',
      description: 'Automated trading platform with intelligent bots',
      icon: <Bot className="w-12 h-12 text-orange-600" />,
      color: 'orange',
      link: '/?business=latinos',
      features: ['Trading Bots', 'Real-time Analytics', 'Strategy Builder'],
    },
  ]

  const platformFeatures = [
    {
      icon: <Building2 className="w-8 h-8 text-gray-600" />,
      title: 'Multi-Tenant Architecture',
      description: 'Single platform serving multiple independent business products.',
    },
    {
      icon: <Zap className="w-8 h-8 text-gray-600" />,
      title: 'Plugin-Based System',
      description: 'Modular architecture with runtime plugin loading and decoupling.',
    },
    {
      icon: <Shield className="w-8 h-8 text-gray-600" />,
      title: 'Secure & Scalable',
      description: 'Enterprise-grade security with independent database isolation.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-slate-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Multi-Tenant Business Platform
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{branding.tagline}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{branding.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gray-800 hover:bg-gray-900">
                <Link href="/businesses">
                  Explore Businesses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo/platform">Platform Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Business Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Business Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three independent business solutions powered by a single, flexible platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {businesses.map((business, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">{business.icon}</div>
                  <CardTitle className="text-2xl">{business.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {business.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {business.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full bg-${business.color}-600 mr-2`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={business.link}>
                      Explore {business.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Architecture</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on modern architecture principles for scalability and maintainability.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
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
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Our Platform?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover how our multi-tenant architecture can power your business solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/demo/platform">
                Platform Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-800"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
