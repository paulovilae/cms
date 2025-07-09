# IntelliTrade Trade-Flow Interface Architecture

## Overview

Create an IntelliTrade trade-flow interface similar to Salarium's job-flow (`http://localhost:3003/salarium/job-flow`) with cards for each "Lego block" from the modular disaggregation document. The first functional implementation will be the KYC workflow, with other blocks showing as "Coming Soon".

## Interface Structure

### Main Route
- **URL**: `http://localhost:3003/intellitrade/trade-flow`
- **Authentication**: Required (using AutoAuthWrapper)
- **Auto-login URL**: `http://localhost:3003/intellitrade/trade-flow?autoLogin=true`

### File Structure
```
src/app/(frontend)/intellitrade/trade-flow/
├── page.tsx                                    # Main route page
src/plugins/business/intellitrade/components/
├── IntelliTradeFlowDemo.tsx                   # Main demo interface
├── KYCWorkflow.tsx                            # Functional KYC workflow
├── workflows/
│   ├── SamplesWorkflow.tsx                    # Future: Samples workflow
│   ├── EscrowWorkflow.tsx                     # Future: Escrow workflow
│   ├── OracleWorkflow.tsx                     # Future: Oracle workflow
│   └── FactoringWorkflow.tsx                  # Future: Factoring workflow
```

## Main Interface Design (IntelliTradeFlowDemo.tsx)

### Header Section
```typescript
// Welcome Section
- Title: "Welcome to IntelliTrade Flow Demo"
- Subtitle: "Experience our blockchain-powered trade finance platform that reduces transaction time by 75% and costs by 40%. This interactive demo showcases real IntelliTrade capabilities."
- Demo Status Badge: "Live Demo Active" (green)
```

### Key Metrics Cards
```typescript
// 4-column grid with key metrics
[
  { value: "75%", label: "Time Reduction" },
  { value: "40%", label: "Cost Savings" },
  { value: "<48h", label: "Transaction Processing" },
  { value: "99%", label: "Security Rate" }
]
```

### Lego Block Cards (2x5 Grid)

#### 1. KYC/KYB Validation Block ⭐ FUNCTIONAL
```typescript
{
  icon: Shield,
  title: "KYC/KYB Validation",
  description: "Automated identity verification with OFAC, Sunbiz, and chamber validation",
  features: [
    "OFAC lists validation",
    "Chamber of commerce verification", 
    "Audited financials analysis",
    "Reuseable 'green tick' credentials"
  ],
  status: "functional",
  buttonText: "Try KYC Validation",
  buttonAction: () => setShowKYCWorkflow(true),
  color: "blue" // IntelliTrade brand color
}
```

#### 2. Samples Evidence Block
```typescript
{
  icon: Camera,
  title: "Samples Evidence",
  description: "Photo upload and technical sheet with blockchain immutability",
  features: [
    "Photo upload with parameters",
    "Electronic signature (click-to-sign)",
    "On-chain hash for immutability",
    "Technical sheet management"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 3. Smart Escrow Block
```typescript
{
  icon: Lock,
  title: "Smart Escrow",
  description: "Secure fund management with automated payment release",
  features: [
    "Regulated custodian account",
    "Smart contract payment orders",
    "Oracle-triggered releases",
    "Multi-signature security"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 4. AI Oracle Validation Block
```typescript
{
  icon: Eye,
  title: "AI Oracle Validation",
  description: "Photo + GPS comparison with fixed parameters for quality assurance",
  features: [
    "40cm distance validation",
    "5000K light conditions",
    "Pantone98 color matching",
    "GPS location verification"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 5. Order Confirmation Block
```typescript
{
  icon: ShoppingCart,
  title: "Order Confirmation",
  description: "Amazon-style transactional summary with verified identity",
  features: [
    "Amazon-style cart summary",
    "NFC Persona verification",
    "Checkbox contract validation",
    "Quantity and pricing management"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 6. Mini-Contracts Block
```typescript
{
  icon: FileText,
  title: "Mini-Contracts",
  description: "Modular contract clauses with biometric signatures",
  features: [
    "Smart-Escrow clauses",
    "Quality Oracle terms",
    "GPS alerts integration",
    "Biometric digital signatures"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 7. Factoring Integration Block
```typescript
{
  icon: CreditCard,
  title: "Factoring Integration",
  description: "85% advance payment with documentary deck for financial institutions",
  features: [
    "Documentary deck generation",
    "85% advance payment",
    "Traffic light alerts",
    "Financial institution dashboard"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 8. Document Traceability Block
```typescript
{
  icon: FileSearch,
  title: "Document Traceability",
  description: "Watermarked data room with dual monetization model",
  features: [
    "Watermarked PDF viewing",
    "No download, view-only access",
    "Dual monetization (exporter + financial)",
    "Access tracking and analytics"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 9. Real-time Alerts Block
```typescript
{
  icon: Bell,
  title: "Real-time Alerts",
  description: "Webhook-driven alerts with traffic light scoring system",
  features: [
    "Logistics milestone alerts",
    "KYC expiry notifications",
    "Traffic light risk scoring",
    "Bank premium adjustments"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

#### 10. Dispute Resolution Block
```typescript
{
  icon: Scale,
  title: "Dispute Resolution",
  description: "Online dispute resolution with blockchain evidence",
  features: [
    "ODR (Online Dispute Resolution)",
    "Blockchain evidence tracking",
    "PDF reports with hashes",
    "Legally strong documentation"
  ],
  status: "coming-soon",
  buttonText: "Coming Soon",
  color: "blue"
}
```

### Process Timeline Section
```typescript
// Don Hugo Complete Flow (9 stages)
const processSteps = [
  {
    number: 1,
    title: "Prospecting & Samples",
    description: "Initial contact and sample approval with blockchain evidence",
    time: "2 days",
    blocks: ["Samples Evidence"]
  },
  {
    number: 2,
    title: "KYC & Pre-validation",
    description: "Identity verification and capacity validation",
    time: "24 hours",
    blocks: ["KYC/KYB Validation"]
  },
  {
    number: 3,
    title: "Order & Contract",
    description: "Order confirmation and mini-contract creation",
    time: "4 hours",
    blocks: ["Order Confirmation", "Mini-Contracts"]
  },
  {
    number: 4,
    title: "Production & Factoring",
    description: "Manufacturing and liquidity advance request",
    time: "48 hours",
    blocks: ["Factoring Integration"]
  },
  {
    number: 5,
    title: "Logistics & Oracle",
    description: "Shipment tracking with AI validation",
    time: "Real-time",
    blocks: ["AI Oracle Validation", "Real-time Alerts"]
  },
  {
    number: 6,
    title: "Payment & Settlement",
    description: "Automated payment release and settlement",
    time: "Instant",
    blocks: ["Smart Escrow", "Document Traceability"]
  }
]
```

## KYC Workflow Implementation (KYCWorkflow.tsx)

### Workflow Structure
The KYC workflow should follow a multi-step process similar to Salarium's JobDescriptionWorkflow:

#### Step 1: Company Information
```typescript
interface CompanyBasicInfo {
  companyName: string
  businessType: 'exporter' | 'importer' | 'both'
  registrationNumber: string
  taxId: string
  incorporationCountry: string
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contactPerson: {
    name: string
    title: string
    email: string
    phone: string
  }
}
```

#### Step 2: Financial Information
```typescript
interface FinancialInfo {
  annualRevenue: number
  employeeCount: number
  yearsInBusiness: number
  auditedFinancials: File | null // Upload audited financial statements
  bankReferences: Array<{
    bankName: string
    accountNumber: string
    contactPerson: string
    phone: string
  }>
  creditReferences: Array<{
    companyName: string
    contactPerson: string
    email: string
    phone: string
  }>
}
```

#### Step 3: Compliance Validation
```typescript
interface ComplianceValidation {
  ofacCheck: {
    status: 'pending' | 'clear' | 'flagged'
    details: string
    lastChecked: Date
  }
  sunbizValidation: {
    status: 'pending' | 'verified' | 'failed'
    registrationDetails: any
    lastChecked: Date
  }
  chamberOfCommerce: {
    status: 'pending' | 'verified' | 'failed'
    membershipDetails: any
    lastChecked: Date
  }
  sanctionsScreening: {
    status: 'pending' | 'clear' | 'flagged'
    details: string
    lastChecked: Date
  }
}
```

#### Step 4: Document Upload
```typescript
interface DocumentUpload {
  incorporationCertificate: File | null
  taxCertificate: File | null
  auditedFinancials: File | null
  bankStatements: File | null
  businessLicense: File | null
  insuranceCertificate: File | null
  additionalDocuments: Array<{
    name: string
    file: File
    description: string
  }>
}
```

#### Step 5: Verification Results
```typescript
interface VerificationResults {
  overallStatus: 'pending' | 'approved' | 'rejected' | 'requires-review'
  kycScore: number // 0-100
  riskLevel: 'low' | 'medium' | 'high'
  verificationPackage: {
    packageId: string
    downloadUrl: string
    expiryDate: Date
    watermarkId: string
  }
  reuseableCredentials: {
    tickVerdeId: string
    validUntil: Date
    applicableRegions: string[]
  }
  recommendations: string[]
  nextSteps: string[]
}
```

### Workflow UI Components

#### Progress Indicator
```typescript
const steps = [
  { id: 1, name: 'Company Info', status: 'completed' },
  { id: 2, name: 'Financial Data', status: 'current' },
  { id: 3, name: 'Compliance', status: 'upcoming' },
  { id: 4, name: 'Documents', status: 'upcoming' },
  { id: 5, name: 'Verification', status: 'upcoming' }
]
```

#### Real-time Validation
```typescript
// As user fills forms, show real-time validation
const validationChecks = {
  companyName: {
    status: 'checking' | 'valid' | 'invalid',
    message: string,
    suggestions?: string[]
  },
  taxId: {
    status: 'checking' | 'valid' | 'invalid',
    message: string
  },
  // ... other fields
}
```

#### Mock API Integration
```typescript
// Simulate external API calls for validation
const mockValidationAPIs = {
  async checkOFAC(companyName: string, taxId: string) {
    // Simulate OFAC check
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      status: 'clear',
      confidence: 0.95,
      details: 'No matches found in OFAC sanctions lists'
    }
  },
  
  async validateSunbiz(registrationNumber: string, state: string) {
    // Simulate Sunbiz validation
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      status: 'verified',
      companyDetails: {
        name: 'Don Hugo Exports LLC',
        status: 'Active',
        filingDate: '2020-03-15'
      }
    }
  },
  
  async checkChamberOfCommerce(companyName: string, country: string) {
    // Simulate chamber validation
    await new Promise(resolve => setTimeout(resolve, 1800))
    return {
      status: 'verified',
      membershipLevel: 'Premium',
      memberSince: '2020-04-01'
    }
  }
}
```

### Success Flow
After successful KYC completion:

1. **Generate Verification Package**: Create downloadable PDF with all validation results
2. **Issue Reuseable Credentials**: Generate "tick verde" for future transactions
3. **Update Company Record**: Save all validation data to Companies collection
4. **Show Next Steps**: Guide user to next Lego block (Samples Evidence)

### Integration Points

#### Database Collections
- **Companies**: Enhanced with KYC fields from the implementation plan
- **KYCValidations**: New collection to track validation history
- **VerificationPackages**: Store generated packages and access logs

#### External Services (Mocked)
- OFAC API integration
- Sunbiz API integration  
- Chamber of Commerce APIs
- Document OCR processing
- Credit scoring services

## Implementation Priority

### Phase 1: Core Interface (Week 1)
1. Create main trade-flow page with authentication
2. Implement IntelliTradeFlowDemo with all 10 Lego block cards
3. Set up routing and navigation structure
4. Add metrics and timeline sections

### Phase 2: KYC Workflow (Week 2-3)
1. Implement KYCWorkflow component with 5-step process
2. Create form components for each step
3. Add real-time validation and progress tracking
4. Implement mock API integrations
5. Create verification results and package generation

### Phase 3: Database Integration (Week 4)
1. Enhance Companies collection with KYC fields
2. Create KYCValidations and VerificationPackages collections
3. Implement data persistence and retrieval
4. Add seed data for testing

### Phase 4: Polish & Testing (Week 5)
1. Add loading states and error handling
2. Implement responsive design
3. Add animations and transitions
4. Create comprehensive test scenarios

## Success Metrics

### User Experience
- **Onboarding Time**: < 48 hours (target from pilot)
- **Form Completion Rate**: > 85%
- **User Satisfaction**: > 8/10 NPS
- **Error Rate**: < 5%

### Technical Performance
- **Page Load Time**: < 3 seconds
- **API Response Time**: < 2 seconds
- **Form Validation**: Real-time feedback
- **Mobile Responsiveness**: Full functionality

### Business Impact
- **KYC Completion Rate**: > 90%
- **Verification Accuracy**: > 95%
- **Time Reduction**: 75% vs traditional process
- **Cost Reduction**: 40% vs manual validation

This architecture provides a solid foundation for the IntelliTrade trade-flow interface, with the KYC workflow as the first fully functional Lego block, following the successful pattern established by Salarium's job-flow demo.