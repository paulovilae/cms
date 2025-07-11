'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface CascadeProgressProps {
  progress: number
  currentSectionTitle?: string
  completedCount: number
  totalCount: number
  error: string | null
  isGenerating: boolean
  className?: string
}

/**
 * Component to display progress of the cascade generation process
 */
export const CascadeProgress: React.FC<CascadeProgressProps> = ({
  progress,
  currentSectionTitle = 'Current section',
  completedCount,
  totalCount,
  error,
  isGenerating,
  className = '',
}) => {
  // Determine the progress display text and color
  const getProgressDisplay = () => {
    if (error) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        text: 'Generation Error',
        color: 'bg-red-100 text-red-800',
      }
    }

    if (!isGenerating && completedCount === totalCount && totalCount > 0) {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        text: 'Generation Complete',
        color: 'bg-green-100 text-green-800',
      }
    }

    return {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      text: isGenerating ? 'Generating...' : 'Ready to Generate',
      color: 'bg-blue-100 text-blue-800',
    }
  }

  const progressDisplay = getProgressDisplay()

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {progressDisplay.icon}
          <span>{progressDisplay.text}</span>
        </CardTitle>
        <CardDescription>
          {isGenerating && currentSectionTitle ? `Processing: ${currentSectionTitle}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Custom progress bar since we're avoiding importing the Progress component */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>
            {completedCount} of {totalCount} sections complete
          </span>
          <span>{progress}%</span>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CascadeProgress
