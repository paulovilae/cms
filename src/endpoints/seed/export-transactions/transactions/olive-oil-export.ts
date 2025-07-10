import type { Payload } from 'payload'

export const seedOliveOilExportTransaction = async (
  payload: Payload,
  companyMap: Record<string, any>,
  routeMap: Record<string, any>,
) => {
  // Mediterranean Olive Oil - Partial Verification Status (New Transaction)
  const oliveOilExport = await payload.create({
    collection: 'export-transactions',
    data: {
      title: 'Mediterranean Olive Oil Export - Batch #32',
      contractAddress: '0x3F9E8F126A5D91C58EA6F53EAB37C6439E63A1D7',
      exporter: companyMap['Mediterranean Traders S.A.'],
      importer: companyMap['Global Nut Distributors Ltd.'],
      product: 'Extra Virgin Olive Oil - Premium Grade',
      amount: 95000,
      currency: 'usdc',
      status: 'in-progress',
      productDetails: {
        name: 'Extra Virgin Olive Oil - Premium Grade',
        description:
          'Premium cold-pressed extra virgin olive oil from Spanish coastal groves, featuring robust flavor profiles with peppery finish, suitable for gourmet applications.',
        category: 'food-beverages',
        quantity: 12000,
        unitOfMeasurement: 'units',
        weight: 11760,
        weightUnit: 'kg',
        dimensions: 'Pallet configuration: 120x100x120cm, 12 pallets total',
        hazardousClassification: 'None - Food grade product',
      },
      routeInformation: {
        route: routeMap['Argentina to USA - Main Shipping Lane'],
        originPort: 'Port of Barcelona',
        destinationPort: 'Port of Los Angeles',
        estimatedDepartureDate: '2025-05-05T00:00:00Z',
        estimatedArrivalDate: '2025-05-28T00:00:00Z',
        actualDepartureDate: '2025-05-07T09:32:45Z',
        transitTime: 23,
      },
      shippingDetails: {
        carrier: 'MSC',
        vesselName: 'MSC Grandiosa',
        voyageNumber: 'MSG135-W',
        containerNumbers: [
          {
            number: 'MSCU7890123',
            type: '20ft-standard',
          },
        ],
        sealNumbers: [
          {
            number: 'MSC12345678',
            type: 'carrier',
          },
          {
            number: 'MTS98765432',
            type: 'shipper',
          },
        ],
        shipmentType: 'fcl',
        incoterms: 'cif',
        insuranceProvider: 'Mediterranean Shipping Insurance',
        insuranceValue: 110000,
      },
      documentReferences: {
        commercialInvoice: 'CI-MTS2025-0032',
        billOfLading: 'BL-MSG135W-7890',
        packingList: 'PL-MTS2025-0032',
        certificateOfOrigin: 'CO-ESP-2025-34567',
        insurancePolicy: 'IP-MSI-345678',
        inspectionCertificate: 'IC-EVOO-ESP-67890',
        exportLicense: 'EL-ESP-FB-678901',
        importLicense: 'IL-US-FB-456789',
        customsDeclaration: '',
        documents: [
          {
            documentType: 'commercial-invoice',
            referenceNumber: 'CI-MTS2025-0032',
            issueDate: '2025-05-02T00:00:00Z',
            issuer: 'Mediterranean Traders S.A.',
            verificationStatus: 'verified',
          },
          {
            documentType: 'bill-of-lading',
            referenceNumber: 'BL-MSG135W-7890',
            issueDate: '2025-05-07T00:00:00Z',
            issuer: 'MSC',
            verificationStatus: 'verified',
          },
          {
            documentType: 'certificate-of-origin',
            referenceNumber: 'CO-ESP-2025-34567',
            issueDate: '2025-05-03T00:00:00Z',
            issuer: 'Spain Chamber of Commerce',
            verificationStatus: 'verified',
          },
          {
            documentType: 'packing-list',
            referenceNumber: 'PL-MTS2025-0032',
            issueDate: '2025-05-02T00:00:00Z',
            issuer: 'Mediterranean Traders S.A.',
            verificationStatus: 'verified',
          },
          {
            documentType: 'inspection-certificate',
            referenceNumber: 'IC-EVOO-ESP-67890',
            issueDate: '2025-04-30T00:00:00Z',
            issuer: 'Spanish Food Quality Authority',
            verificationStatus: 'verified',
          },
          {
            documentType: 'export-license',
            referenceNumber: 'EL-ESP-FB-678901',
            issueDate: '2025-04-25T00:00:00Z',
            issuer: 'Spain Ministry of Commerce',
            verificationStatus: 'verified',
          },
        ],
      },
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description: 'Verification of olive oil production at Mediterranean Traders facility',
          status: 'verified',
          verifiedBy: 'Oracle Node #324',
          timestamp: '2025-05-04T11:35:22Z',
          paymentReleased: 15,
          location: 'Barcelona, Spain',
          gpsCoordinates: '41.3851,2.1734',
          evidenceType: 'photo',
          verificationMethod: 'automated-oracle',
          contractCode: `function verifyProduction(bytes32 photoHash, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredFacility(lat, long), "Location not registered");
  require(validatePhotoHash(photoHash), "Invalid photo evidence");
  verifyMilestone(1, generateSignature(photoHash, timestamp, lat, long));
}`,
          oracleInteraction: `// Oracle verification code
const photoEvidence = await retrieveEvidence('photo-543210');
const gpsData = await retrieveGPS('device-987654');

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
          transactionHash: '0x5E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F',
          dataPoints: [
            {
              dataType: 'location',
              value: '41.3851,2.1734',
              unit: 'coordinates',
              source: 'GPS Tracker #MT-123',
              timestamp: '2025-05-04T11:30:45Z',
            },
            {
              dataType: 'timestamp',
              value: '1746464122',
              unit: 'unix',
              source: 'Blockchain Oracle',
              timestamp: '2025-05-04T11:30:45Z',
            },
            {
              dataType: 'weight',
              value: '11760',
              unit: 'kg',
              source: 'Facility Scale',
              timestamp: '2025-05-04T10:15:33Z',
            },
          ],
        } as any,
        {
          stepName: 'Port of Origin Departure',
          description: 'Verification of goods arrival and loading at Port of Barcelona',
          status: 'verified',
          verifiedBy: 'Oracle Node #421',
          timestamp: '2025-05-07T09:32:45Z',
          paymentReleased: 20,
          location: 'Port of Barcelona, Spain',
          gpsCoordinates: '41.3485,2.1450',
          evidenceType: 'document',
          verificationMethod: 'document-verification',
          contractCode: `function verifyPortDeparture(bytes32 documentHash, uint256 timestamp, bytes32 billOfLadingId) {
  require(validateDocument(documentHash, "billOfLading"), "Invalid document");
  require(validatePortAuthority(billOfLadingId), "Port authority verification failed");
  verifyMilestone(2, generateSignature(documentHash, timestamp, billOfLadingId));
}`,
          oracleInteraction: `// Oracle verification code
const billOfLading = await retrieveDocument('bol-234567');
const portAuthorityConfirmation = await queryPortAuthority('shipment-876543');

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
          transactionHash: '0x1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2',
          dataPoints: [
            {
              dataType: 'document-hash',
              value: '0x4D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E',
              unit: 'hash',
              source: 'Port Authority System',
              timestamp: '2025-05-07T09:30:12Z',
            },
            {
              dataType: 'location',
              value: '41.3485,2.1450',
              unit: 'coordinates',
              source: 'Port Authority GPS',
              timestamp: '2025-05-07T09:25:33Z',
            },
          ],
        } as any,
        {
          stepName: 'Ocean Transit Tracking',
          description: 'Verification of container location during ocean transit',
          status: 'verified',
          verifiedBy: 'Oracle Node #178',
          timestamp: '2025-05-18T13:45:22Z',
          paymentReleased: 0,
          location: 'Atlantic Ocean',
          gpsCoordinates: '36.5412,-40.2318',
          evidenceType: 'gps',
          verificationMethod: 'automated-oracle',
          contractCode: `function verifyTransitLocation(bytes32 vesselId, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredVessel(vesselId), "Unknown vessel");
  require(isOnCourse(vesselId, lat, long), "Vessel off expected course");
  // No payment released, just update status
  logTransitUpdate(3, generateSignature(vesselId, timestamp, lat, long));
}`,
          oracleInteraction: `// Oracle verification code
const vesselData = await retrieveVesselData('vessel-456789');
const routeData = await retrieveShippingRoute('route-234567');

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
          transactionHash: '0x2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3',
          dataPoints: [
            {
              dataType: 'location',
              value: '36.5412,-40.2318',
              unit: 'coordinates',
              source: 'Vessel AIS Tracker',
              timestamp: '2025-05-18T13:42:30Z',
            },
            {
              dataType: 'temperature',
              value: '19.8',
              unit: 'celsius',
              source: 'Container IoT Sensor',
              timestamp: '2025-05-18T13:40:15Z',
            },
            {
              dataType: 'humidity',
              value: '48',
              unit: 'percentage',
              source: 'Container IoT Sensor',
              timestamp: '2025-05-18T13:40:15Z',
            },
          ],
        } as any,
        {
          stepName: 'Arrival at Destination Port',
          description: 'Verification of arrival at Port of Los Angeles',
          status: 'pending',
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
const importDeclaration = await retrieveDocument('import-pending');
const customsConfirmation = await queryCustomsAuthority('shipment-pending');

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
const deliveryReceipt = await retrieveDocument('receipt-pending');
const qualityReport = await retrieveDocument('quality-pending');

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
      slug: 'mediterranean-olive-oil-export-batch-32',
    } as any,
  })

  return oliveOilExport
}
