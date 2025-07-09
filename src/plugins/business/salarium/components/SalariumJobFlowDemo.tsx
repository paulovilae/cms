'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, FileText, Users, Zap, BarChart3 } from 'lucide-react'
import JobDescriptionWorkflow from './JobDescriptionWorkflow'

export default function SalariumJobFlowDemo() {
  const [showWorkflow, setShowWorkflow] = useState(false)

  if (showWorkflow) {
    return <JobDescriptionWorkflow />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Demo Status Badge */}
        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Live Demo Active
          </Badge>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Salarium Job Flow Demo
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience our AI-powered HR workflow system that reduces job description creation time
            by 85% and improves accuracy by 92%. This interactive demo showcases real Salarium
            capabilities.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600 mb-2">85%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Time Reduction</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600 mb-2">92%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy Improvement</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600 mb-2">15min</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Avg. Job Description Time
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600 mb-2">99%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Compliance Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* AI Job Description Generator - FUNCTIONAL */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle>AI Job Description Generator</CardTitle>
                  <CardDescription>
                    Create comprehensive job descriptions in minutes with AI assistance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Market-aligned skill requirements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Automated compliance checking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Industry-specific templates</span>
                </div>
              </div>
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={() => setShowWorkflow(true)}
              >
                Try Job Description Generator
              </Button>
            </CardContent>
          </Card>

          {/* Compensation Analysis - DEMO ONLY */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle>AI Compensation Analysis</CardTitle>
                  <CardDescription>
                    Real-time market data and competitive salary analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Market benchmarking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Pay equity analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Regional adjustments</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Document Workflow - DEMO ONLY */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle>Smart Document Workflows</CardTitle>
                  <CardDescription>
                    Automated approval processes and document management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Automated routing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Digital signatures</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Compliance tracking</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Team Analytics - DEMO ONLY */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle>Team Analytics & Insights</CardTitle>
                  <CardDescription>
                    Data-driven insights for better HR decision making
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Performance analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Retention predictions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Skills gap analysis</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Process Timeline */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Salarium HR Process Timeline</CardTitle>
            <CardDescription className="text-center">
              See how Salarium transforms traditional HR workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-violet-600 dark:text-violet-300">1</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Job Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI analyzes role requirements and market data
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">5 minutes</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-violet-600 dark:text-violet-300">2</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Content Generation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate comprehensive job descriptions
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">8 minutes</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-violet-600 dark:text-violet-300">3</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Review & Approval</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Automated workflow routing and approvals
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">2 minutes</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Publication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ready for posting and candidate sourcing
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Instant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your HR Processes?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join hundreds of companies already using Salarium to streamline their HR workflows
                and improve efficiency by up to 85%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
