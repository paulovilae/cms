import type { Payload } from 'payload'

export const seedDonHugoPeanutTransaction = async (
  payload: Payload,
  companyMap: Record<string, any>,
  routeMap: Record<string, any>,
) => {
  // Don Hugo Peanut Export - In Progress Status
  const donHugoExport = await payload.create({
    collection: 'export-transactions',
    data: {
      title: 'Don Hugo Peanut Export - Batch #1',
      contractAddress: '0x7a3E8F126a5D91C58EA6F53EaB37C6439E63F1F9',
      exporter: companyMap['Don Hugo Farms'],
      importer: companyMap['Global Nut Distributors Ltd.'],
      product: 'Premium Grade A Peanuts',
      amount: 75000,
      currency: 'usdc',
      status: 'in-progress',
      productDetails: {
        name: 'Premium Grade A Peanuts',
        description:
          'High-quality premium peanuts for commercial food processing, carefully harvested and sorted to ensure consistent size and quality.',
        category: 'agricultural',
        quantity: 25,
        unitOfMeasurement: 'mt',
        weight: 25000,
        weightUnit: 'kg',
        dimensions: '40ft container standard load',
        hazardousClassification: 'None - Food grade product',
      },
      routeInformation: {
        route: routeMap['Argentina to USA - Main Shipping Lane'],
        originPort: 'Puerto de Buenos Aires',
        destinationPort: 'Port of Los Angeles',
        estimatedDepartureDate: '2025-04-15T00:00:00Z',
        estimatedArrivalDate: '2025-05-12T00:00:00Z',
        actualDepartureDate: '2025-04-18T14:05:12Z',
        transitTime: 26,
      },
      shippingDetails: {
        carrier: 'Maersk Line',
        vesselName: 'Maersk Semarang',
        voyageNumber: 'MS254-E',
        containerNumbers: [
          {
            number: 'MSCU1234567',
            type: '40ft-standard',
          },
          {
            number: 'MSCU7654321',
            type: '40ft-standard',
          },
        ],
        sealNumbers: [
          {
            number: 'ML45678912',
            type: 'carrier',
          },
          {
            number: 'DHF23456789',
            type: 'shipper',
          },
        ],
        shipmentType: 'fcl',
        incoterms: 'fob',
        insuranceProvider: 'Global Trade Insurance Corp.',
        insuranceValue: 82500,
      },
      documentReferences: {
        commercialInvoice: 'CI-DH2025-04321',
        billOfLading: 'BL-MS254E-1234',
        packingList: 'PL-DH2025-04321',
        certificateOfOrigin: 'CO-ARG-2025-7890',
        insurancePolicy: 'IP-GTI-456789',
        inspectionCertificate: 'IC-SGS-AR-123456',
        exportLicense: 'EL-ARG-AG-987654',
        importLicense: 'IL-US-AG-345678',
        customsDeclaration: 'CD-US-LA-567890',
        documents: [
          {
            documentType: 'commercial-invoice',
            referenceNumber: 'CI-DH2025-04321',
            issueDate: '2025-04-10T00:00:00Z',
            issuer: 'Don Hugo Farms',
            verificationStatus: 'verified',
          },
          {
            documentType: 'bill-of-lading',
            referenceNumber: 'BL-MS254E-1234',
            issueDate: '2025-04-18T00:00:00Z',
            issuer: 'Maersk Line',
            verificationStatus: 'verified',
          },
          {
            documentType: 'certificate-of-origin',
            referenceNumber: 'CO-ARG-2025-7890',
            issueDate: '2025-04-12T00:00:00Z',
            issuer: 'Argentina Chamber of Commerce',
            verificationStatus: 'verified',
          },
          {
            documentType: 'inspection-certificate',
            referenceNumber: 'IC-SGS-AR-123456',
            issueDate: '2025-04-08T00:00:00Z',
            issuer: 'SGS Argentina',
            verificationStatus: 'verified',
          },
          {
            documentType: 'export-license',
            referenceNumber: 'EL-ARG-AG-987654',
            issueDate: '2025-04-01T00:00:00Z',
            issuer: 'Argentina Ministry of Trade',
            verificationStatus: 'verified',
          },
          {
            documentType: 'import-license',
            referenceNumber: 'IL-US-AG-345678',
            issueDate: '2025-04-05T00:00:00Z',
            issuer: 'US Department of Agriculture',
            verificationStatus: 'verified',
          },
        ],
      },
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description: 'Verification of peanut production at Don Hugo Farms facility',
          status: 'verified',
          verifiedBy: 'Oracle Node #452',
          timestamp: '2025-04-12T10:23:45Z',
          paymentReleased: 15,
          location: 'Córdoba, Argentina',
          gpsCoordinates: '-31.4201,-64.1888',
          evidenceType: 'photo',
          verificationMethod: 'automated-oracle',
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
          transactionHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
          dataPoints: [
            {
              dataType: 'location',
              value: '-31.4201,-64.1888',
              unit: 'coordinates',
              source: 'GPS Tracker #DH-456',
              timestamp: '2025-04-12T10:22:30Z',
            },
            {
              dataType: 'timestamp',
              value: '1744956150',
              unit: 'unix',
              source: 'Blockchain Oracle',
              timestamp: '2025-04-12T10:22:30Z',
            },
            {
              dataType: 'weight',
              value: '25000',
              unit: 'kg',
              source: 'Facility Scale',
              timestamp: '2025-04-12T09:45:12Z',
            },
          ],
        } as any,
        {
          stepName: 'Port of Origin Departure',
          description: 'Verification of goods arrival and loading at Puerto de Buenos Aires',
          status: 'verified',
          verifiedBy: 'Oracle Node #387',
          timestamp: '2025-04-18T14:05:12Z',
          paymentReleased: 20,
          location: 'Puerto de Buenos Aires, Argentina',
          gpsCoordinates: '-34.5555,-58.3695',
          evidenceType: 'document',
          verificationMethod: 'document-verification',
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
          transactionHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
          dataPoints: [
            {
              dataType: 'document-hash',
              value: '0x7a3E8F126a5D91C58EA6F53EaB37C6439E63F1F9',
              unit: 'hash',
              source: 'Port Authority System',
              timestamp: '2025-04-18T14:03:45Z',
            },
            {
              dataType: 'location',
              value: '-34.5555,-58.3695',
              unit: 'coordinates',
              source: 'Port Authority GPS',
              timestamp: '2025-04-18T14:00:22Z',
            },
          ],
        } as any,
        {
          stepName: 'Ocean Transit Tracking',
          description: 'Verification of container location during ocean transit',
          status: 'verified',
          verifiedBy: 'Oracle Node #129',
          timestamp: '2025-05-02T08:34:27Z',
          paymentReleased: 0,
          location: 'Pacific Ocean',
          gpsCoordinates: '1.2345,-120.5678',
          evidenceType: 'gps',
          verificationMethod: 'automated-oracle',
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
          transactionHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
          dataPoints: [
            {
              dataType: 'location',
              value: '1.2345,-120.5678',
              unit: 'coordinates',
              source: 'Vessel AIS Tracker',
              timestamp: '2025-05-02T08:34:00Z',
            },
            {
              dataType: 'temperature',
              value: '22.5',
              unit: 'celsius',
              source: 'Container IoT Sensor',
              timestamp: '2025-05-02T08:32:15Z',
            },
            {
              dataType: 'humidity',
              value: '45',
              unit: 'percentage',
              source: 'Container IoT Sensor',
              timestamp: '2025-05-02T08:32:15Z',
            },
          ],
        } as any,
        {
          stepName: 'Arrival at Destination Port',
          description: 'Verification of arrival at Port of Los Angeles',
          status: 'verified',
          verifiedBy: 'Oracle Node #256',
          timestamp: '2025-05-15T16:42:09Z',
          paymentReleased: 20,
          location: 'Port of Los Angeles, USA',
          gpsCoordinates: '33.7395,-118.2610',
          evidenceType: 'document',
          verificationMethod: 'document-verification',
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
          transactionHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
          dataPoints: [
            {
              dataType: 'document-hash',
              value: '0x8b3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E0F',
              unit: 'hash',
              source: 'US Customs and Border Protection',
              timestamp: '2025-05-15T16:40:30Z',
            },
            {
              dataType: 'location',
              value: '33.7395,-118.2610',
              unit: 'coordinates',
              source: 'Port Authority GPS',
              timestamp: '2025-05-15T16:35:12Z',
            },
          ],
        } as any,
        {
          stepName: 'Final Delivery Verification',
          description: 'Verification of delivery to Global Nut Distributors warehouse',
          status: 'pending',
          location: 'Sacramento, California, USA',
          gpsCoordinates: '38.5816,-121.4944',
          evidenceType: 'multiple',
          verificationMethod: 'multi-signature',
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
      slug: 'don-hugo-peanut-export-batch-1',
    } as any,
  })

  return donHugoExport
}
