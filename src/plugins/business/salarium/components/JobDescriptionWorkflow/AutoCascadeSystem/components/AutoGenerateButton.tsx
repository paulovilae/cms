'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Play, StopCircle, RefreshCw } from 'lucide-react'

interface AutoGenerateButtonProps {
  isGenerating: boolean
  generationProgress?: number // Added to match the parent component
  onGenerate: () => void
  onCancel: () => void
  onRegenerate?: () => void
  disabled?: boolean
  showRegenerate?: boolean
  tooltipText?: string
  className?: string
}

/**
 * Button to trigger auto-generation of job description sections
 */
export const AutoGenerateButton: React.FC<AutoGenerateButtonProps> = ({
  isGenerating,
  onGenerate,
  onCancel,
  onRegenerate,
  disabled = false,
  showRegenerate = false,
  tooltipText,
  className = '',
}) => {
  // Determine which button to show based on state
  const renderButton = () => {
    if (isGenerating) {
      return (
        <Button
          variant="destructive"
          onClick={onCancel}
          className={`flex items-center gap-2 ${className}`}
          disabled={disabled}
        >
          <StopCircle className="h-4 w-4" />
          Cancel Generation
        </Button>
      )
    }

    if (showRegenerate && onRegenerate) {
      return (
        <Button
          variant="outline"
          onClick={onRegenerate}
          className={`flex items-center gap-2 ${className}`}
          disabled={disabled}
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      )
    }

    return (
      <Button
        variant="default"
        onClick={onGenerate}
        className={`flex items-center gap-2 ${className}`}
        disabled={disabled}
      >
        <Play className="h-4 w-4" />
        Auto-Generate Content
      </Button>
    )
  }

  // Removed tooltip implementation to avoid import error
  return renderButton()
}

export default AutoGenerateButton
