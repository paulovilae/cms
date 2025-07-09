import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  FileText,
  Workflow,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { getBrandingForBusiness } from '@/utilities/branding'

export function SalariumHomepage() {
  const branding = getBrandingForBusiness('salarium')

  const features = [
    {
      icon: <Workflow className="w-8 h-8 text-violet-600" />,
      title: 'Smart Workflows',
      description: 'Automate HR document processes with AI-powered workflow templates.',
    },
    {
      icon: <FileText className="w-8 h-8 text-violet-600" />,
      title: 'Document Generation',
      description: 'Create professional HR documents with guided AI assistance.',
    },
    {
      icon: <Users className="w-8 h-8 text-violet-600" />,
      title: 'Team Management',
      description: 'Organize departments, job families, and organizational structures.',
    },
    {
      icon: <Clock className="w-8 h-8 text-violet-600" />,
      title: 'Time Efficiency',
      description: 'Reduce document creation time from hours to minutes.',
    },
    {
      icon: <Shield className="w-8 h-8 text-violet-600" />,
      title: 'Compliance Ready',
      description: 'Ensure all documents meet HR compliance standards.',
    },
    {
      icon: <Zap className="w-8 h-8 text-violet-600" />,
      title: 'AI-Powered',
      description: 'Leverage artificial intelligence for content generation.',
    },
  ]

  const useCases = [
    {
      title: 'Job Description Creation',
      description: 'Create comprehensive job descriptions with AI guidance',
      link: '/salarium/job-flow',
      badge: 'Live Demo',
    },
    {
      title: 'Employee Onboarding',
      description: 'Streamline new hire documentation and processes',
      link: '/demo/hr-workflows',
      badge: 'Coming Soon',
    },
    {
      title: 'Performance Reviews',
      description: 'Generate structured performance evaluation documents',
      link: '/demo/hr-workflows',
      badge: 'Coming Soon',
    },
    {
      title: 'Policy Documentation',
      description: 'Create and maintain HR policy documents',
      link: '/demo/hr-workflows',
      badge: 'Coming Soon',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-50 to-purple-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered HR Solutions
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{branding.tagline}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{branding.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700">
                <Link href="/salarium/job-flow">
                  Try Live Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/salarium/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful HR Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your HR document workflows and processes.
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

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">HR Workflow Solutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive suite of HR document workflow solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                    <Badge
                      variant={useCase.badge === 'Live Demo' ? 'default' : 'secondary'}
                      className={useCase.badge === 'Live Demo' ? 'bg-violet-600' : ''}
                    >
                      {useCase.badge}
                    </Badge>
                  </div>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant={useCase.badge === 'Live Demo' ? 'default' : 'outline'}
                    className={
                      useCase.badge === 'Live Demo' ? 'bg-violet-600 hover:bg-violet-700' : ''
                    }
                    disabled={useCase.badge === 'Coming Soon'}
                  >
                    <Link href={useCase.link}>
                      {useCase.badge === 'Live Demo' ? 'Try Now' : 'Learn More'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-violet-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your HR Workflows?
          </h2>
          <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
            Start creating professional HR documents with AI assistance today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/salarium/job-flow">
                Start Free Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-violet-600"
            >
              <Link href="/salarium/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
