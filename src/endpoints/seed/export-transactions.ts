import type { Payload } from 'payload'

export const seedExportTransactions = async (
  payload: Payload,
  companyMap: Record<string, any>,
  routeMap: Record<string, any>,
): Promise<Record<string, any>> => {
  const existingDocs = await payload.find({
    collection: 'export-transactions',
    limit: 1,
  })

  // Return map of transaction names to IDs for reference in other seed functions
  const transactionMap: Record<string, any> = {}

  if (existingDocs.docs.length === 0) {
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
    transactionMap['Don Hugo Peanut Export - Batch #1'] = donHugoExport.id

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
    transactionMap['Global Coffee Export - Colombia to Japan'] = coffeeExport.id

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
    transactionMap['Brazilian Soy Export - Batch #147'] = soyExport.id

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
    transactionMap['Mediterranean Olive Oil Export - Batch #32'] = oliveOilExport.id

    console.log('✅ Seed export transactions completed')
  } else {
    // If transactions already exist, get their IDs for the map
    const allTransactions = await payload.find({
      collection: 'export-transactions',
      limit: 100,
    })

    allTransactions.docs.forEach((transaction: any) => {
      transactionMap[transaction.title] = transaction.id
    })

    console.log('🌱 Export transactions already exist, using existing data')
  }

  return transactionMap
}
