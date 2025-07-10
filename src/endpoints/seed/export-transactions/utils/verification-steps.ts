// Common verification step templates for export transactions

export const createProductionVerificationStep = (
  location: string,
  gpsCoordinates: string,
  facilityCode: string,
  weight: string,
  weightUnit: string = 'kg',
) => ({
  stepName: 'Production Verification',
  description: `Verification of production at facility`,
  status: 'verified',
  verifiedBy: `Oracle Node #${Math.floor(Math.random() * 900) + 100}`,
  timestamp: new Date().toISOString(),
  paymentReleased: 15,
  location,
  gpsCoordinates,
  evidenceType: 'photo',
  verificationMethod: 'automated-oracle',
  contractCode: `function verifyProduction(bytes32 photoHash, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredFacility(lat, long), "Location not registered");
  require(validatePhotoHash(photoHash), "Invalid photo evidence");
  verifyMilestone(1, generateSignature(photoHash, timestamp, lat, long));
}`,
  oracleInteraction: `// Oracle verification code
const photoEvidence = await retrieveEvidence('photo-${facilityCode}');
const gpsData = await retrieveGPS('device-${facilityCode}');

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
  transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  dataPoints: [
    {
      dataType: 'location',
      value: gpsCoordinates,
      unit: 'coordinates',
      source: `GPS Tracker #${facilityCode}`,
      timestamp: new Date().toISOString(),
    },
    {
      dataType: 'timestamp',
      value: Math.floor(Date.now() / 1000).toString(),
      unit: 'unix',
      source: 'Blockchain Oracle',
      timestamp: new Date().toISOString(),
    },
    {
      dataType: 'weight',
      value: weight,
      unit: weightUnit,
      source: 'Facility Scale',
      timestamp: new Date().toISOString(),
    },
  ],
})

export const createPortDepartureStep = (
  portName: string,
  gpsCoordinates: string,
  documentId: string,
  shipmentId: string,
) => ({
  stepName: 'Port of Origin Departure',
  description: `Verification of goods arrival and loading at ${portName}`,
  status: 'verified',
  verifiedBy: `Oracle Node #${Math.floor(Math.random() * 900) + 100}`,
  timestamp: new Date().toISOString(),
  paymentReleased: 20,
  location: portName,
  gpsCoordinates,
  evidenceType: 'document',
  verificationMethod: 'document-verification',
  contractCode: `function verifyPortDeparture(bytes32 documentHash, uint256 timestamp, bytes32 billOfLadingId) {
  require(validateDocument(documentHash, "billOfLading"), "Invalid document");
  require(validatePortAuthority(billOfLadingId), "Port authority verification failed");
  verifyMilestone(2, generateSignature(documentHash, timestamp, billOfLadingId));
}`,
  oracleInteraction: `// Oracle verification code
const billOfLading = await retrieveDocument('${documentId}');
const portAuthorityConfirmation = await queryPortAuthority('${shipmentId}');

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
  transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  dataPoints: [
    {
      dataType: 'document-hash',
      value: `0x${Math.random().toString(16).substring(2, 42)}`,
      unit: 'hash',
      source: 'Port Authority System',
      timestamp: new Date().toISOString(),
    },
    {
      dataType: 'location',
      value: gpsCoordinates,
      unit: 'coordinates',
      source: 'Port Authority GPS',
      timestamp: new Date().toISOString(),
    },
  ],
})

export const createOceanTransitStep = (
  oceanLocation: string,
  gpsCoordinates: string,
  vesselId: string,
  routeId: string,
) => ({
  stepName: 'Ocean Transit Tracking',
  description: 'Verification of container location during ocean transit',
  status: 'verified',
  verifiedBy: `Oracle Node #${Math.floor(Math.random() * 900) + 100}`,
  timestamp: new Date().toISOString(),
  paymentReleased: 0,
  location: oceanLocation,
  gpsCoordinates,
  evidenceType: 'gps',
  verificationMethod: 'automated-oracle',
  contractCode: `function verifyTransitLocation(bytes32 vesselId, uint256 timestamp, int256 lat, int256 long) {
  require(isRegisteredVessel(vesselId), "Unknown vessel");
  require(isOnCourse(vesselId, lat, long), "Vessel off expected course");
  // No payment released, just update status
  logTransitUpdate(3, generateSignature(vesselId, timestamp, lat, long));
}`,
  oracleInteraction: `// Oracle verification code
const vesselData = await retrieveVesselData('${vesselId}');
const routeData = await retrieveShippingRoute('${routeId}');

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
  transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  dataPoints: [
    {
      dataType: 'location',
      value: gpsCoordinates,
      unit: 'coordinates',
      source: 'Vessel AIS Tracker',
      timestamp: new Date().toISOString(),
    },
    {
      dataType: 'temperature',
      value: (Math.random() * 10 + 15).toFixed(1),
      unit: 'celsius',
      source: 'Container IoT Sensor',
      timestamp: new Date().toISOString(),
    },
    {
      dataType: 'humidity',
      value: Math.floor(Math.random() * 20 + 40).toString(),
      unit: 'percentage',
      source: 'Container IoT Sensor',
      timestamp: new Date().toISOString(),
    },
  ],
})

export const createPortArrivalStep = (
  portName: string,
  gpsCoordinates: string,
  importDocId: string,
  customsId: string,
) => ({
  stepName: 'Arrival at Destination Port',
  description: `Verification of arrival at ${portName}`,
  status: 'verified',
  verifiedBy: `Oracle Node #${Math.floor(Math.random() * 900) + 100}`,
  timestamp: new Date().toISOString(),
  paymentReleased: 20,
  location: portName,
  gpsCoordinates,
  evidenceType: 'document',
  verificationMethod: 'document-verification',
  contractCode: `function verifyPortArrival(bytes32 documentHash, uint256 timestamp, bytes32 customsId) {
  require(validateDocument(documentHash, "importDeclaration"), "Invalid document");
  require(validateCustomsAuthority(customsId), "Customs verification failed");
  verifyMilestone(4, generateSignature(documentHash, timestamp, customsId));
}`,
  oracleInteraction: `// Oracle verification code
const importDeclaration = await retrieveDocument('${importDocId}');
const customsConfirmation = await queryCustomsAuthority('${customsId}');

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
  transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  dataPoints: [
    {
      dataType: 'document-hash',
      value: `0x${Math.random().toString(16).substring(2, 42)}`,
      unit: 'hash',
      source: 'Customs Authority',
      timestamp: new Date().toISOString(),
    },
    {
      dataType: 'location',
      value: gpsCoordinates,
      unit: 'coordinates',
      source: 'Port Authority GPS',
      timestamp: new Date().toISOString(),
    },
  ],
})

export const createFinalDeliveryStep = (
  deliveryLocation: string,
  gpsCoordinates: string,
  receiptId: string,
  qualityReportId: string,
  finalWeight?: string,
) => ({
  stepName: 'Final Delivery Verification',
  description: `Verification of delivery to ${deliveryLocation}`,
  status: 'verified',
  verifiedBy: `Oracle Node #${Math.floor(Math.random() * 900) + 100}`,
  timestamp: new Date().toISOString(),
  paymentReleased: 45,
  location: deliveryLocation,
  gpsCoordinates,
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
const deliveryReceipt = await retrieveDocument('${receiptId}');
const qualityReport = await retrieveDocument('${qualityReportId}');

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
  transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  dataPoints: [
    {
      dataType: 'location',
      value: gpsCoordinates,
      unit: 'coordinates',
      source: 'Warehouse GPS System',
      timestamp: new Date().toISOString(),
    },
    ...(finalWeight
      ? [
          {
            dataType: 'weight',
            value: finalWeight,
            unit: 'kg',
            source: 'Warehouse Scale',
            timestamp: new Date().toISOString(),
          },
        ]
      : []),
    {
      dataType: 'document-hash',
      value: `0x${Math.random().toString(16).substring(2, 42)}`,
      unit: 'hash',
      source: 'Quality Assurance System',
      timestamp: new Date().toISOString(),
    },
  ],
})

export const createPendingStep = (
  stepName: string,
  description: string,
  location: string,
  gpsCoordinates: string,
  evidenceType: string = 'multiple',
  verificationMethod: string = 'multi-signature',
) => ({
  stepName,
  description,
  status: 'pending',
  location,
  gpsCoordinates,
  evidenceType,
  verificationMethod,
  contractCode: `function verify${stepName.replace(/\s+/g, '')}(bytes32 evidenceHash, uint256 timestamp, bytes32 verificationId) {
  require(validateEvidence(evidenceHash), "Invalid evidence");
  require(validateVerification(verificationId), "Verification failed");
  verifyMilestone(${Math.floor(Math.random() * 5) + 1}, generateSignature(evidenceHash, timestamp, verificationId));
}`,
  oracleInteraction: `// Oracle verification code - pending implementation
const evidence = await retrieveEvidence('pending');
const verification = await retrieveVerification('pending');

if (verifyEvidenceAuthenticity(evidence) && verification.status === 'APPROVED') {
  await submitVerification({
    milestone: ${Math.floor(Math.random() * 5) + 1},
    evidence: {
      evidenceHash: calculateHash(evidence),
      timestamp: Date.now(),
      verificationId: verification.id
    }
  });
}`,
})
