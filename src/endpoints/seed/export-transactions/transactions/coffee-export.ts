import type { Payload } from 'payload'

export const seedCoffeeExportTransaction = async (
  payload: Payload,
  companyMap: Record<string, any>,
  routeMap: Record<string, any>,
) => {
  // Global Coffee Export - Completed Status
  const coffeeExport = await payload.create({
    collection: 'export-transactions',
    data: {
      title: 'Global Coffee Export - Colombia to Japan',
      contractAddress: '0x8b3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E0F',
      exporter: companyMap['Colombian Coffee Cooperative'],
      importer: companyMap['Tokyo Bean Trading Co.'],
      product: 'Premium Arabica Coffee Beans',
      amount: 120000,
      currency: 'usdc',
      status: 'completed',
      productDetails: {
        name: 'Premium Arabica Coffee Beans',
        description:
          'Single-origin premium Arabica coffee beans from the Colombian highlands, medium roast.',
        category: 'food-beverages',
        quantity: 15,
        unitOfMeasurement: 'mt',
        weight: 15000,
        weightUnit: 'kg',
        dimensions: '20ft container standard load',
        hazardousClassification: 'None - Food grade product',
      },
      routeInformation: {
        route: routeMap['Colombia to Japan - Trans-Pacific Route'],
        originPort: 'Puerto de Cartagena',
        destinationPort: 'Port of Tokyo',
        estimatedDepartureDate: '2025-03-15T00:00:00Z',
        estimatedArrivalDate: '2025-04-16T00:00:00Z',
        actualDepartureDate: '2025-03-18T11:42:18Z',
        actualArrivalDate: '2025-04-15T09:18:32Z',
        transitTime: 32,
      },
      shippingDetails: {
        carrier: 'ONE (Ocean Network Express)',
        vesselName: 'ONE Commitment',
        voyageNumber: 'OC128-W',
        containerNumbers: [
          {
            number: 'ONEU9876543',
            type: '20ft-standard',
          },
        ],
        sealNumbers: [
          {
            number: 'ONE65432198',
            type: 'carrier',
          },
          {
            number: 'CCC12345678',
            type: 'shipper',
          },
        ],
        shipmentType: 'fcl',
        incoterms: 'cif',
        insuranceProvider: 'Pacific Marine Insurance Ltd.',
        insuranceValue: 140000,
      },
      documentReferences: {
        commercialInvoice: 'CI-CCC2025-12345',
        billOfLading: 'BL-OC128W-5678',
        packingList: 'PL-CCC2025-12345',
        certificateOfOrigin: 'CO-COL-2025-54321',
        insurancePolicy: 'IP-PMI-789012',
        inspectionCertificate: 'IC-COFFEEQ-COL-98765',
        exportLicense: 'EL-COL-FB-654321',
        importLicense: 'IL-JPN-FB-123456',
        customsDeclaration: 'CD-JPN-TKY-987654',
        documents: [
          {
            documentType: 'commercial-invoice',
            referenceNumber: 'CI-CCC2025-12345',
            issueDate: '2025-03-10T00:00:00Z',
            issuer: 'Colombian Coffee Cooperative',
            verificationStatus: 'verified',
          },
          {
            documentType: 'bill-of-lading',
            referenceNumber: 'BL-OC128W-5678',
            issueDate: '2025-03-18T00:00:00Z',
            issuer: 'ONE (Ocean Network Express)',
            verificationStatus: 'verified',
          },
          {
            documentType: 'certificate-of-origin',
            referenceNumber: 'CO-COL-2025-54321',
            issueDate: '2025-03-12T00:00:00Z',
            issuer: 'Colombia Chamber of Commerce',
            verificationStatus: 'verified',
          },
          {
            documentType: 'insurance-policy',
            referenceNumber: 'IP-PMI-789012',
            issueDate: '2025-03-14T00:00:00Z',
            issuer: 'Pacific Marine Insurance Ltd.',
            verificationStatus: 'verified',
          },
          {
            documentType: 'packing-list',
            referenceNumber: 'PL-CCC2025-12345',
            issueDate: '2025-03-10T00:00:00Z',
            issuer: 'Colombian Coffee Cooperative',
            verificationStatus: 'verified',
          },
          {
            documentType: 'customs-declaration',
            referenceNumber: 'CD-JPN-TKY-987654',
            issueDate: '2025-04-14T00:00:00Z',
            issuer: 'Japan Customs',
            verificationStatus: 'verified',
          },
        ],
      },
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description: 'Verification of coffee bean production at Colombian farms',
          status: 'verified',
          verifiedBy: 'Oracle Node #217',
          timestamp: '2025-03-12T08:15:30Z',
          paymentReleased: 15,
          location: 'Medellín, Colombia',
          gpsCoordinates: '6.2476,-75.5658',
          evidenceType: 'photo',
          verificationMethod: 'automated-oracle',
          contractCode: `function verifyProduction(bytes32 photoHash, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredFacility(lat, long), "Location not registered");
  require(validatePhotoHash(photoHash), "Invalid photo evidence");
  verifyMilestone(1, generateSignature(photoHash, timestamp, lat, long));
}`,
          oracleInteraction: `// Oracle verification code
const photoEvidence = await retrieveEvidence('photo-987654');
const gpsData = await retrieveGPS('device-123456');

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
          transactionHash: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
          dataPoints: [
            {
              dataType: 'location',
              value: '6.2476,-75.5658',
              unit: 'coordinates',
              source: 'GPS Tracker #CC-789',
              timestamp: '2025-03-12T08:14:15Z',
            },
            {
              dataType: 'timestamp',
              value: '1742002430',
              unit: 'unix',
              source: 'Blockchain Oracle',
              timestamp: '2025-03-12T08:14:15Z',
            },
            {
              dataType: 'weight',
              value: '15000',
              unit: 'kg',
              source: 'Facility Scale',
              timestamp: '2025-03-12T07:45:22Z',
            },
          ],
        } as any,
        {
          stepName: 'Port of Origin Departure',
          description: 'Verification of goods arrival and loading at Puerto de Cartagena',
          status: 'verified',
          verifiedBy: 'Oracle Node #189',
          timestamp: '2025-03-18T11:42:18Z',
          paymentReleased: 20,
          location: 'Puerto de Cartagena, Colombia',
          gpsCoordinates: '10.4113,-75.5475',
          evidenceType: 'document',
          verificationMethod: 'document-verification',
          contractCode: `function verifyPortDeparture(bytes32 documentHash, uint256 timestamp, bytes32 billOfLadingId) {
  require(validateDocument(documentHash, "billOfLading"), "Invalid document");
  require(validatePortAuthority(billOfLadingId), "Port authority verification failed");
  verifyMilestone(2, generateSignature(documentHash, timestamp, billOfLadingId));
}`,
          oracleInteraction: `// Oracle verification code
const billOfLading = await retrieveDocument('bol-987654');
const portAuthorityConfirmation = await queryPortAuthority('shipment-654321');

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
          transactionHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
          dataPoints: [
            {
              dataType: 'document-hash',
              value: '0x9a8E7F126b5C91D58EA6F53EaC37C6439E63F2E0',
              unit: 'hash',
              source: 'Port Authority System',
              timestamp: '2025-03-18T11:40:22Z',
            },
            {
              dataType: 'location',
              value: '10.4113,-75.5475',
              unit: 'coordinates',
              source: 'Port Authority GPS',
              timestamp: '2025-03-18T11:35:45Z',
            },
          ],
        } as any,
        {
          stepName: 'Ocean Transit Tracking',
          description: 'Verification of container location during ocean transit',
          status: 'verified',
          verifiedBy: 'Oracle Node #352',
          timestamp: '2025-04-02T14:22:45Z',
          paymentReleased: 0,
          location: 'Pacific Ocean',
          gpsCoordinates: '20.1234,165.4321',
          evidenceType: 'gps',
          verificationMethod: 'automated-oracle',
          contractCode: `function verifyTransitLocation(bytes32 vesselId, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredVessel(vesselId), "Unknown vessel");
  require(isOnCourse(vesselId, lat, long), "Vessel off expected course");
  // No payment released, just update status
  logTransitUpdate(3, generateSignature(vesselId, timestamp, lat, long));
}`,
          oracleInteraction: `// Oracle verification code
const vesselData = await retrieveVesselData('vessel-123456');
const routeData = await retrieveShippingRoute('route-654321');

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
          transactionHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
          dataPoints: [
            {
              dataType: 'location',
              value: '20.1234,165.4321',
              unit: 'coordinates',
              source: 'Vessel AIS Tracker',
              timestamp: '2025-04-02T14:21:30Z',
            },
            {
              dataType: 'temperature',
              value: '21.2',
              unit: 'celsius',
              source: 'Container IoT Sensor',
              timestamp: '2025-04-02T14:20:15Z',
            },
            {
              dataType: 'humidity',
              value: '43',
              unit: 'percentage',
              source: 'Container IoT Sensor',
              timestamp: '2025-04-02T14:20:15Z',
            },
          ],
        } as any,
        {
          stepName: 'Arrival at Destination Port',
          description: 'Verification of arrival at Port of Tokyo',
          status: 'verified',
          verifiedBy: 'Oracle Node #093',
          timestamp: '2025-04-15T09:18:32Z',
          paymentReleased: 20,
          location: 'Port of Tokyo, Japan',
          gpsCoordinates: '35.6894,139.6917',
          evidenceType: 'document',
          verificationMethod: 'document-verification',
          contractCode: `function verifyPortArrival(bytes32 documentHash, uint256 timestamp, bytes32 customsId) {
  require(validateDocument(documentHash, "importDeclaration"), "Invalid document");
  require(validateCustomsAuthority(customsId), "Customs verification failed");
  verifyMilestone(4, generateSignature(documentHash, timestamp, customsId));
}`,
          oracleInteraction: `// Oracle verification code
const importDeclaration = await retrieveDocument('import-234567');
const customsConfirmation = await queryCustomsAuthority('shipment-654321');

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
          transactionHash: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
          dataPoints: [
            {
              dataType: 'document-hash',
              value: '0xAb3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E1A',
              unit: 'hash',
              source: 'Japan Customs',
              timestamp: '2025-04-15T09:15:45Z',
            },
            {
              dataType: 'location',
              value: '35.6894,139.6917',
              unit: 'coordinates',
              source: 'Port Authority GPS',
              timestamp: '2025-04-15T09:10:22Z',
            },
          ],
        } as any,
        {
          stepName: 'Final Delivery Verification',
          description: 'Verification of delivery to Tokyo Bean Trading warehouse',
          status: 'verified',
          verifiedBy: 'Oracle Node #127',
          timestamp: '2025-04-17T10:45:27Z',
          paymentReleased: 45,
          location: 'Tokyo, Japan',
          gpsCoordinates: '35.6894,139.6917',
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
const deliveryReceipt = await retrieveDocument('receipt-345678');
const qualityReport = await retrieveDocument('quality-456789');

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
          transactionHash: '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
          dataPoints: [
            {
              dataType: 'location',
              value: '35.6894,139.6917',
              unit: 'coordinates',
              source: 'Warehouse GPS System',
              timestamp: '2025-04-17T10:40:15Z',
            },
            {
              dataType: 'weight',
              value: '14975',
              unit: 'kg',
              source: 'Warehouse Scale',
              timestamp: '2025-04-17T10:30:45Z',
            },
            {
              dataType: 'document-hash',
              value: '0xBc4F9D12E8A0E2D44d9F4B1F6A2C1E7F8b9D9E2B',
              unit: 'hash',
              source: 'Tokyo Bean QA System',
              timestamp: '2025-04-17T10:42:18Z',
            },
          ],
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
      slug: 'global-coffee-export-colombia-to-japan',
    } as any,
  })

  return coffeeExport
}
