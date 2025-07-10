import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText } from 'lucide-react'

interface DocumentUploadStepProps {
  onComplete: () => void
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ onComplete }) => {
  return (
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
          <Button onClick={onComplete}>Complete Document Upload</Button>
        </div>
      </CardContent>
    </Card>
  )
}
