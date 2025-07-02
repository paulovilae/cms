'use client'

import React from 'react'

export interface OracleVerificationCardProps {
  title: string
  timestamp: string | Date
  evidenceType: 'photo' | 'gps' | 'document' | 'multiple'
  evidence?: {
    id: string
    relationTo: string
  }[]
  verified: boolean
  verifier: string
  paymentReleased: number
  showCode: boolean
  oracleCode?: string
  contractCode?: string
}

export const OracleVerificationCard: React.FC<OracleVerificationCardProps> = ({
  title,
  timestamp,
  evidenceType,
  evidence,
  verified,
  verifier,
  paymentReleased,
  showCode,
  oracleCode,
  contractCode,
}) => {
  // Format date if it exists
  const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'Pending'

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return '📷'
      case 'gps':
        return '📍'
      case 'document':
        return '📄'
      case 'multiple':
        return '📦'
      default:
        return '❓'
    }
  }

  return (
    <div className={`oracle-verification-card ${verified ? 'verified' : 'pending'}`}>
      <div className="oracle-verification-card__header">
        <div className="oracle-verification-card__status">
          {verified ? (
            <span className="status-badge verified">✓ Verified</span>
          ) : (
            <span className="status-badge pending">⏱ Pending</span>
          )}
        </div>
        <h3 className="oracle-verification-card__title">{title}</h3>
      </div>

      <div className="oracle-verification-card__content">
        <div className="oracle-verification-card__info">
          <div className="info-row">
            <span className="label">Timestamp:</span>
            <span className="value">{formattedDate}</span>
          </div>
          <div className="info-row">
            <span className="label">Evidence Type:</span>
            <span className="value">
              {getEvidenceTypeIcon(evidenceType)}{' '}
              {evidenceType.charAt(0).toUpperCase() + evidenceType.slice(1)}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Verified By:</span>
            <span className="value">{verifier || 'Pending verification'}</span>
          </div>
          <div className="info-row">
            <span className="label">Payment Released:</span>
            <span className="value payment">{paymentReleased}%</span>
          </div>
        </div>

        {evidence && evidence.length > 0 && (
          <div className="oracle-verification-card__evidence">
            <h4>Evidence</h4>
            <div className="evidence-placeholder">
              {/* In a real implementation, this would display the actual media */}
              <div className="evidence-media">
                {evidenceType === 'photo' && (
                  <div className="photo-placeholder">📷 Photo Evidence</div>
                )}
                {evidenceType === 'gps' && (
                  <div className="gps-placeholder">📍 GPS Coordinates</div>
                )}
                {evidenceType === 'document' && (
                  <div className="document-placeholder">📄 Document</div>
                )}
                {evidenceType === 'multiple' && (
                  <div className="multiple-placeholder">📦 Multiple Evidence Types</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showCode && (
        <div className="oracle-verification-card__code">
          <div className="code-section">
            <h4>Oracle Verification Code</h4>
            <pre className="code-block">
              <code>{oracleCode || '// No oracle code available for this step'}</code>
            </pre>
          </div>

          {contractCode && (
            <div className="code-section">
              <h4>Contract Interaction</h4>
              <pre className="code-block">
                <code>{contractCode}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
