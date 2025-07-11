# Current Project Context

## 🐳 Docker Deployment Configuration

**⚠️ ALWAYS REMEMBER: This project runs in Docker containers!**

### Container Setup
- **Container Names**:
  - `cms-salarium-1` (Salarium HR Platform)
  - `cms-intellitrade-1` (IntelliTrade Finance)
  - `cms-latinos-1` (Latinos Trading)
  - `cms-dev-all-1` (Development - all plugins)

### Port Configuration
- **Salarium**: Port 3005 (`http://localhost:3005`)
- **IntelliTrade**: Port 3004 (`http://localhost:3004`)
- **Latinos**: Port 3003 (`http://localhost:3003`)
- **Development**: Port 3006 (`http://localhost:3006`)

### Quick Access URLs
- **Salarium**: `http://localhost:3005/salarium/job-flow?autoLogin=true`
- **IntelliTrade**: `http://localhost:3004/intellitrade?autoLogin=true`
- **Latinos**: `http://localhost:3003/latinos?autoLogin=true`

### Default Test Credentials
- **Email**: `test@test.com`
- **Password**: `Test12345%`
- **Role**: Admin with full access

## Current Status

The platform is production-ready with comprehensive multi-tenant capabilities.

### ✅ COMPLETED Major Systems
- **Latinos Trading Bot System**: With microservice integration
- **AFFiNE Integration Layer**: Real-time collaboration
- **Business-Specific Routing**: Multi-tenant URL routing
- **URL-Based Authentication**: Quick access authentication
- **Multi-Tenant Architecture**: Docker configuration
- **Standard Payload Alignment**: Consistent API patterns
- **Salarium Job Description Workflow**: AI-powered creation
- **Job Flow Cascade Rich Text Editor**: Word-like document editing with error resilience

### 🚀 CURRENT INITIATIVE: Universal AI-Powered Search
- **Current Focus**: AI-powered search system across all business units
- **Key Features**:
  - Semantic search with natural language queries
  - Intent recognition for complex requests
  - Smart suggestions based on patterns
  - Universal modularity (90% cross-business reuse)
  - Sub-200ms response times

## Next Development Opportunities
1. **Universal AI Search Implementation**: Phase 1 core search
2. **Capacita Business Unit**: AI-powered training platform
3. **IntelliTrade Trade-Flow**: KYC workflow
4. **Cross-Business Search**: Semantic similarity across collections
5. **Enhanced Analytics**: Business-specific AI insights
6. **Rich Text Editor AI Integration**: Content suggestions and automated generation