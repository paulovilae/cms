'use client'

import React from 'react'
import { useFormFields, useDocumentInfo } from '@payloadcms/ui'

interface ConnectionStatusIndicatorProps {
  path?: string
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = () => {
  // Try multiple approaches to get form data
  const formFields = useFormFields(([fields]) => ({ fields }))
  const documentInfo = useDocumentInfo()

  // Try to get data from document info first, then form fields
  const docData = (documentInfo as any)?.docData || (documentInfo as any)?.data || documentInfo
  const fields = formFields?.fields

  // Access fields with multiple fallback strategies
  // Try snake_case first (database format), then camelCase (form format)
  const connectionStatus =
    docData?.connection_status ||
    docData?.connectionStatus ||
    fields?.connection_status?.value ||
    fields?.connectionStatus?.value ||
    'disconnected'

  const lastTestDate =
    docData?.last_test_date ||
    docData?.lastTestDate ||
    fields?.last_test_date?.value ||
    fields?.lastTestDate?.value

  const responseTimeMs =
    docData?.response_time_ms ||
    docData?.responseTimeMs ||
    fields?.response_time_ms?.value ||
    fields?.responseTimeMs?.value

  const lastTestError =
    docData?.last_test_error ||
    docData?.lastTestError ||
    fields?.last_test_error?.value ||
    fields?.lastTestError?.value

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)', // Dark theme compatible
          borderColor: '#10b981',
          icon: '🟢',
          label: 'Connected',
          textColor: '#10b981',
        }
      case 'testing':
        return {
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)', // Dark theme compatible
          borderColor: '#f59e0b',
          icon: '🟡',
          label: 'Testing...',
          textColor: '#f59e0b',
        }
      case 'error':
        return {
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)', // Dark theme compatible
          borderColor: '#ef4444',
          icon: '🔴',
          label: 'Error',
          textColor: '#ef4444',
        }
      default: // disconnected
        return {
          color: '#6b7280',
          bgColor: 'rgba(107, 114, 128, 0.1)', // Dark theme compatible
          borderColor: '#6b7280',
          icon: '⚫',
          label: 'Disconnected',
          textColor: '#9ca3af',
        }
    }
  }

  const statusConfig = getStatusConfig(connectionStatus)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    try {
      // Use consistent formatting to avoid hydration mismatch
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    } catch {
      return 'Invalid date'
    }
  }

  // Simple linear speed indicator with number and directional arrow
  const SpeedIndicator: React.FC<{ responseTime: number }> = ({ responseTime }) => {
    const getSpeedData = (time: number) => {
      if (time < 100)
        return {
          color: '#10b981',
          arrow: '↗️',
          label: 'Excellent',
          icon: '⚡',
        }
      if (time < 300)
        return {
          color: '#84cc16',
          arrow: '↗️',
          label: 'Good',
          icon: '⚡',
        }
      if (time < 500)
        return {
          color: '#eab308',
          arrow: '➡️',
          label: 'OK',
          icon: '⚡',
        }
      if (time < 1000)
        return {
          color: '#f97316',
          arrow: '↘️',
          label: 'Slow',
          icon: '🐌',
        }
      return {
        color: '#ef4444',
        arrow: '⬇️',
        label: 'Very Slow',
        icon: '🐌',
      }
    }

    const speedData = getSpeedData(responseTime)

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: `${speedData.color}15`, // 15 = ~8% opacity
          border: `1px solid ${speedData.color}40`, // 40 = ~25% opacity
          borderRadius: '8px',
          margin: '8px 0',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Speed icon */}
        <span style={{ fontSize: '16px' }}>{speedData.icon}</span>

        {/* Response time */}
        <span
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: speedData.color,
          }}
        >
          {responseTime}ms
        </span>

        {/* Directional arrow */}
        <span style={{ fontSize: '14px' }}>{speedData.arrow}</span>

        {/* Quality label */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: speedData.color,
            opacity: 0.9,
          }}
        >
          {speedData.label}
        </span>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Main Status Card - Dark theme compatible */}
      <div
        style={{
          padding: '16px',
          backgroundColor: statusConfig.bgColor,
          border: `1px solid ${statusConfig.borderColor}`,
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        {/* Status Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontSize: '16px', marginRight: '8px' }}>{statusConfig.icon}</span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: statusConfig.textColor,
            }}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Response Time Dial - Only show for connected status */}
        {responseTimeMs && connectionStatus === 'connected' && (
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#9ca3af',
                marginBottom: '4px',
              }}
            >
              Response Time
            </div>
            <SpeedIndicator responseTime={responseTimeMs} />
          </div>
        )}

        {/* Last Test Info */}
        <div
          style={{
            fontSize: '12px',
            color: '#9ca3af',
            borderTop: '1px solid rgba(107, 114, 128, 0.2)',
            paddingTop: '8px',
          }}
        >
          <strong>Last tested:</strong> {formatDate(lastTestDate)}
        </div>
      </div>

      {/* Error Details - Only show for error status */}
      {lastTestError && connectionStatus === 'error' && (
        <div
          style={{
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#ef4444',
              marginBottom: '6px',
            }}
          >
            🚨 Error Details:
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#fca5a5',
              fontFamily: 'monospace',
              wordBreak: 'break-word',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              padding: '6px',
              borderRadius: '4px',
            }}
          >
            {lastTestError}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectionStatusIndicator
