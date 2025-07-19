# Multi-Tenant Business Platform

A plugin-based CMS with versioned implementations for each business unit, where all knowledge and functionality is shared through a centralized plugin system.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)
![Payload CMS](https://img.shields.io/badge/payload-cms-orange.svg)

## 🚀 Overview

This platform enables multiple business units to share functionality while maintaining their unique requirements through a sophisticated plugin architecture. Each business unit can develop specialized plugins while leveraging shared components and core services.

## 🏗️ Architecture

### Core Principles

- **Plugin-Centric Design**: All business logic encapsulated in versioned plugins
- **Knowledge Sharing**: Cross-business learning through shared plugins
- **Centralized Management**: Unified administration and monitoring
- **Scalable Structure**: Three-tier plugin organization

### Plugin Organization

```
cms/src/plugins/
├── core/          # Essential plugins required by all applications
├── shared/        # Optional plugins reusable across businesses
└── [business]/    # Business-specific plugins (e.g., intellitrade/)
```

## 🏢 Business Units

| Business Unit | Domain | Dev Port | Key Plugins |
|---------------|--------|----------|-------------|
| **Latinos** | latinos.paulovila.org | 3003 | trading-core, market-data, bot-engine |
| **IntelliTrade** | intellitrade.paulovila.org | 3004 | blockchain, smart-contracts, kyb-verification |
| **Salarium** | salarium.paulovila.org | 3005 | hr-workflows, compensation-analysis, job-designer |
| **Capacita** | capacita.paulovila.org | 3007 | avatar-engine, training-scenarios, skill-evaluator |
| **CMS Admin** | cms.paulovila.org | 3006 | admin-core, user-management, plugin-manager |

## 🛠️ Technology Stack

### Core Technologies
- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express, Payload CMS
- **Database**: SQLite (development), MongoDB (production)
- **Authentication**: JWT, OAuth
- **Styling**: CSS Modules, Tailwind CSS

### Development Tools
- **Build Tools**: Webpack, Babel
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint with custom rules
- **Formatting**: Prettier
- **Version Control**: Git with conventional commits

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm v9+
- SQLite3 (for development)
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/paulovilae/cms.git
   cd cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up all instances**
   ```bash
   npm run setup-instances
   npm run install-all-instances
   ```

4. **Start all services**
   ```bash
   npm run start-all-instances
   ```

### Individual Instance Setup

For working with a specific business unit:

```bash
# Navigate to specific instance
cd instances/[business-name]

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
├── cms/                    # Central CMS implementation
│   ├── cms-sqlite/        # SQLite-based CMS
│   └── src/
│       └── plugins/       # Central plugin repository
├── instances/             # Business-specific implementations
│   ├── cms-admin/        # Admin interface
│   ├── intellitrade/     # IntelliTrade business logic
│   ├── salarium/         # Salarium HR platform
│   ├── latinos/          # Latinos trading platform
│   └── capacita/         # Capacita training platform
├── plugins/              # Plugin development area
│   ├── core/            # Essential plugins
│   ├── shared/          # Reusable plugins
│   └── [business]/      # Business-specific plugins
├── docs/                # Documentation
├── scripts/             # Automation scripts
└── tests/               # Test suites
```

## 🔌 Plugin Development

### Plugin Types

1. **Core Plugins** (`plugins/core/`)
   - Essential for all applications
   - Authentication, data layer, error handling
   - API core functionality

2. **Shared Plugins** (`plugins/shared/`)
   - Optional, reusable across businesses
   - AI services, analytics, internationalization
   - Real-time collaboration tools

3. **Business-Specific Plugins** (`plugins/[business]/`)
   - Unique business logic and UI
   - Custom workflows and integrations
   - Specialized features

### Plugin Lifecycle

1. **Development**: Create and test in business-specific apps
2. **Promotion**: Move stable plugins to central repository
3. **Publishing**: Version and publish to private npm registry
4. **Deployment**: Install in target implementations

### Creating a Plugin

```bash
# Navigate to appropriate plugin directory
cd plugins/shared/my-plugin

# Create plugin structure
mkdir -p src/{collections,globals,seed}
touch src/index.ts README.md package.json

# Develop your plugin following our standards
# See docs/general/architecture/ for detailed guides
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific business unit
cd instances/[business-name]
npm test

# Run plugin tests
cd plugins/[plugin-type]/[plugin-name]
npm test
```

### Testing Standards

- 90%+ test coverage required
- Cross-version compatibility validation
- Performance benchmarks
- Integration testing across plugins

## 📚 Documentation

### Key Documentation

- **Architecture**: `docs/general/architecture/`
- **Plugin Development**: `docs/general/architecture/enhanced-plugin-standards.md`
- **API Reference**: `docs/api/`
- **Business Logic**: `docs/[business]/`

### Memory Bank

The project includes a comprehensive memory bank system in `.kilocode/rules/memory-bank/` containing:

- Project overview and goals
- Technical specifications
- Development workflows
- Best practices and learnings

## 🔒 Security

### Security Practices

- Vulnerability scanning for all dependencies
- Regular security audits
- Access controls and authentication
- Data encryption and privacy protection

### Compliance

Each business unit maintains compliance with relevant regulations:
- **IntelliTrade**: Financial services compliance
- **Salarium**: HR data protection
- **Latinos**: Trading regulations
- **Capacita**: Educational standards

## 🚀 Deployment

### Development Environment

```bash
# Start all instances
npm run start-all-instances

# Stop all instances
npm run stop-all-instances
```

### Production Deployment

1. **Build all instances**
   ```bash
   npm run build-all
   ```

2. **Deploy to respective domains**
   - Each business unit deploys to its own domain
   - Shared plugins are distributed via private npm registry

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Develop following our standards**
   - Read memory bank documentation
   - Follow plugin development guidelines
   - Maintain test coverage
4. **Submit a pull request**

### Code Standards

- TypeScript for type safety
- ESLint and Prettier for code quality
- Comprehensive documentation required
- Plugin-first architecture

## 📊 Monitoring and Analytics

### Performance Monitoring

- Real-time performance metrics
- Plugin usage analytics
- Cross-business insights
- Resource utilization tracking

### Business Intelligence

- Shared analytics across business units
- Custom dashboards per business
- Data-driven decision making
- Performance benchmarking

## 🆘 Support

### Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Team Chat**: Internal team communication channels

### Troubleshooting

Common issues and solutions are documented in:
- `docs/troubleshooting/`
- Plugin-specific README files
- Memory bank learnings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Payload CMS](https://payloadcms.com/)
- Powered by [Next.js](https://nextjs.org/)
- TypeScript for type safety
- Community contributions and feedback

---

**Made with ❤️ by Paulo Vila**

For more information, visit our [documentation](docs/) or contact the development team.