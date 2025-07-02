# Multi-Tenant Business Platform

This is a plugin-based content management system built on Payload CMS and Next.js, designed to serve multiple independent business products through a single codebase with runtime decoupling.

## Business Products

### 1. IntelliTrade - Trade Finance Platform

## Purpose

IntelliTrade is a fin-tech trade-finance platform that leverages blockchain technology and smart contracts to digitalize and streamline international trade finance, specifically focused on Latin American exporters and global buyers.

## Problems Solved

The platform addresses several critical issues in international trade finance:

1. **Slow Processing Times**: Traditional trade finance processes take weeks; IntelliTrade reduces this to under 48 hours.
2. **Cross-Border Payment Friction**: High costs and delays in international payments are eliminated through stablecoin-based transactions.
3. **Logistics Verification Opacity**: Lack of transparency in verifying shipment status is resolved through oracle verification systems.
4. **Manual, Paper-Based Processes**: Legacy paper documentation is replaced with digital document processing and smart contracts.
5. **Regulatory Complexity**: Multi-jurisdictional challenges are managed through a comprehensive legal framework.
6. **Capital Inefficiency**: Exporters face cash flow issues while waiting for payment; IntelliTrade provides 85% advance payment through factoring with recourse.

## Core Functionality

### Smart Escrow System

The heart of the platform is a smart escrow system that:
- Holds buyer funds in a secure multi-signature environment
- Releases payment automatically when delivery conditions are verified
- Provides 85% advance payment to exporters upon verification
- Executes based on oracle-verified events (photos, GPS, documentation)

### Dual Token Architecture

The platform utilizes a dual token system:
- **Stablecoin (USDC/USDT)**: Acts as collateral with 1:1 parity to USD, used for actual fund transfers
- **Platform Token (TP)**: Utility token that enables contract creation and platform fee payment

### Oracle Verification

The platform uses a verification system that:
- Validates logistics milestones through photographic evidence
- Confirms geographic location through GPS data
- Timestamps all verification events on the blockchain
- Generates cryptographic proof of delivery

### KYC/KYB and Document Processing

The platform includes:
- Custom identity verification workflows
- Document validation using OCR
- Automated financial statement analysis
- Compliance tracking and reporting

## User Experience Goals

### Educational Onboarding

- Users should understand the platform's value proposition before registration
- Interactive tutorials guide users through the trade finance digitalization process
- Step-by-step onboarding creates confidence in the blockchain-based approach

### Trader Experience

**For Exporters:**
- Simplified KYC/KYB process
- Streamlined document submission
- Easy verification of shipment status
- Quick access to financing (85% advance payment)
- Clear visibility into payment status

**For Importers:**
- Transparent verification of goods delivery
- Automated payment release only upon verification
- Reduced risk of fraud
- Simplified cross-border payment process
- Lower transaction costs

### Transaction Flow

1. User visits educational web portal and completes interactive tutorials
2. User registers and completes KYC process
3. Upon approval, importer purchases TP tokens and funds escrow with USDC
4. Smart escrow contract is created with oracle verification rules
5. Exporter ships products and submits verification (photos/GPS)
6. Oracle system confirms delivery milestones
7. Smart contract auto-releases 85% payment to exporter
8. Transaction completes with final payment and TP token burning

## Pilot Scope: "Don Hugo Peanut Pilot"

The initial implementation focuses on:
- One exporter (Don Hugo) + one importer
- Single SKU (peanuts)
- Transaction size: USD 50,000-100,000
- FOB Incoterm only
- Documentation: Commercial invoice, bill of lading, inspection certificate
- Verification: Photo evidence + GPS tracking
- Financing: 85% factoring with recourse

## Success Indicators

- Web Portal Conversion Rate > 40%
- Onboarding Completion Rate > 80%
- Transaction Processing Time < 48 hours
- Cost Reduction > 30% compared to traditional trade finance
- User Satisfaction > 8/10 NPS
- System Uptime > 99.5%
- Oracle Accuracy > 99%
- KYC Completion < 24 hours


### 2. Salarium - HR Document Flow Platform
A human resources management system focused on document workflows, employee management, and organizational processes.

### 3. Latinos - Trading Stocks Bot Platform
An automated trading platform with bot functionality for stock market operations.

## Architecture Overview

### Plugin-Based Multi-Tenant System
- **Single Codebase**: All three businesses share core Payload CMS infrastructure
- **Runtime Decoupling**: Environment variables determine which business plugins load
- **Independent Databases**: Each business operates with its own SQLite database
- **Docker Deployment**: Each business runs in separate containers on different ports

### Environment-Based Plugin Loading
```typescript
// Runtime plugin selection based on BUSINESS_MODE environment variable
const activePlugins = {
  intellitrade: [intellitradePlugin()],
  salarium: [salariumPlugin()],
  latinos: [latinosPlugin()],
  all: [intellitradePlugin(), salariumPlugin(), latinosPlugin()]
}
```

### Deployment Strategy
- **IntelliTrade**: Port 3001 with intellitrade.db
- **Salarium**: Port 3002 with salarium.db
- **Latinos**: Port 3003 with latinos.db
- **Development**: Port 3000 with all plugins active

## Business Plugin Structure

Each business is implemented as a self-contained Payload plugin containing:
- Collections (data models)
- Blocks (content components)
- Components (UI elements)
- Business-specific logic

## Future Detachment Strategy

When ready to separate a business:
1. Copy entire codebase
2. Remove unused business plugins
3. Configure environment for single business
4. Deploy independently

This approach provides shared development benefits while maintaining easy business separation capabilities.

## Current Implementation

The platform serves as an open public showcase where users can:
- Learn about product characteristics, benefits, and pricing
- Meet the product team
- Access full interactive demos with gamification and education when registered

All functionality runs within the Payload platform with a look and feel similar to the Payload website (https://payloadcms.com/).

Pages are created using Payload CMS collections and endpoints, following Payload documentation patterns (https://payloadcms.com/docs/getting-started/what-is-payload).
