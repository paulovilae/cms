'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Clock,
  Shield,
  Camera,
  Lock,
  Eye,
  ShoppingCart,
  FileText,
  CreditCard,
  FileSearch,
  Bell,
  Scale,
  Zap,
  TrendingUp,
} from 'lucide-react'
import KYCWorkflow from './KYCWorkflow'

export default function IntelliTradeFlowDemo() {
  const [showKYCWorkflow, setShowKYCWorkflow] = useState(false)

  if (showKYCWorkflow) {
    return <KYCWorkflow onBack={() => setShowKYCWorkflow(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
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
            Welcome to IntelliTrade Flow Demo
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience our blockchain-powered trade finance platform that reduces transaction time
            by 75% and costs by 40%. This interactive demo showcases real IntelliTrade capabilities
            with modular "Lego blocks" for each trade finance process.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Time Reduction</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Cost Savings</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;48h</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Transaction Processing</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Security Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Lego Block Cards - 2x5 Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 1. KYC/KYB Validation Block - FUNCTIONAL */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    KYC/KYB Validation
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      FUNCTIONAL
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Automated identity verification with OFAC, Sunbiz, and chamber validation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">OFAC lists validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Chamber of commerce verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Audited financials analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Reuseable "green tick" credentials</span>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowKYCWorkflow(true)}
              >
                Try KYC Validation
              </Button>
            </CardContent>
          </Card>

          {/* 2. Samples Evidence Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Samples Evidence</CardTitle>
                  <CardDescription>
                    Photo upload and technical sheet with blockchain immutability
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Photo upload with parameters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Electronic signature (click-to-sign)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">On-chain hash for immutability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Technical sheet management</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 3. Smart Escrow Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Smart Escrow</CardTitle>
                  <CardDescription>
                    Secure fund management with automated payment release
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Regulated custodian account</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Smart contract payment orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Oracle-triggered releases</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Multi-signature security</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 4. AI Oracle Validation Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>AI Oracle Validation</CardTitle>
                  <CardDescription>
                    Photo + GPS comparison with fixed parameters for quality assurance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">40cm distance validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">5000K light conditions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Pantone98 color matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">GPS location verification</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 5. Order Confirmation Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Order Confirmation</CardTitle>
                  <CardDescription>
                    Amazon-style transactional summary with verified identity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Amazon-style cart summary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">NFC Persona verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Checkbox contract validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Quantity and pricing management</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 6. Mini-Contracts Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Mini-Contracts</CardTitle>
                  <CardDescription>
                    Modular contract clauses with biometric signatures
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Smart-Escrow clauses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Quality Oracle terms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">GPS alerts integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Biometric digital signatures</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 7. Factoring Integration Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Factoring Integration</CardTitle>
                  <CardDescription>
                    85% advance payment with documentary deck for financial institutions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Documentary deck generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">85% advance payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Traffic light alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Financial institution dashboard</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 8. Document Traceability Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Document Traceability</CardTitle>
                  <CardDescription>
                    Watermarked data room with dual monetization model
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Watermarked PDF viewing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">No download, view-only access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Dual monetization (exporter + financial)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Access tracking and analytics</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 9. Real-time Alerts Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Real-time Alerts</CardTitle>
                  <CardDescription>
                    Webhook-driven alerts with traffic light scoring system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Logistics milestone alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">KYC expiry notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Traffic light risk scoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Bank premium adjustments</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* 10. Dispute Resolution Block */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Dispute Resolution</CardTitle>
                  <CardDescription>
                    Online dispute resolution with blockchain evidence
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">ODR (Online Dispute Resolution)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Blockchain evidence tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">PDF reports with hashes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Legally strong documentation</span>
                </div>
              </div>
              <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Don Hugo Process Timeline */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Don Hugo Complete Flow</CardTitle>
            <CardDescription className="text-center">
              See how IntelliTrade transforms traditional trade finance workflows with modular Lego
              blocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Prospecting & Samples</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Initial contact and sample approval with blockchain evidence
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">2 days</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-300">2</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">KYC & Pre-validation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Identity verification and capacity validation
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">24 hours</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">3</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Order & Contract</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Order confirmation and mini-contract creation
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">4 hours</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">4</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Production & Factoring</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Manufacturing and liquidity advance request
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">48 hours</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">5</span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Logistics & Oracle</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Shipment tracking with AI validation
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Zap className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Real-time</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">Payment & Settlement</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Automated payment release and settlement
                </p>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
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
                Ready to Transform Your Trade Finance?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join exporters and importers already using IntelliTrade to streamline their trade
                finance workflows and reduce costs by up to 40% with blockchain-powered automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
