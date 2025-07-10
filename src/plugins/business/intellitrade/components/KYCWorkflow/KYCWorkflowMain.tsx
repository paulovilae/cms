'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Shield } from 'lucide-react'

// Import types
import type {
  KYCWorkflowProps,
  CompanyBasicInfo,
  FinancialInfo,
  ComplianceValidation,
  VerificationResults,
} from './types/workflow.types'

// Import utilities
import {
  createWorkflowSteps,
  generateVerificationResults,
  isComplianceValidationComplete,
} from './utils/workflowUtils'
import { createMockValidationAPIs, handleComplianceValidation } from './utils/apiUtils'

// Import components
import { ProgressIndicator } from './components/ProgressIndicator'
import { CompanyInfoStep } from './components/CompanyInfoStep'
import { FinancialInfoStep } from './components/FinancialInfoStep'
import { ComplianceStep } from './components/ComplianceStep'
import { DocumentUploadStep } from './components/DocumentUploadStep'
import { VerificationResultsStep } from './components/VerificationResultsStep'

export const KYCWorkflowMain: React.FC<KYCWorkflowProps> = ({ onBack }) => {
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

  // Create workflow steps
  const steps = createWorkflowSteps(currentStep)

  // Create mock validation APIs
  const mockValidationAPIs = createMockValidationAPIs(setIsLoading)

  // Navigation handlers
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

  // Compliance validation handler
  const handleComplianceValidationClick = async () => {
    await handleComplianceValidation(
      companyInfo.companyName,
      companyInfo.taxId,
      companyInfo.registrationNumber,
      companyInfo.businessAddress.state,
      companyInfo.incorporationCountry,
      mockValidationAPIs,
      setComplianceValidation,
    )
  }

  // Document upload completion handler
  const handleDocumentUploadComplete = () => {
    generateVerificationResults(complianceValidation, setVerificationResults)
    handleNext()
  }

  // Render current step content
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyInfoStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
      case 2:
        return (
          <FinancialInfoStep financialInfo={financialInfo} setFinancialInfo={setFinancialInfo} />
        )
      case 3:
        return (
          <ComplianceStep
            complianceValidation={complianceValidation}
            isLoading={isLoading}
            onRunValidation={handleComplianceValidationClick}
          />
        )
      case 4:
        return <DocumentUploadStep onComplete={handleDocumentUploadComplete} />
      case 5:
        return <VerificationResultsStep verificationResults={verificationResults} />
      default:
        return <CompanyInfoStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
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
        <ProgressIndicator steps={steps} />

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
              disabled={currentStep === 3 && !isComplianceValidationComplete(complianceValidation)}
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
