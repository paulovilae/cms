'use client'

import React, { useState } from 'react'

export interface SmartContractVisualizerProps {
  contractAddress: string
  contractCode?: string
  showCode: boolean
  status: 'created' | 'in-progress' | 'completed'
  completedSteps: number
  totalSteps: number
}

export const SmartContractVisualizer: React.FC<SmartContractVisualizerProps> = ({
  contractAddress,
  contractCode,
  showCode,
  status,
  completedSteps,
  totalSteps,
}) => {
  const [codeVisible, setCodeVisible] = useState(showCode)

  // Calculate progress percentage
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  // Display a simplified blockchain with the contract
  const getStatusColor = () => {
    switch (status) {
      case 'created':
        return 'status-created'
      case 'in-progress':
        return 'status-in-progress'
      case 'completed':
        return 'status-completed'
      default:
        return ''
    }
  }

  return (
    <div className="smart-contract-visualizer">
      <div className="smart-contract-visualizer__header">
        <h3>Smart Contract</h3>
        <div className="contract-address">
          <span className="label">Address:</span>
          <code className="address">{contractAddress}</code>
        </div>
      </div>

      <div className="smart-contract-visualizer__blockchain">
        <div className="blockchain-visualization">
          <div className="blockchain-node">
            <div className="node-icon">📄</div>
            <div className="node-label">Contract Creation</div>
          </div>

          <div className="blockchain-connection"></div>

          <div className={`blockchain-node ${completedSteps >= 1 ? 'active' : ''}`}>
            <div className="node-icon">🔍</div>
            <div className="node-label">Verification 1</div>
          </div>

          <div className="blockchain-connection"></div>

          <div className={`blockchain-node ${completedSteps >= 2 ? 'active' : ''}`}>
            <div className="node-icon">🔍</div>
            <div className="node-label">Verification 2</div>
          </div>

          <div className="blockchain-connection"></div>

          <div className={`blockchain-node ${completedSteps >= totalSteps ? 'active' : ''}`}>
            <div className="node-icon">✅</div>
            <div className="node-label">Contract Complete</div>
          </div>
        </div>

        <div className="contract-status">
          <div className={`status-indicator ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="progress-text">
              {completedSteps} of {totalSteps} steps completed ({Math.round(progressPercentage)}%)
            </div>
          </div>
        </div>
      </div>

      {contractCode && (
        <div className="smart-contract-visualizer__code">
          <div className="code-header">
            <h4>Smart Contract Code</h4>
            <button className="code-toggle" onClick={() => setCodeVisible(!codeVisible)}>
              {codeVisible ? 'Hide Code' : 'Show Code'}
            </button>
          </div>

          {codeVisible && (
            <pre className="code-block">
              <code>{contractCode}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
