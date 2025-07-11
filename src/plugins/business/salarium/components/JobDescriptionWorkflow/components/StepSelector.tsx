import React from 'react'
import { FlowInstance, Step } from '../types'

interface StepSelectorProps {
  steps: Step[]
  currentStep: number
  flowInstance: FlowInstance
  onStepChange: (stepNumber: number) => void
}

const StepSelector: React.FC<StepSelectorProps> = ({
  steps,
  currentStep,
  flowInstance,
  onStepChange,
}) => {
  if (!steps || steps.length === 0) {
    return null
  }

  // Check if a step is completed based on the flow instance data
  const isStepCompleted = (stepNumber: number): boolean => {
    if (!flowInstance || !flowInstance.stepResponses) {
      return false
    }
    const stepResponse = flowInstance.stepResponses.find(
      (response) => response.stepNumber === stepNumber,
    )
    return !!stepResponse && stepResponse.isCompleted
  }

  // Determine if a step is accessible (previous steps are completed)
  const isStepAccessible = (stepNumber: number): boolean => {
    // First step is always accessible
    if (stepNumber === 1) return true

    // For other steps, all previous steps must be completed
    for (let i = 1; i < stepNumber; i++) {
      if (!isStepCompleted(i)) {
        return false
      }
    }
    return true
  }

  // Calculate progress percentage
  const completedSteps = steps.filter((step) => isStepCompleted(step.stepNumber)).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between w-full">
        {steps.map((step) => {
          const isActive = currentStep === step.stepNumber
          const isCompleted = isStepCompleted(step.stepNumber)
          const isAccessible = isStepAccessible(step.stepNumber)

          // Determine button state classes
          let buttonClasses =
            'flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 '

          if (isActive) {
            buttonClasses += 'bg-blue-100 text-blue-700 border-2 border-blue-500 '
          } else if (isCompleted) {
            buttonClasses +=
              'bg-green-50 text-green-700 border border-green-500 hover:bg-green-100 '
          } else if (isAccessible) {
            buttonClasses += 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100 '
          } else {
            buttonClasses +=
              'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-70 '
          }

          return (
            <button
              key={step.stepNumber}
              className={buttonClasses}
              onClick={() => isAccessible && onStepChange(step.stepNumber)}
              disabled={!isAccessible}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="flex items-center justify-center w-8 h-8 mb-2 rounded-full bg-white">
                {isCompleted ? (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className={isActive ? 'text-blue-700' : 'text-gray-500'}>
                    {step.stepNumber}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">{step.stepTitle}</span>
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 mt-4 bg-gray-100 rounded-full">
        <div
          className="h-2 bg-green-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}

export default StepSelector
