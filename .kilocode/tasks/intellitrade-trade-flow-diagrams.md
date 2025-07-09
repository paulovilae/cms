# IntelliTrade Trade-Flow Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Interface"
        A["/intellitrade/trade-flow"] --> B[IntelliTradeFlowDemo]
        B --> C[10 Lego Block Cards]
        B --> D[KYC Workflow - FUNCTIONAL]
        B --> E[Other Workflows - Coming Soon]
    end
    
    subgraph "Authentication Layer"
        F[AutoAuthWrapper] --> G[URL-based Auth]
        G --> H[?autoLogin=true]
    end
    
    subgraph "Data Layer"
        I[Companies Collection] --> J[Enhanced KYC Fields]
        K[KYCValidations Collection] --> L[Validation History]
        M[VerificationPackages Collection] --> N[Generated Packages]
    end
    
    subgraph "External APIs (Mocked)"
        O[OFAC API] --> P[Sanctions Screening]
        Q[Sunbiz API] --> R[Business Registration]
        S[Chamber of Commerce] --> T[Membership Validation]
    end
    
    A --> F
    D --> I
    D --> K
    D --> M
    D --> O
    D --> Q
    D --> S
```

## Lego Blocks Architecture

```mermaid
graph LR
    subgraph "Don Hugo Complete Flow (9 Stages)"
        A[1. Prospecting & Samples] --> B[2. KYC & Pre-validation]
        B --> C[3. Order & Contract]
        C --> D[4. Production & Factoring]
        D --> E[5. Logistics & Oracle]
        E --> F[6. Payment & Settlement]
    end
    
    subgraph "Lego Block Cards (10 Total)"
        G[KYC/KYB Validation - FUNCTIONAL]
        H[Samples Evidence - Coming Soon]
        I[Smart Escrow - Coming Soon]
        J[AI Oracle Validation - Coming Soon]
        K[Order Confirmation - Coming Soon]
        L[Mini-Contracts - Coming Soon]
        M[Factoring Integration - Coming Soon]
        N[Document Traceability - Coming Soon]
        O[Real-time Alerts - Coming Soon]
        P[Dispute Resolution - Coming Soon]
    end
    
    A --> H
    B --> G
    C --> K
    C --> L
    D --> M
    E --> J
    E --> O
    F --> I
    F --> N
    F --> P
```

## KYC Workflow Process Flow

```mermaid
flowchart TD
    A[Start KYC Workflow] --> B[Step 1: Company Information]
    B --> C{Form Valid?}
    C -->|No| B
    C -->|Yes| D[Step 2: Financial Information]
    
    D --> E{Financial Data Complete?}
    E -->|No| D
    E -->|Yes| F[Step 3: Compliance Validation]
    
    F --> G[OFAC Check]
    F --> H[Sunbiz Validation]
    F --> I[Chamber of Commerce Check]
    
    G --> J{All Checks Pass?}
    H --> J
    I --> J
    
    J -->|No| K[Show Validation Errors]
    K --> L[Manual Review Required]
    
    J -->|Yes| M[Step 4: Document Upload]
    M --> N{Documents Complete?}
    N -->|No| M
    N -->|Yes| O[Step 5: Verification Results]
    
    O --> P[Generate Verification Package]
    P --> Q[Issue Reuseable Credentials]
    Q --> R[Update Company Record]
    R --> S[Show Next Steps]
    S --> T[End - Success]
    
    L --> U[End - Manual Review]
```

## KYC Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    participant E as External APIs
    
    U->>F: Start KYC Process
    F->>A: Initialize KYC Session
    A->>D: Create KYC Record
    
    U->>F: Submit Company Info
    F->>A: Validate Company Data
    A->>E: Check OFAC Lists
    E-->>A: OFAC Results
    A->>E: Validate Sunbiz
    E-->>A: Sunbiz Results
    A->>E: Check Chamber of Commerce
    E-->>A: Chamber Results
    
    A->>D: Save Validation Results
    A-->>F: Return Validation Status
    F-->>U: Show Validation Results
    
    U->>F: Upload Documents
    F->>A: Process Documents
    A->>A: OCR Processing (Mock)
    A->>D: Save Document References
    
    A->>A: Generate Verification Package
    A->>D: Save Package & Credentials
    A-->>F: Return Success + Package
    F-->>U: Show Completion & Next Steps
```

## Component Architecture

```mermaid
graph TB
    subgraph "Main Components"
        A[IntelliTradeFlowDemo.tsx]
        B[KYCWorkflow.tsx]
    end
    
    subgraph "KYC Workflow Components"
        C[CompanyInfoStep.tsx]
        D[FinancialInfoStep.tsx]
        E[ComplianceValidationStep.tsx]
        F[DocumentUploadStep.tsx]
        G[VerificationResultsStep.tsx]
    end
    
    subgraph "Shared Components"
        H[ProgressIndicator.tsx]
        I[ValidationStatus.tsx]
        J[DocumentUploader.tsx]
        K[LoadingSpinner.tsx]
    end
    
    subgraph "UI Components"
        L[Card from shadcn/ui]
        M[Button from shadcn/ui]
        N[Badge from shadcn/ui]
        O[Form Components]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
    
    C --> H
    D --> H
    E --> H
    F --> H
    G --> H
    
    E --> I
    F --> J
    B --> K
    
    C --> O
    D --> O
    F --> O
    
    A --> L
    A --> M
    A --> N
```

## Database Schema Enhancement

```mermaid
erDiagram
    COMPANIES {
        string id PK
        string name
        string businessType
        string registrationNumber
        string taxId
        json businessAddress
        json contactPerson
        string kycStatus
        json ofacValidation
        json sunbizValidation
        json chamberOfCommerceValidation
        string auditedFinancials
        number financialCapacityScore
        json productiveCapacityValidation
        string kycProvider
        json verificationPackage
        boolean reuseableTickVerde
        datetime createdAt
        datetime updatedAt
    }
    
    KYC_VALIDATIONS {
        string id PK
        string companyId FK
        string validationType
        string status
        json validationData
        json externalApiResponse
        datetime validatedAt
        datetime expiresAt
        string validatedBy
    }
    
    VERIFICATION_PACKAGES {
        string id PK
        string companyId FK
        string packageId
        string downloadUrl
        string watermarkId
        json packageContents
        datetime generatedAt
        datetime expiresAt
        json accessLog
    }
    
    REUSEABLE_CREDENTIALS {
        string id PK
        string companyId FK
        string tickVerdeId
        json applicableRegions
        datetime validUntil
        string credentialType
        json credentialData
    }
    
    COMPANIES ||--o{ KYC_VALIDATIONS : has
    COMPANIES ||--o{ VERIFICATION_PACKAGES : generates
    COMPANIES ||--o{ REUSEABLE_CREDENTIALS : receives
```

## API Integration Flow

```mermaid
graph LR
    subgraph "Frontend Validation"
        A[Real-time Form Validation]
        B[Progress Tracking]
        C[Error Handling]
    end
    
    subgraph "Mock External APIs"
        D[OFAC API Mock]
        E[Sunbiz API Mock]
        F[Chamber API Mock]
        G[Credit Score Mock]
    end
    
    subgraph "Internal Processing"
        H[Document OCR Mock]
        I[Package Generation]
        J[Credential Issuance]
    end
    
    A --> D
    A --> E
    A --> F
    A --> G
    
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I
    I --> J
    J --> B
    
    C --> A
```

## User Experience Flow

```mermaid
journey
    title KYC Workflow User Journey
    section Initial Access
      Navigate to trade-flow: 5: User
      Auto-login (optional): 5: User
      View Lego blocks: 4: User
      Click KYC block: 5: User
    
    section Company Information
      Fill company details: 3: User
      Real-time validation: 4: System
      Address verification: 3: User
      Contact information: 4: User
    
    section Financial Data
      Enter revenue data: 3: User
      Upload financials: 2: User
      Bank references: 3: User
      Credit references: 3: User
    
    section Compliance Checks
      OFAC screening: 5: System
      Sunbiz validation: 4: System
      Chamber verification: 4: System
      Results display: 5: User
    
    section Document Upload
      Upload certificates: 2: User
      OCR processing: 4: System
      Document validation: 4: System
      Completion check: 5: User
    
    section Verification Results
      Package generation: 5: System
      Credential issuance: 5: System
      Next steps guidance: 5: User
      Success celebration: 5: User
```

## Implementation Timeline

```mermaid
gantt
    title IntelliTrade Trade-Flow Implementation
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Interface
    Main trade-flow page        :p1-1, 2025-01-09, 2d
    IntelliTradeFlowDemo        :p1-2, after p1-1, 2d
    10 Lego block cards         :p1-3, after p1-2, 2d
    Metrics and timeline        :p1-4, after p1-3, 1d
    
    section Phase 2: KYC Workflow
    KYCWorkflow component       :p2-1, after p1-4, 3d
    5-step form process         :p2-2, after p2-1, 4d
    Real-time validation        :p2-3, after p2-2, 3d
    Mock API integration        :p2-4, after p2-3, 3d
    Results and packages        :p2-5, after p2-4, 2d
    
    section Phase 3: Database Integration
    Enhance Companies collection :p3-1, after p2-5, 2d
    New collections creation     :p3-2, after p3-1, 2d
    Data persistence            :p3-3, after p3-2, 2d
    Seed data creation          :p3-4, after p3-3, 1d
    
    section Phase 4: Polish & Testing
    Loading states & errors     :p4-1, after p3-4, 2d
    Responsive design           :p4-2, after p4-1, 2d
    Animations & transitions    :p4-3, after p4-2, 1d
    Testing scenarios           :p4-4, after p4-3, 2d
```

## Success Metrics Dashboard

```mermaid
graph TB
    subgraph "User Experience Metrics"
        A[Onboarding Time < 48h]
        B[Completion Rate > 85%]
        C[NPS Score > 8/10]
        D[Error Rate < 5%]
    end
    
    subgraph "Technical Performance"
        E[Page Load < 3s]
        F[API Response < 2s]
        G[Real-time Validation]
        H[Mobile Responsive]
    end
    
    subgraph "Business Impact"
        I[KYC Completion > 90%]
        J[Verification Accuracy > 95%]
        K[Time Reduction 75%]
        L[Cost Reduction 40%]
    end
    
    subgraph "Monitoring Dashboard"
        M[Real-time Analytics]
        N[User Behavior Tracking]
        O[Performance Monitoring]
        P[Error Reporting]
    end
    
    A --> M
    B --> M
    C --> N
    D --> P
    E --> O
    F --> O
    I --> M
    J --> M
    K --> M
    L --> M
```

This comprehensive set of diagrams provides a clear visual representation of the IntelliTrade trade-flow architecture, making it easier for developers to understand the system structure, data flow, and implementation approach. The diagrams complement the detailed architectural specification and provide a roadmap for successful implementation.