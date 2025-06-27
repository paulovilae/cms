'use client'

import React, { useState, useEffect } from 'react'
import { OracleVerificationCard } from './OracleVerificationCard'
import { SmartContractVisualizer } from './SmartContractVisualizer'
import { Spinner } from '../../components/ui/Spinner'
import './styles.css'

type VerificationStep = {
  stepName: string
  description?: string
  status: 'pending' | 'verified' | 'failed'
  verifiedBy?: string
  timestamp?: string | Date
  paymentReleased?: number
  evidenceType?: 'photo' | 'gps' | 'document' | 'multiple'
  evidence?: { id: string; relationTo: string }[]
  contractCode?: string
  oracleInteraction?: string
}

type CompanyData = {
  id: string
  name: string
  type: 'exporter' | 'importer' | 'both'
  description?: string
  country?: string
}

type TransactionData = {
  title: string
  contractAddress: string
  exporter: CompanyData | { id: string }
  importer: CompanyData | { id: string }
  product: string
  amount: number
  currency: string
  status: 'created' | 'in-progress' | 'completed'
  verificationSteps: VerificationStep[]
  smartContractCode?: string
}

type SmartContractDemoProps = {
  transaction: {
    id: string
    relationTo: string
  }
  showTechnicalDetails: boolean
  animationSpeed: 'slow' | 'medium' | 'fast'
  interactiveMode: 'manual' | 'auto' | 'both'
  heading?: string
  description?: string
}

export const Component: React.FC<SmartContractDemoProps> = ({
  transaction,
  showTechnicalDetails,
  animationSpeed,
  interactiveMode,
  heading,
  description,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [autoPlaying, setAutoPlaying] = useState(false)
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Define animation speeds in milliseconds
  const animationSpeeds = {
    slow: 5000,
    medium: 3000,
    fast: 1500,
  }

  // In a real implementation, we would use the Payload API client
  // For now, let's simulate loading with a setTimeout
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      // In a real implementation, we would fetch from Payload API
      // For now, let's just return mock data after a delay
      setTimeout(() => {
        const mockData: TransactionData = {
          title: 'Don Hugo Peanut Export - Batch #1',
          contractAddress: '0x7a3E8F126a5D91C58EA6F53EaB37C6439E63F1F9',
          exporter: { id: '1', name: 'Don Hugo Farms', type: 'exporter' },
          importer: { id: '2', name: 'Global Nut Distributors Ltd.', type: 'importer' },
          product: 'Premium Grade A Peanuts',
          amount: 75000,
          currency: 'usdc',
          status: 'in-progress',
          verificationSteps: [
            {
              stepName: 'Production Verification',
              description: 'Verification of peanut production at Don Hugo Farms facility',
              status: 'verified',
              verifiedBy: 'Oracle Node #452',
              timestamp: '2025-04-12T10:23:45Z',
              paymentReleased: 15,
              evidenceType: 'photo',
              evidence: [],
              contractCode: `function verifyProduction(bytes32 photoHash, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredFacility(lat, long), "Location not registered");
  require(validatePhotoHash(photoHash), "Invalid photo evidence");
  verifyMilestone(1, generateSignature(photoHash, timestamp, lat, long));
}`,
              oracleInteraction: `// Oracle verification code
const photoEvidence = await retrieveEvidence('photo-123456');
const gpsData = await retrieveGPS('device-789012');

if (verifyPhotoAuthenticity(photoEvidence) && verifyGPSLocation(gpsData)) {
  await submitVerification({
    milestone: 1,
    evidence: {
      photoHash: calculateHash(photoEvidence),
      timestamp: Date.now(),
      latitude: gpsData.latitude,
      longitude: gpsData.longitude
    }
  });
}`,
            },
            {
              stepName: 'Port of Origin Departure',
              description: 'Verification of goods arrival and loading at Puerto de Buenos Aires',
              status: 'verified',
              verifiedBy: 'Oracle Node #387',
              timestamp: '2025-04-18T14:05:12Z',
              paymentReleased: 20,
              evidenceType: 'document',
              evidence: [],
              contractCode: `function verifyPortDeparture(bytes32 documentHash, uint256 timestamp, bytes32 billOfLadingId) {
  require(validateDocument(documentHash, "billOfLading"), "Invalid document");
  require(validatePortAuthority(billOfLadingId), "Port authority verification failed");
  verifyMilestone(2, generateSignature(documentHash, timestamp, billOfLadingId));
}`,
              oracleInteraction: `// Oracle verification code
const billOfLading = await retrieveDocument('bol-456789');
const portAuthorityConfirmation = await queryPortAuthority('shipment-123456');

if (verifyDocumentAuthenticity(billOfLading) && portAuthorityConfirmation.status === 'DEPARTED') {
  await submitVerification({
    milestone: 2,
    evidence: {
      documentHash: calculateHash(billOfLading),
      timestamp: Date.now(),
      billOfLadingId: billOfLading.id
    }
  });
}`,
            },
            {
              stepName: 'Ocean Transit Tracking',
              description: 'Verification of container location during ocean transit',
              status: 'verified',
              verifiedBy: 'Oracle Node #129',
              timestamp: '2025-05-02T08:34:27Z',
              paymentReleased: 0,
              evidenceType: 'gps',
              evidence: [],
              contractCode: `function verifyTransitLocation(bytes32 vesselId, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredVessel(vesselId), "Unknown vessel");
  require(isOnCourse(vesselId, lat, long), "Vessel off expected course");
  // No payment released, just update status
  logTransitUpdate(3, generateSignature(vesselId, timestamp, lat, long));
}`,
              oracleInteraction: `// Oracle verification code
const vesselData = await retrieveVesselData('vessel-789012');
const routeData = await retrieveShippingRoute('route-345678');

if (verifyVesselIdentity(vesselData) && verifyRouteProgress(vesselData, routeData)) {
  await submitVerification({
    milestone: 3,
    evidence: {
      vesselId: vesselData.id,
      timestamp: Date.now(),
      latitude: vesselData.position.latitude,
      longitude: vesselData.position.longitude
    }
  });
}`,
            },
            {
              stepName: 'Arrival at Destination Port',
              description: 'Verification of arrival at Port of Los Angeles',
              status: 'verified',
              verifiedBy: 'Oracle Node #256',
              timestamp: '2025-05-15T16:42:09Z',
              paymentReleased: 20,
              evidenceType: 'document',
              evidence: [],
              contractCode: `function verifyPortArrival(bytes32 documentHash, uint256 timestamp, bytes32 customsId) {
  require(validateDocument(documentHash, "importDeclaration"), "Invalid document");
  require(validateCustomsAuthority(customsId), "Customs verification failed");
  verifyMilestone(4, generateSignature(documentHash, timestamp, customsId));
}`,
              oracleInteraction: `// Oracle verification code
const importDeclaration = await retrieveDocument('import-789012');
const customsConfirmation = await queryCustomsAuthority('shipment-123456');

if (verifyDocumentAuthenticity(importDeclaration) && customsConfirmation.status === 'CLEARED') {
  await submitVerification({
    milestone: 4,
    evidence: {
      documentHash: calculateHash(importDeclaration),
      timestamp: Date.now(),
      customsId: customsConfirmation.id
    }
  });
}`,
            },
            {
              stepName: 'Final Delivery Verification',
              description: 'Verification of delivery to Global Nut Distributors warehouse',
              status: 'pending',
              evidenceType: 'multiple',
              evidence: [],
              contractCode: `function verifyFinalDelivery(bytes32 receiptHash, uint256 timestamp, bytes32 qualityReportId) {
  require(validateDocument(receiptHash, "deliveryReceipt"), "Invalid receipt");
  require(validateQualityReport(qualityReportId), "Quality verification failed");
  verifyMilestone(5, generateSignature(receiptHash, timestamp, qualityReportId));
  // Complete contract after final milestone
  completeTransaction();
}`,
              oracleInteraction: `// Oracle verification code
const deliveryReceipt = await retrieveDocument('receipt-123456');
const qualityReport = await retrieveDocument('quality-789012');

if (verifyDocumentAuthenticity(deliveryReceipt) && verifyQualityReport(qualityReport)) {
  await submitVerification({
    milestone: 5,
    evidence: {
      receiptHash: calculateHash(deliveryReceipt),
      timestamp: Date.now(),
      qualityReportId: qualityReport.id
    }
  });
}`,
            },
          ],
          smartContractCode: `// Simplified smart contract code
pragma solidity ^0.8.0;

contract ExportEscrow {
  address public importer;
  address public exporter;
  uint256 public totalAmount;
  mapping(uint8 => bool) public milestoneCompleted;
  mapping(uint8 => uint256) public milestonePayment;
  
  constructor(address _exporter, uint256 _amount) payable {
    importer = msg.sender;
    exporter = _exporter;
    totalAmount = _amount;
    
    // Set milestone payment percentages
    milestonePayment[1] = 15; // Production verification
    milestonePayment[2] = 20; // Port departure
    milestonePayment[3] = 0;  // Ocean transit
    milestonePayment[4] = 20; // Port arrival
    milestonePayment[5] = 45; // Final delivery
  }
  
  function verifyMilestone(uint8 milestone, bytes calldata oracleSignature) external {
    require(isValidOracle(msg.sender), "Not authorized oracle");
    require(!milestoneCompleted[milestone], "Milestone already verified");
    require(validateSignature(oracleSignature), "Invalid oracle signature");
    
    milestoneCompleted[milestone] = true;
    uint256 paymentAmount = (totalAmount * milestonePayment[milestone]) / 100;
    
    if(paymentAmount > 0) {
      // Release payment to exporter
      payable(exporter).transfer(paymentAmount);
      emit PaymentReleased(milestone, paymentAmount);
    }
    
    emit MilestoneVerified(milestone);
  }
  
  // Additional contract functions...
}`,
        }
        setTransactionData(mockData)
        setIsLoading(false)
      }, 1500)
    }

    fetchData()
  }, [transaction])

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (autoPlaying && transactionData) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < transactionData.verificationSteps.length) {
            return prev + 1
          }
          setAutoPlaying(false)
          return prev
        })
      }, animationSpeeds[animationSpeed])
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoPlaying, transactionData, animationSpeed, animationSpeeds])

  const handleStart = () => {
    setCurrentStep(0)
    setAutoPlaying(true)
  }

  const handleStop = () => {
    setAutoPlaying(false)
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
    setAutoPlaying(false)
  }

  if (isLoading) {
    return (
      <div className="smart-contract-demo loading">
        <Spinner />
        <p>Loading demonstration...</p>
      </div>
    )
  }

  if (!transactionData) {
    return (
      <div className="smart-contract-demo error">
        <p>Error loading transaction data. Please check the configuration.</p>
      </div>
    )
  }

  const {
    title,
    contractAddress,
    exporter,
    importer,
    product,
    amount,
    currency,
    status,
    verificationSteps,
    smartContractCode,
  } = transactionData

  // Calculate progress
  const completedSteps = verificationSteps.filter((step) => step.status === 'verified').length
  const totalSteps = verificationSteps.length

  // Safety check for current step
  const currentStepData =
    currentStep < verificationSteps.length ? verificationSteps[currentStep] : null

  return (
    <div className="smart-contract-demo">
      {heading && <h2 className="smart-contract-demo__heading">{heading}</h2>}
      {description && <p className="smart-contract-demo__description">{description}</p>}

      <div className="smart-contract-demo__transaction-info">
        <h3>Transaction: {title}</h3>
        <div className="smart-contract-demo__details">
          <div>
            <strong>Exporter:</strong>{' '}
            {typeof exporter === 'object' && 'name' in exporter ? exporter.name : 'Loading...'}
          </div>
          <div>
            <strong>Importer:</strong>{' '}
            {typeof importer === 'object' && 'name' in importer ? importer.name : 'Loading...'}
          </div>
          <div>
            <strong>Product:</strong> {product}
          </div>
          <div>
            <strong>Amount:</strong> {amount} {currency.toUpperCase()}
          </div>
          <div>
            <strong>Status:</strong> {status}
          </div>
        </div>
      </div>

      <div className="smart-contract-demo__visualizer">
        <SmartContractVisualizer
          contractAddress={contractAddress}
          contractCode={smartContractCode}
          showCode={showTechnicalDetails}
          status={status}
          completedSteps={completedSteps}
          totalSteps={totalSteps}
        />
      </div>

      <div className="smart-contract-demo__timeline">
        <div className="smart-contract-demo__controls">
          {interactiveMode !== 'manual' && (
            <>
              <button
                onClick={handleStart}
                disabled={autoPlaying}
                className="smart-contract-demo__button"
              >
                Start Demo
              </button>
              <button
                onClick={handleStop}
                disabled={!autoPlaying}
                className="smart-contract-demo__button"
              >
                Pause
              </button>
            </>
          )}

          {interactiveMode !== 'auto' && (
            <div className="smart-contract-demo__step-controls">
              {verificationSteps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => handleStepChange(index)}
                  className={`smart-contract-demo__step-button ${currentStep === index ? 'active' : ''}`}
                >
                  {index + 1}. {step.stepName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="smart-contract-demo__step-content">
          {currentStepData ? (
            <OracleVerificationCard
              title={currentStepData.stepName}
              timestamp={currentStepData.timestamp || ''}
              evidenceType={currentStepData.evidenceType || 'document'}
              evidence={currentStepData.evidence}
              verified={currentStepData.status === 'verified'}
              verifier={currentStepData.verifiedBy || ''}
              paymentReleased={currentStepData.paymentReleased || 0}
              showCode={showTechnicalDetails}
              oracleCode={currentStepData.oracleInteraction}
              contractCode={currentStepData.contractCode}
            />
          ) : (
            <div className="smart-contract-demo__completed">
              <h3>Transaction Complete</h3>
              <p>All verification steps have been completed.</p>
              <div className="smart-contract-demo__stats">
                <div className="smart-contract-demo__stat-item">
                  <strong>Processing Time:</strong> 48 hours
                </div>
                <div className="smart-contract-demo__stat-item">
                  <strong>Cost Savings:</strong> 35% vs traditional methods
                </div>
                <div className="smart-contract-demo__stat-item">
                  <strong>Oracle Verifications:</strong> {completedSteps}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
