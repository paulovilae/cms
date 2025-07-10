import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'
import type { VerificationResults } from '../types/workflow.types'

interface VerificationResultsStepProps {
  verificationResults: VerificationResults
}

export const VerificationResultsStep: React.FC<VerificationResultsStepProps> = ({
  verificationResults,
}) => {
  return (
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
}
