'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  FileText,
  Upload,
  Download,
  Loader2,
} from 'lucide-react'

interface KYCWorkflowProps {
  onBack: () => void
}

interface CompanyBasicInfo {
  companyName: string
  businessType: 'exporter' | 'importer' | 'both' | ''
  registrationNumber: string
  taxId: string
  incorporationCountry: string
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contactPerson: {
    name: string
    title: string
    email: string
    phone: string
  }
}

interface FinancialInfo {
  annualRevenue: string
  employeeCount: string
  yearsInBusiness: string
  auditedFinancials: File | null
  bankReferences: Array<{
    bankName: string
    accountNumber: string
    contactPerson: string
    phone: string
  }>
}

interface ComplianceValidation {
  ofacCheck: {
    status: 'pending' | 'clear' | 'flagged'
    details: string
    lastChecked: Date | null
  }
  sunbizValidation: {
    status: 'pending' | 'verified' | 'failed'
    registrationDetails: any
    lastChecked: Date | null
  }
  chamberOfCommerce: {
    status: 'pending' | 'verified' | 'failed'
    membershipDetails: any
    lastChecked: Date | null
  }
}

interface VerificationResults {
  overallStatus: 'pending' | 'approved' | 'rejected' | 'requires-review'
  kycScore: number
  riskLevel: 'low' | 'medium' | 'high'
  verificationPackage: {
    packageId: string
    downloadUrl: string
    expiryDate: Date
    watermarkId: string
  } | null
  reuseableCredentials: {
    tickVerdeId: string
    validUntil: Date
    applicableRegions: string[]
  } | null
  recommendations: string[]
  nextSteps: string[]
}

export default function KYCWorkflow({ onBack }: KYCWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Form data states
  const [companyInfo, setCompanyInfo] = useState<CompanyBasicInfo>({
    companyName: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    incorporationCountry: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    contactPerson: {
      name: '',
      title: '',
      email: '',
      phone: '',
    },
  })

  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    annualRevenue: '',
    employeeCount: '',
    yearsInBusiness: '',
    auditedFinancials: null,
    bankReferences: [{ bankName: '', accountNumber: '', contactPerson: '', phone: '' }],
  })

  const [complianceValidation, setComplianceValidation] = useState<ComplianceValidation>({
    ofacCheck: {
      status: 'pending',
      details: '',
      lastChecked: null,
    },
    sunbizValidation: {
      status: 'pending',
      registrationDetails: null,
      lastChecked: null,
    },
    chamberOfCommerce: {
      status: 'pending',
      membershipDetails: null,
      lastChecked: null,
    },
  })

  const [verificationResults, setVerificationResults] = useState<VerificationResults>({
    overallStatus: 'pending',
    kycScore: 0,
    riskLevel: 'medium',
    verificationPackage: null,
    reuseableCredentials: null,
    recommendations: [],
    nextSteps: [],
  })

  const steps = [
    {
      id: 1,
      name: 'Company Info',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming',
    },
    {
      id: 2,
      name: 'Financial Data',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming',
    },
    {
      id: 3,
      name: 'Compliance',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming',
    },
    {
      id: 4,
      name: 'Documents',
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming',
    },
    { id: 5, name: 'Verification', status: currentStep === 5 ? 'current' : 'upcoming' },
  ]

  // Mock API functions
  const mockValidationAPIs = {
    async checkOFAC(companyName: string, taxId: string) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsLoading(false)
      return {
        status: 'clear' as const,
        confidence: 0.95,
        details: 'No matches found in OFAC sanctions lists',
      }
    },

    async validateSunbiz(registrationNumber: string, state: string) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
      return {
        status: 'verified' as const,
        companyDetails: {
          name: 'Don Hugo Exports LLC',
          status: 'Active',
          filingDate: '2020-03-15',
        },
      }
    },

    async checkChamberOfCommerce(companyName: string, country: string) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1800))
      setIsLoading(false)
      return {
        status: 'verified' as const,
        membershipLevel: 'Premium',
        memberSince: '2020-04-01',
      }
    },
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplianceValidation = async () => {
    // Run all validations
    const ofacResult = await mockValidationAPIs.checkOFAC(
      companyInfo.companyName,
      companyInfo.taxId,
    )
    const sunbizResult = await mockValidationAPIs.validateSunbiz(
      companyInfo.registrationNumber,
      companyInfo.businessAddress.state,
    )
    const chamberResult = await mockValidationAPIs.checkChamberOfCommerce(
      companyInfo.companyName,
      companyInfo.incorporationCountry,
    )

    setComplianceValidation({
      ofacCheck: {
        status: ofacResult.status,
        details: ofacResult.details,
        lastChecked: new Date(),
      },
      sunbizValidation: {
        status: sunbizResult.status,
        registrationDetails: sunbizResult.companyDetails,
        lastChecked: new Date(),
      },
      chamberOfCommerce: {
        status: chamberResult.status,
        membershipDetails: {
          level: chamberResult.membershipLevel,
          since: chamberResult.memberSince,
        },
        lastChecked: new Date(),
      },
    })
  }

  const generateVerificationResults = () => {
    const allValidationsPass =
      complianceValidation.ofacCheck.status === 'clear' &&
      complianceValidation.sunbizValidation.status === 'verified' &&
      complianceValidation.chamberOfCommerce.status === 'verified'

    if (allValidationsPass) {
      setVerificationResults({
        overallStatus: 'approved',
        kycScore: 92,
        riskLevel: 'low',
        verificationPackage: {
          packageId: 'PKG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          downloadUrl: '/api/kyc/packages/download',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          watermarkId: 'WM-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        },
        reuseableCredentials: {
          tickVerdeId: 'TV-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          applicableRegions: ['USA', 'Colombia', 'Latin America'],
        },
        recommendations: [
          'KYC validation completed successfully',
          'Company approved for trade finance transactions',
          'Credentials can be reused for future transactions',
        ],
        nextSteps: [
          'Proceed to Samples Evidence workflow',
          'Set up Smart Escrow account',
          'Configure AI Oracle parameters',
        ],
      })
    }
  }

  const renderProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.status === 'completed'
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : step.status === 'current'
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                }`}
              >
                {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step.status === 'current' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Company Information
        </CardTitle>
        <CardDescription>Provide basic company details for identity verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={companyInfo.companyName}
              onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
              placeholder="Don Hugo Exports LLC"
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              value={companyInfo.businessType}
              onValueChange={(value: any) =>
                setCompanyInfo({ ...companyInfo, businessType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exporter">Exporter</SelectItem>
                <SelectItem value="importer">Importer</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={companyInfo.registrationNumber}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, registrationNumber: e.target.value })
              }
              placeholder="FL123456789"
            />
          </div>
          <div>
            <Label htmlFor="taxId">Tax ID *</Label>
            <Input
              id="taxId"
              value={companyInfo.taxId}
              onChange={(e) => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
              placeholder="12-3456789"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="incorporationCountry">Incorporation Country *</Label>
          <Select
            value={companyInfo.incorporationCountry}
            onValueChange={(value) =>
              setCompanyInfo({ ...companyInfo, incorporationCountry: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CO">Colombia</SelectItem>
              <SelectItem value="MX">Mexico</SelectItem>
              <SelectItem value="BR">Brazil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Business Address</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={companyInfo.businessAddress.street}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    businessAddress: { ...companyInfo.businessAddress, street: e.target.value },
                  })
                }
                placeholder="123 Export Street"
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={companyInfo.businessAddress.city}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    businessAddress: { ...companyInfo.businessAddress, city: e.target.value },
                  })
                }
                placeholder="Miami"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                value={companyInfo.businessAddress.state}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    businessAddress: { ...companyInfo.businessAddress, state: e.target.value },
                  })
                }
                placeholder="FL"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Contact Person</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactName">Full Name *</Label>
              <Input
                id="contactName"
                value={companyInfo.contactPerson.name}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, name: e.target.value },
                  })
                }
                placeholder="Hugo Rodriguez"
              />
            </div>
            <div>
              <Label htmlFor="contactTitle">Title *</Label>
              <Input
                id="contactTitle"
                value={companyInfo.contactPerson.title}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, title: e.target.value },
                  })
                }
                placeholder="CEO"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={companyInfo.contactPerson.email}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, email: e.target.value },
                  })
                }
                placeholder="hugo@donhugoexports.com"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Phone *</Label>
              <Input
                id="contactPhone"
                value={companyInfo.contactPerson.phone}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, phone: e.target.value },
                  })
                }
                placeholder="+1 (305) 123-4567"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Financial Information
        </CardTitle>
        <CardDescription>
          Financial capacity and business references for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="annualRevenue">Annual Revenue (USD) *</Label>
            <Input
              id="annualRevenue"
              value={financialInfo.annualRevenue}
              onChange={(e) =>
                setFinancialInfo({ ...financialInfo, annualRevenue: e.target.value })
              }
              placeholder="5000000"
            />
          </div>
          <div>
            <Label htmlFor="employeeCount">Employee Count *</Label>
            <Input
              id="employeeCount"
              value={financialInfo.employeeCount}
              onChange={(e) =>
                setFinancialInfo({ ...financialInfo, employeeCount: e.target.value })
              }
              placeholder="25"
            />
          </div>
          <div>
            <Label htmlFor="yearsInBusiness">Years in Business *</Label>
            <Input
              id="yearsInBusiness"
              value={financialInfo.yearsInBusiness}
              onChange={(e) =>
                setFinancialInfo({ ...financialInfo, yearsInBusiness: e.target.value })
              }
              placeholder="5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="auditedFinancials">Audited Financial Statements</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop your audited financial statements
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Bank References</h4>
          {financialInfo.bankReferences.map((ref, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <Label htmlFor={`bankName-${index}`}>Bank Name *</Label>
                <Input
                  id={`bankName-${index}`}
                  value={ref.bankName}
                  onChange={(e) => {
                    const newRefs = [...financialInfo.bankReferences]
                    if (newRefs[index]) {
                      newRefs[index].bankName = e.target.value
                      setFinancialInfo({ ...financialInfo, bankReferences: newRefs })
                    }
                  }}
                  placeholder="Bank of America"
                />
              </div>
              <div>
                <Label htmlFor={`accountNumber-${index}`}>Account Number *</Label>
                <Input
                  id={`accountNumber-${index}`}
                  value={ref.accountNumber}
                  onChange={(e) => {
                    const newRefs = [...financialInfo.bankReferences]
                    if (newRefs[index]) {
                      newRefs[index].accountNumber = e.target.value
                      setFinancialInfo({ ...financialInfo, bankReferences: newRefs })
                    }
                  }}
                  placeholder="****1234"
                />
              </div>
              <div>
                <Label htmlFor={`contactPerson-${index}`}>Contact Person *</Label>
                <Input
                  id={`contactPerson-${index}`}
                  value={ref.contactPerson}
                  onChange={(e) => {
                    const newRefs = [...financialInfo.bankReferences]
                    if (newRefs[index]) {
                      newRefs[index].contactPerson = e.target.value
                      setFinancialInfo({ ...financialInfo, bankReferences: newRefs })
                    }
                  }}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor={`phone-${index}`}>Phone *</Label>
                <Input
                  id={`phone-${index}`}
                  value={ref.phone}
                  onChange={(e) => {
                    const newRefs = [...financialInfo.bankReferences]
                    if (newRefs[index]) {
                      newRefs[index].phone = e.target.value
                      setFinancialInfo({ ...financialInfo, bankReferences: newRefs })
                    }
                  }}
                  placeholder="+1 (800) 123-4567"
                />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              setFinancialInfo({
                ...financialInfo,
                bankReferences: [
                  ...financialInfo.bankReferences,
                  { bankName: '', accountNumber: '', contactPerson: '', phone: '' },
                ],
              })
            }
          >
            Add Another Bank Reference
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Compliance Validation
        </CardTitle>
        <CardDescription>
          Automated validation against regulatory databases and sanctions lists
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center mb-6">
          <Button
            onClick={handleComplianceValidation}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Validations...
              </>
            ) : (
              'Start Compliance Validation'
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {/* OFAC Check */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  complianceValidation.ofacCheck.status === 'clear'
                    ? 'bg-green-100'
                    : complianceValidation.ofacCheck.status === 'flagged'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                }`}
              >
                {complianceValidation.ofacCheck.status === 'clear' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : complianceValidation.ofacCheck.status === 'flagged' ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium">OFAC Sanctions Check</h4>
                <p className="text-sm text-gray-600">
                  {complianceValidation.ofacCheck.details ||
                    'Checking against OFAC sanctions lists...'}
                </p>
              </div>
            </div>
            <Badge
              variant={
                complianceValidation.ofacCheck.status === 'clear'
                  ? 'default'
                  : complianceValidation.ofacCheck.status === 'flagged'
                    ? 'destructive'
                    : 'secondary'
              }
            >
              {complianceValidation.ofacCheck.status.toUpperCase()}
            </Badge>
          </div>

          {/* Sunbiz Validation */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  complianceValidation.sunbizValidation.status === 'verified'
                    ? 'bg-green-100'
                    : complianceValidation.sunbizValidation.status === 'failed'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                }`}
              >
                {complianceValidation.sunbizValidation.status === 'verified' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : complianceValidation.sunbizValidation.status === 'failed' ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium">Secretary of State entity verification</h4>
                <p className="text-sm text-gray-600">
                  {complianceValidation.sunbizValidation.registrationDetails
                    ? `Company verified: ${complianceValidation.sunbizValidation.registrationDetails.name}`
                    : 'Validating business registration...'}
                </p>
              </div>
            </div>
            <Badge
              variant={
                complianceValidation.sunbizValidation.status === 'verified'
                  ? 'default'
                  : complianceValidation.sunbizValidation.status === 'failed'
                    ? 'destructive'
                    : 'secondary'
              }
            >
              {complianceValidation.sunbizValidation.status.toUpperCase()}
            </Badge>
          </div>

          {/* Chamber of Commerce */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  complianceValidation.chamberOfCommerce.status === 'verified'
                    ? 'bg-green-100'
                    : complianceValidation.chamberOfCommerce.status === 'failed'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                }`}
              >
                {complianceValidation.chamberOfCommerce.status === 'verified' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : complianceValidation.chamberOfCommerce.status === 'failed' ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium">Chamber of Commerce Verification</h4>
                <p className="text-sm text-gray-600">
                  {complianceValidation.chamberOfCommerce.membershipDetails
                    ? `Member since ${complianceValidation.chamberOfCommerce.membershipDetails.since}`
                    : 'Checking chamber membership...'}
                </p>
              </div>
            </div>
            <Badge
              variant={
                complianceValidation.chamberOfCommerce.status === 'verified'
                  ? 'default'
                  : complianceValidation.chamberOfCommerce.status === 'failed'
                    ? 'destructive'
                    : 'secondary'
              }
            >
              {complianceValidation.chamberOfCommerce.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Document Upload
        </CardTitle>
        <CardDescription>Upload required documents for verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Required Documents</h4>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Incorporation Certificate</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Tax Certificate</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Business License</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Optional Documents</h4>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Insurance Certificate</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Bank Statements</p>
              <p className="text-xs text-gray-500">PDF up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => {
              generateVerificationResults()
              handleNext()
            }}
          >
            Complete Document Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Verification Results
        </CardTitle>
        <CardDescription>Your KYC validation has been completed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              verificationResults.overallStatus === 'approved' ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            <CheckCircle
              className={`w-10 h-10 ${
                verificationResults.overallStatus === 'approved'
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`}
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {verificationResults.overallStatus === 'approved' ? 'KYC Approved!' : 'Under Review'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {verificationResults.overallStatus === 'approved'
              ? 'Your company has been successfully verified for trade finance transactions'
              : 'Your application is being reviewed by our compliance team'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {verificationResults.kycScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">KYC Score</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div
                className={`text-3xl font-bold mb-2 ${
                  verificationResults.riskLevel === 'low'
                    ? 'text-green-600'
                    : verificationResults.riskLevel === 'medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {verificationResults.riskLevel.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Risk Level</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {verificationResults.verificationPackage ? '✓' : '⏳'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Package Ready</div>
            </CardContent>
          </Card>
        </div>

        {verificationResults.verificationPackage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">
                    Package ID: {verificationResults.verificationPackage.packageId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires:{' '}
                    {verificationResults.verificationPackage.expiryDate.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Watermark: {verificationResults.verificationPackage.watermarkId}
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Package
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationResults.reuseableCredentials && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reuseable Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Green Tick Issued</span>
                </div>
                <p className="text-sm text-green-700">
                  Credential ID: {verificationResults.reuseableCredentials.tickVerdeId}
                </p>
                <p className="text-sm text-green-700">
                  Valid until:{' '}
                  {verificationResults.reuseableCredentials.validUntil.toLocaleDateString()}
                </p>
                <p className="text-sm text-green-700">
                  Applicable regions:{' '}
                  {verificationResults.reuseableCredentials.applicableRegions.join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {verificationResults.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Next Steps</h4>
            <ul className="space-y-2">
              {verificationResults.nextSteps.map((step, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trade Flow
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                KYC/KYB Validation Workflow
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Complete your identity verification to access trade finance services
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Shield className="w-4 h-4 mr-1" />
            Secure Process
          </Badge>
        </div>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 5 && (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                currentStep === 3 &&
                (complianceValidation.ofacCheck.status === 'pending' ||
                  complianceValidation.sunbizValidation.status === 'pending' ||
                  complianceValidation.chamberOfCommerce.status === 'pending')
              }
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {currentStep === 5 && (
            <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
              Complete KYC Process
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
