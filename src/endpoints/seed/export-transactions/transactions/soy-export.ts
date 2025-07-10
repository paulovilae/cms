import type { Payload } from 'payload'

export const seedSoyExportTransaction = async (
  payload: Payload,
  companyMap: Record<string, any>,
  routeMap: Record<string, any>,
) => {
  // Brazilian Soy Export - Created Status (New Transaction)
  const soyExport = await payload.create({
    collection: 'export-transactions',
    data: {
      title: 'Brazilian Soy Export - Batch #147',
      contractAddress: '0x5D9E8F126A5D91C58EA6F53EAB37C6439E63F2E8',
      exporter: companyMap['Brazilian Soy Enterprises'],
      importer: companyMap['European Organics GmbH'],
      product: 'Non-GMO Organic Soybeans',
      amount: 185000,
      currency: 'usdc',
      status: 'created',
      productDetails: {
        name: 'Non-GMO Organic Soybeans',
        description:
          'Premium organic soybeans, non-GMO certified, grown using sustainable farming practices in the Mato Grosso region of Brazil.',
        category: 'agricultural',
        quantity: 60,
        unitOfMeasurement: 'mt',
        weight: 60000,
        weightUnit: 'kg',
        dimensions: 'Two 40ft containers standard load',
        hazardousClassification: 'None - Food grade product',
      },
      routeInformation: {
        route: routeMap['Brazil to Rotterdam - Atlantic Crossing'],
        originPort: 'Port of Santos',
        destinationPort: 'Port of Rotterdam',
        estimatedDepartureDate: '2025-07-10T00:00:00Z',
        estimatedArrivalDate: '2025-07-26T00:00:00Z',
        transitTime: 16,
      },
      shippingDetails: {
        carrier: 'CMA CGM',
        vesselName: 'CMA CGM Palais Royal',
        voyageNumber: 'CPR072-E',
        containerNumbers: [
          {
            number: 'CMAU5678912',
            type: '40ft-standard',
          },
          {
            number: 'CMAU3456789',
            type: '40ft-standard',
          },
        ],
        sealNumbers: [
          {
            number: 'CMA78901234',
            type: 'carrier',
          },
          {
            number: 'BSE45678901',
            type: 'shipper',
          },
        ],
        shipmentType: 'fcl',
        incoterms: 'fob',
        insuranceProvider: 'European Marine Insurance Ltd.',
        insuranceValue: 203500,
      },
      documentReferences: {
        commercialInvoice: 'CI-BSE2025-0147',
        billOfLading: '',
        packingList: 'PL-BSE2025-0147',
        certificateOfOrigin: 'CO-BR-2025-12345',
        insurancePolicy: 'IP-EMI-234567',
        inspectionCertificate: 'IC-ORGCERT-BR-56789',
        exportLicense: 'EL-BR-AG-567890',
        importLicense: 'IL-EU-AG-123456',
        customsDeclaration: '',
        documents: [
          {
            documentType: 'commercial-invoice',
            referenceNumber: 'CI-BSE2025-0147',
            issueDate: '2025-06-28T00:00:00Z',
            issuer: 'Brazilian Soy Enterprises',
            verificationStatus: 'verified',
          },
          {
            documentType: 'packing-list',
            referenceNumber: 'PL-BSE2025-0147',
            issueDate: '2025-06-28T00:00:00Z',
            issuer: 'Brazilian Soy Enterprises',
            verificationStatus: 'verified',
          },
          {
            documentType: 'certificate-of-origin',
            referenceNumber: 'CO-BR-2025-12345',
            issueDate: '2025-06-30T00:00:00Z',
            issuer: 'Brazil Chamber of Commerce',
            verificationStatus: 'pending',
          },
          {
            documentType: 'inspection-certificate',
            referenceNumber: 'IC-ORGCERT-BR-56789',
            issueDate: '2025-06-25T00:00:00Z',
            issuer: 'Organic Certification Brazil',
            verificationStatus: 'verified',
          },
          {
            documentType: 'export-license',
            referenceNumber: 'EL-BR-AG-567890',
            issueDate: '2025-06-20T00:00:00Z',
            issuer: 'Brazil Ministry of Agriculture',
            verificationStatus: 'verified',
          },
          {
            documentType: 'import-license',
            referenceNumber: 'IL-EU-AG-123456',
            issueDate: '2025-06-15T00:00:00Z',
            issuer: 'European Union Agricultural Authority',
            verificationStatus: 'verified',
          },
        ],
      },
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description:
            'Verification of soybean harvest and processing at Brazilian Soy Enterprises facility',
          status: 'pending',
          location: 'Sorriso, Mato Grosso, Brazil',
          gpsCoordinates: '-12.5452,-55.7211',
          evidenceType: 'photo',
          verificationMethod: 'automated-oracle',
          contractCode: `function verifyProduction(bytes32 photoHash, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredFacility(lat, long), "Location not registered");
  require(validatePhotoHash(photoHash), "Invalid photo evidence");
  verifyMilestone(1, generateSignature(photoHash, timestamp, lat, long));
}`,
          oracleInteraction: `// Oracle verification code
const photoEvidence = await retrieveEvidence('photo-pending');
const gpsData = await retrieveGPS('device-pending');

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
        } as any,
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
      slug: 'brazilian-soy-export-batch-147',
    } as any,
  })

  return soyExport
}
