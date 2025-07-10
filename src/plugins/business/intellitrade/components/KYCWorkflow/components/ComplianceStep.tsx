import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react'
import type { ComplianceValidation } from '../types/workflow.types'

interface ComplianceStepProps {
  complianceValidation: ComplianceValidation
  isLoading: boolean
  onRunValidation: () => void
}

export const ComplianceStep: React.FC<ComplianceStepProps> = ({
  complianceValidation,
  isLoading,
  onRunValidation,
}) => {
  return (
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
            onClick={onRunValidation}
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
}
