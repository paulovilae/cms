import React from 'react'
import { CheckCircle } from 'lucide-react'
import type { WorkflowStep } from '../types/workflow.types'

interface ProgressIndicatorProps {
  steps: WorkflowStep[]
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  return (
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
}
