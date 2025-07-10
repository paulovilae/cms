import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Upload } from 'lucide-react'
import type { FinancialInfo } from '../types/workflow.types'

interface FinancialInfoStepProps {
  financialInfo: FinancialInfo
  setFinancialInfo: (info: FinancialInfo) => void
}

export const FinancialInfoStep: React.FC<FinancialInfoStepProps> = ({
  financialInfo,
  setFinancialInfo,
}) => {
  return (
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
}
