import type { Payload } from 'payload'

export interface TransactionData {
  title: string
  contractAddress: string
  exporter: any
  importer: any
  product: string
  amount: number
  currency: string
  status: string
  productDetails: any
  routeInformation: any
  shippingDetails: any
  documentReferences: any
  verificationSteps: any[]
  smartContractCode: string
  slug: string
}

export const createSmartContractCode = () => `// Simplified smart contract code
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
}`

export const createProductDetails = (
  name: string,
  description: string,
  category: string,
  quantity: number,
  unitOfMeasurement: string,
  weight: number,
  weightUnit: string = 'kg',
  dimensions: string,
  hazardousClassification: string = 'None - Food grade product',
) => ({
  name,
  description,
  category,
  quantity,
  unitOfMeasurement,
  weight,
  weightUnit,
  dimensions,
  hazardousClassification,
})

export const createRouteInformation = (
  route: any,
  originPort: string,
  destinationPort: string,
  estimatedDepartureDate: string,
  estimatedArrivalDate: string,
  actualDepartureDate?: string,
  actualArrivalDate?: string,
  transitTime?: number,
) => ({
  route,
  originPort,
  destinationPort,
  estimatedDepartureDate,
  estimatedArrivalDate,
  ...(actualDepartureDate && { actualDepartureDate }),
  ...(actualArrivalDate && { actualArrivalDate }),
  ...(transitTime && { transitTime }),
})

export const createShippingDetails = (
  carrier: string,
  vesselName: string,
  voyageNumber: string,
  containerNumbers: Array<{ number: string; type: string }>,
  sealNumbers: Array<{ number: string; type: string }>,
  shipmentType: string,
  incoterms: string,
  insuranceProvider: string,
  insuranceValue: number,
) => ({
  carrier,
  vesselName,
  voyageNumber,
  containerNumbers,
  sealNumbers,
  shipmentType,
  incoterms,
  insuranceProvider,
  insuranceValue,
})

export const createDocument = (
  documentType: string,
  referenceNumber: string,
  issueDate: string,
  issuer: string,
  verificationStatus: string = 'verified',
) => ({
  documentType,
  referenceNumber,
  issueDate,
  issuer,
  verificationStatus,
})

export const createDocumentReferences = (
  commercialInvoice: string,
  billOfLading: string,
  packingList: string,
  certificateOfOrigin: string,
  insurancePolicy: string,
  inspectionCertificate: string,
  exportLicense: string,
  importLicense: string,
  customsDeclaration: string,
  documents: any[],
) => ({
  commercialInvoice,
  billOfLading,
  packingList,
  certificateOfOrigin,
  insurancePolicy,
  inspectionCertificate,
  exportLicense,
  importLicense,
  customsDeclaration,
  documents,
})

export const generateContractAddress = (): string => {
  return '0x' + Math.random().toString(16).substring(2, 42).padStart(40, '0')
}

export const generateTransactionHash = (): string => {
  return '0x' + Math.random().toString(16).substring(2, 66).padStart(64, '0')
}

export const createTransactionSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const buildTransaction = async (
  payload: Payload,
  transactionData: TransactionData,
): Promise<any> => {
  return await payload.create({
    collection: 'export-transactions',
    data: transactionData as any,
  })
}

// Helper function to create a complete transaction with all required fields
export const createCompleteTransaction = (
  title: string,
  exporter: any,
  importer: any,
  product: string,
  amount: number,
  status: string,
  productDetails: any,
  routeInformation: any,
  shippingDetails: any,
  documentReferences: any,
  verificationSteps: any[],
  currency: string = 'usdc',
): TransactionData => {
  return {
    title,
    contractAddress: generateContractAddress(),
    exporter,
    importer,
    product,
    amount,
    currency,
    status,
    productDetails,
    routeInformation,
    shippingDetails,
    documentReferences,
    verificationSteps,
    smartContractCode: createSmartContractCode(),
    slug: createTransactionSlug(title),
  }
}

// Validation helpers
export const validateTransactionData = (data: TransactionData): string[] => {
  const errors: string[] = []

  if (!data.title) errors.push('Title is required')
  if (!data.exporter) errors.push('Exporter is required')
  if (!data.importer) errors.push('Importer is required')
  if (!data.product) errors.push('Product is required')
  if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than 0')
  if (!data.status) errors.push('Status is required')
  if (!data.productDetails) errors.push('Product details are required')
  if (!data.routeInformation) errors.push('Route information is required')
  if (!data.shippingDetails) errors.push('Shipping details are required')
  if (!data.documentReferences) errors.push('Document references are required')

  return errors
}

export const logTransactionCreation = (title: string, id: any) => {
  console.log(`✅ Created transaction: ${title} (ID: ${id})`)
}
