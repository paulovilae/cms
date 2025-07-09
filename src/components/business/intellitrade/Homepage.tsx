import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import { getBrandingForBusiness } from '@/utilities/branding'

export function IntelliTradeHomepage() {
  const branding = getBrandingForBusiness('intellitrade')

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'Smart Escrow',
      description: 'Secure multi-signature escrow with automated payment release.',
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: 'Global Trade',
      description: 'Streamline international trade finance across borders.',
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: 'Fast Processing',
      description: 'Reduce transaction time from weeks to under 48 hours.',
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: 'Cost Efficient',
      description: 'Lower transaction costs with blockchain technology.',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: 'Oracle Verification',
      description: 'Real-time verification through GPS and photo evidence.',
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      title: 'Compliance Ready',
      description: 'Built-in KYC/KYB and regulatory compliance.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Blockchain-Powered Trade Finance
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{branding.tagline}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{branding.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/intellitrade/trade-flow?autoLogin=true">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Revolutionary Trade Finance</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform international trade with blockchain technology and smart contracts.
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
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Trade Finance?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the future of international trade with blockchain-powered solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/intellitrade/trade-flow?autoLogin=true">
                Start Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
