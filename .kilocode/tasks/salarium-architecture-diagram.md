# Salarium System Architecture Diagrams

## System Overview Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[User Interface]
        Admin[Admin Panel]
        API[API Layer]
    end
    
    subgraph "Core Collections"
        FT[FlowTemplates]
        FS[FlowSteps] 
        FI[FlowInstances]
        SR[StepResponses]
    end
    
    subgraph "Supporting Collections"
        ORG[Organizations]
        JF[JobFamilies]
        DEPT[Departments]
        AI[AIProviders]
    end
    
    subgraph "External Services"
        OPENAI[OpenAI]
        ANTHROPIC[Anthropic]
        OLLAMA[Ollama]
        PDF[PDF Generator]
    end
    
    UI --> API
    Admin --> API
    API --> FT
    API --> FS
    API --> FI
    API --> SR
    API --> ORG
    API --> JF
    API --> DEPT
    API --> AI
    
    FI --> FT
    SR --> FI
    SR --> FS
    FI --> ORG
    
    AI --> OPENAI
    AI --> ANTHROPIC
    AI --> OLLAMA
    
    SR --> PDF
```

## Data Relationship Model

```mermaid
erDiagram
    Organizations ||--o{ Users : "belongs to"
    Organizations ||--o{ FlowInstances : "owns"
    Organizations ||--o{ Departments : "contains"
    
    FlowTemplates ||--o{ FlowSteps : "contains"
    FlowTemplates ||--o{ FlowInstances : "instantiates"
    FlowTemplates }o--|| AIProviders : "uses"
    
    FlowInstances ||--o{ StepResponses : "contains"
    FlowInstances }o--|| Users : "created by"
    FlowInstances }o--o{ Users : "collaborates with"
    
    FlowSteps ||--o{ StepResponses : "answered by"
    StepResponses }o--|| AIProviders : "processed by"
    
    JobFamilies ||--o{ JobFamilies : "parent-child"
    Departments ||--o{ Departments : "parent-child"
    Departments }o--|| Organizations : "belongs to"
    
    Organizations {
        string id PK
        string name
        string domain
        json settings
        json branding
        string industry
        json location
    }
    
    FlowTemplates {
        string id PK
        string name
        string description
        string category
        string version
        boolean isActive
        string aiProviderId FK
        json steps
        text outputTemplate
        json metadata
    }
    
    FlowSteps {
        string id PK
        string templateId FK
        int stepNumber
        string title
        text description
        text questionText
        text systemPrompt
        string stepType
        boolean isRequired
        json validationRules
        json dependencies
        string aiProviderId FK
        json examples
    }
    
    FlowInstances {
        string id PK
        string templateId FK
        string userId FK
        string organizationId FK
        string title
        string status
        int currentStep
        json stepResponses
        json generatedContent
        text finalDocument
        json metadata
        json collaborators
    }
    
    StepResponses {
        string id PK
        string flowInstanceId FK
        string stepId FK
        text userInput
        text aiGeneratedContent
        int version
        boolean isActive
        text feedback
        text regenerationPrompt
        int processingTime
        string aiProviderId FK
        datetime timestamp
    }
```

## Workflow Process Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant AI
    participant DB
    
    User->>UI: Select Template
    UI->>API: GET /templates
    API->>DB: Query FlowTemplates
    DB-->>API: Template Data
    API-->>UI: Template Info
    
    User->>UI: Start New Flow
    UI->>API: POST /flow-instances
    API->>DB: Create FlowInstance
    DB-->>API: Instance ID
    API-->>UI: Flow Started
    
    loop For Each Step
        UI->>API: GET /steps/{stepId}
        API->>DB: Query FlowStep
        DB-->>API: Step Data
        API-->>UI: Step Question
        
        User->>UI: Answer Question
        UI->>API: POST /step-responses
        API->>AI: Process with Prompt
        AI-->>API: Generated Content
        API->>DB: Save Response
        DB-->>API: Saved
        API-->>UI: Generated Content
        
        alt User wants to regenerate
            User->>UI: Request Regeneration
            UI->>API: POST /regenerate
            API->>AI: Process with Feedback
            AI-->>API: New Content
            API->>DB: Save New Version
            DB-->>API: Saved
            API-->>UI: Updated Content
        end
        
        User->>UI: Approve & Next
    end
    
    UI->>API: POST /generate-document
    API->>DB: Compile All Responses
    DB-->>API: Complete Data
    API->>API: Generate Final Document
    API-->>UI: Final Document
    
    User->>UI: Export PDF
    UI->>API: GET /export/{instanceId}
    API->>API: Generate PDF
    API-->>UI: PDF File
```

## Multi-Tenant Data Isolation

```mermaid
graph TD
    subgraph "Organization A"
        UA[Users A]
        FIA[Flow Instances A]
        SRA[Step Responses A]
        DEPTA[Departments A]
    end
    
    subgraph "Organization B"
        UB[Users B]
        FIB[Flow Instances B]
        SRB[Step Responses B]
        DEPTB[Departments B]
    end
    
    subgraph "Shared Resources"
        FT[Flow Templates]
        FS[Flow Steps]
        AI[AI Providers]
        JF[Job Families]
    end
    
    UA --> FIA
    FIA --> SRA
    UA --> DEPTA
    
    UB --> FIB
    FIB --> SRB
    UB --> DEPTB
    
    FIA --> FT
    FIB --> FT
    SRA --> FS
    SRB --> FS
    
    SRA --> AI
    SRB --> AI
    
    DEPTA --> JF
    DEPTB --> JF
```

## AI Processing Pipeline

```mermaid
graph LR
    subgraph "Input Processing"
        UI[User Input]
        VAL[Validation]
        CLEAN[Sanitization]
    end
    
    subgraph "AI Processing"
        PROMPT[Prompt Assembly]
        PROVIDER[AI Provider Selection]
        CALL[API Call]
        RETRY[Retry Logic]
    end
    
    subgraph "Output Processing"
        FORMAT[Format Response]
        VALIDATE[Validate Output]
        STORE[Store Version]
    end
    
    subgraph "Error Handling"
        FALLBACK[Fallback Provider]
        CACHE[Response Cache]
        LOG[Error Logging]
    end
    
    UI --> VAL
    VAL --> CLEAN
    CLEAN --> PROMPT
    PROMPT --> PROVIDER
    PROVIDER --> CALL
    CALL --> FORMAT
    FORMAT --> VALIDATE
    VALIDATE --> STORE
    
    CALL -->|Error| RETRY
    RETRY -->|Max Retries| FALLBACK
    FALLBACK --> CACHE
    CALL --> LOG
    
    CACHE --> FORMAT
```

## User Interface Component Structure

```mermaid
graph TD
    subgraph "Template Management"
        TM[Template Manager]
        TE[Template Editor]
        SE[Step Editor]
    end
    
    subgraph "Flow Execution"
        FL[Flow Launcher]
        SW[Step Wizard]
        CR[Content Reviewer]
        EX[Export Manager]
    end
    
    subgraph "Shared Components"
        AI_INT[AI Integration]
        VER[Version Control]
        COLLAB[Collaboration]
        PREVIEW[Live Preview]
    end
    
    subgraph "Admin Interface"
        ORG_MGR[Organization Manager]
        USER_MGR[User Manager]
        ANALYTICS[Analytics Dashboard]
        SETTINGS[System Settings]
    end
    
    TM --> TE
    TE --> SE
    
    FL --> SW
    SW --> CR
    CR --> EX
    
    SW --> AI_INT
    CR --> VER
    FL --> COLLAB
    EX --> PREVIEW
    
    ORG_MGR --> USER_MGR
    USER_MGR --> ANALYTICS
    ANALYTICS --> SETTINGS
```

## Security and Access Control

```mermaid
graph TB
    subgraph "Authentication Layer"
        LOGIN[User Login]
        JWT[JWT Tokens]
        REFRESH[Token Refresh]
    end
    
    subgraph "Authorization Layer"
        RBAC[Role-Based Access]
        ORG_SCOPE[Organization Scoping]
        RESOURCE[Resource Permissions]
    end
    
    subgraph "Data Protection"
        ENCRYPT[Data Encryption]
        AUDIT[Audit Logging]
        BACKUP[Secure Backups]
    end
    
    subgraph "API Security"
        RATE[Rate Limiting]
        CORS[CORS Protection]
        VALIDATE[Input Validation]
    end
    
    LOGIN --> JWT
    JWT --> REFRESH
    JWT --> RBAC
    RBAC --> ORG_SCOPE
    ORG_SCOPE --> RESOURCE
    
    RESOURCE --> ENCRYPT
    ENCRYPT --> AUDIT
    AUDIT --> BACKUP
    
    RBAC --> RATE
    RATE --> CORS
    CORS --> VALIDATE
```

This architecture provides a comprehensive view of how the Salarium system integrates with the existing IntelliTrade CMS while maintaining clean separation of concerns and scalable design patterns.