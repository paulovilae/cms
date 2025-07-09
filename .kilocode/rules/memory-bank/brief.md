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


### 2. Salarium - AI-Powered HR Assistant Platform

## Purpose

Salarium is a comprehensive AI-powered HR assistant platform that revolutionizes human resources processes through intelligent automation, data-driven insights, and streamlined workflows. It serves as a complete HR solution for modern organizations seeking to optimize their human capital management.

## Problems Solved

The platform addresses critical HR challenges across organizations:

1. **Manual Job Description Creation**: Time-consuming, inconsistent job descriptions that don't reflect market standards
2. **Compensation Analysis Complexity**: Difficulty in determining competitive salaries and maintaining pay equity
3. **Market Information Gaps**: Lack of real-time market data for informed HR decisions
4. **Benefits Analysis Inefficiency**: Complex benefits package evaluation and optimization
5. **HR Workflow Bottlenecks**: Manual document processing and approval workflows
6. **Compliance Management**: Difficulty tracking and maintaining HR compliance requirements

## Core Functionality

### AI-Assisted Job Description Creation

The platform provides intelligent job description assistance:
- Market-based skill requirement analysis
- Industry-standard job template generation
- Automated job posting optimization
- Real-time market alignment suggestions
- Compliance and legal requirement integration

### AI-Assisted Compensation Analysis

Advanced compensation management features:
- Market salary benchmarking and analysis
- Pay equity analysis and recommendations
- Compensation structure optimization
- Regional and industry-specific adjustments
- Performance-based compensation modeling

### Market Information & Benchmarking

Comprehensive market intelligence:
- Real-time industry salary data integration
- Regional market analysis and trends
- Competitive positioning insights
- Skills demand forecasting
- Talent market analytics

### Benefits Analysis & Optimization

Intelligent benefits management:
- Benefits package cost-benefit analysis
- Employee satisfaction correlation analysis
- Competitive benefits benchmarking
- ROI analysis for benefits programs
- Personalized benefits recommendations

### HR Workflow Automation

Streamlined HR processes:
- Document flow management and automation
- Approval process optimization
- Compliance tracking and reporting
- Employee lifecycle management
- Performance review automation

### Talent Analytics & Insights

Data-driven HR decision making:
- Employee performance analytics
- Retention prediction modeling
- Skills gap analysis
- Workforce planning insights
- Diversity and inclusion metrics

## User Experience Goals

### For HR Professionals
- **Intelligent Assistance**: AI-powered recommendations for all HR decisions
- **Time Efficiency**: Automated workflows that reduce manual tasks by 70%
- **Data-Driven Insights**: Real-time analytics for informed decision making
- **Compliance Confidence**: Automated compliance tracking and alerts

### For Managers
- **Simplified Hiring**: Streamlined job description and compensation processes
- **Performance Management**: Easy-to-use performance review and feedback tools
- **Team Analytics**: Insights into team performance and development needs

### For Employees
- **Transparent Processes**: Clear visibility into HR processes and timelines
- **Self-Service Options**: Employee self-service for common HR tasks
- **Career Development**: AI-powered career path recommendations

## Success Indicators

- **Process Efficiency**: 70% reduction in HR task completion time
- **Accuracy Improvement**: 95% accuracy in job description and compensation analysis
- **User Satisfaction**: >85% satisfaction rate among HR professionals
- **Compliance Rate**: 99% compliance with HR regulations and requirements
- **Cost Reduction**: 40% reduction in HR operational costs
- **Time-to-Hire**: 50% reduction in average time-to-hire metrics

### 3. Latinos - Trading Stocks Bot Platform
An automated trading platform with bot functionality for stock market operations.

### 4. Capacita - AI-Powered Training Platform
An advanced training system focused on client service excellence through gamified learning with real-time evaluation and feedback.

## Purpose

Capacita revolutionizes professional training by combining AI-generated content, complex character personas, and multi-stage evaluation to create immersive learning experiences that dramatically improve client-facing skills.

## Problems Solved

The platform addresses critical training challenges across industries:

1. **Ineffective Traditional Training**: Static content and role-playing exercises fail to prepare staff for real-world scenarios
2. **Lack of Realistic Practice**: Limited opportunities to practice with challenging customer types before facing real clients
3. **Inconsistent Evaluation**: Subjective assessments that don't provide actionable feedback for improvement
4. **Low Engagement**: Boring training materials that don't motivate learners to complete programs
5. **Industry-Specific Limitations**: Training systems that can't adapt to different industries and contexts
6. **Scalability Issues**: Difficulty providing personalized training at scale across large organizations

## Core Functionality

### Avatar Arena System

The heart of Capacita is the Avatar Arena - a sophisticated character simulation system featuring:
- **Complex Personas**: AI characters with detailed psychological profiles, behavioral patterns, and hidden agendas
- **Dynamic Interactions**: Characters that adapt and respond based on user behavior and emotional triggers
- **Progressive Difficulty**: From friendly customers to hostile, manipulative, or treacherous characters
- **Multi-Modal Responses**: Realistic voice, facial expressions, and body language that match personality traits

### RPG-Style Gamification

Capacita transforms training into an engaging game-like experience:
- **Narrative Storylines**: Rich contexts ranging from corporate scenarios to fantasy RPG adventures
- **Character Progression**: Users develop skills, unlock new challenges, and advance through levels
- **Achievement System**: Badges, points, and leaderboards that motivate continued learning
- **Branching Narratives**: Choices and outcomes that create personalized learning paths

### Multi-Stage Real-Time Evaluation

Advanced AI-powered assessment across three dimensions:
- **Stage 1 - Text Analysis**: Sentiment analysis, professionalism scoring, empathy detection
- **Stage 2 - Voice Evaluation**: Tone analysis, pace assessment, emotional intelligence measurement
- **Stage 3 - Visual Assessment**: Posture analysis, gesture recognition, engagement scoring

### Universal Training Engine

Core system designed for cross-industry application:
- **Adaptable Framework**: Evaluation criteria and scenarios that work across different industries
- **AI Content Generation**: Automated creation of training materials, scenarios, and character dialogues
- **Flexible Deployment**: Can be specialized for customer service, sales, healthcare, education, and more

## User Experience Goals

### For Trainees
- **Immersive Learning**: Feel like they're in a real conversation with challenging customers
- **Safe Practice Environment**: Make mistakes and learn without real-world consequences
- **Immediate Feedback**: Get instant, detailed analysis of their performance with specific recommendations
- **Engaging Progression**: Advance through increasingly difficult scenarios with clear skill development

### For Training Administrators
- **Comprehensive Analytics**: Detailed insights into trainee performance and improvement areas
- **Scalable Deployment**: Easily roll out training programs across large organizations
- **Customizable Content**: Adapt scenarios and evaluation criteria to specific business needs
- **ROI Tracking**: Measure training effectiveness and business impact

### Training Flow

1. User enters Avatar Arena and selects training storyline (corporate, fantasy, etc.)
2. System presents character persona with detailed background and personality
3. User engages in realistic conversation with AI avatar
4. Multi-stage evaluation analyzes text, voice, and visual performance in real-time
5. Detailed feedback provided with KPIs, highlights, and specific recommendations
6. User progresses through increasingly challenging personas and scenarios
7. Achievement system rewards skill development and completion milestones

## Success Indicators

- **Training Effectiveness**: 40% improvement in real-world performance metrics
- **Engagement**: >80% training completion rates with high user satisfaction
- **Persona Realism**: >90% user belief in character authenticity
- **Cross-Industry Adoption**: Successful deployment in 5+ different industries
- **Scalability**: Support for 10,000+ concurrent users
- **ROI**: Positive return on investment within 6 months of deployment

## Architecture Overview

### Plugin-Based Multi-Tenant System
- **Single Codebase**: All four businesses share core Payload CMS infrastructure
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
  capacita: [capacitaPlugin()],
  all: [intellitradePlugin(), salariumPlugin(), latinosPlugin(), capacitaPlugin()]
}
```

### Deployment Strategy
- **IntelliTrade**: Port 3001 with intellitrade.db
- **Salarium**: Port 3002 with salarium.db
- **Latinos**: Port 3003 with latinos.db
- **Capacita**: Port 3004 with capacita.db
- **Development**: Port 3000 with all plugins active

## Business Plugin Structure

Each business is implemented as a self-contained Payload plugin containing:
- Collections (data models)
- Blocks (content components)
- Components (UI elements)
- Business-specific logic

## Shared Plugin Architecture

### Core Functionality (Reusable)
- **Training Engine Plugin**: Universal training and evaluation system
- **AI Management Plugin**: AI provider management and integration
- **Gamification Plugin**: Achievement and progression systems
- **AFFiNE Integration**: Collaborative editing and workspace features

### Business-Specific Functionality
- **Capacita Plugin**: Customer service training specialization
- **Other Industry Plugins**: Healthcare training, sales training, etc.

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
