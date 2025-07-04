# Package Managers and Turbopack Setup

This guide covers setting up fast package managers (pnpm, yarn) and Turbopack for optimal development performance.

## Package Managers Comparison

### Performance Comparison
| Package Manager | Speed | Disk Usage | Features |
|----------------|-------|------------|----------|
| **pnpm** | ⚡⚡⚡ Fastest | 💾 Most efficient | Workspaces, strict mode |
| **yarn** | ⚡⚡ Fast | 💾💾 Moderate | Workspaces, plug'n'play |
| **npm** | ⚡ Standard | 💾💾💾 Largest | Built-in, universal |

### Recommended: pnpm
pnpm is the fastest and most disk-efficient package manager, using hard links and symlinks to avoid duplication.

## Installation

### Install Package Managers Globally

```bash
# Install pnpm (recommended)
npm install -g pnpm@latest

# Install yarn (alternative)
npm install -g yarn

# Verify installations
pnpm --version
yarn --version
```

### Windows PATH Issues
If commands aren't recognized after installation, restart your terminal or add to PATH:

```powershell
# Check npm global path
npm config get prefix

# Add to PATH if needed (replace with your npm prefix)
$env:PATH += ";C:\Users\[username]\AppData\Roaming\npm"
```

## Project Setup

### Using pnpm (Recommended)
```bash
# Install dependencies
pnpm install

# Start development with Turbopack
pnpm dev

# Build for production
pnpm build

# Other commands
pnpm lint
pnpm generate:types
pnpm seed
```

### Using yarn (Alternative)
```bash
# Install dependencies
yarn install

# Start development with Turbopack
yarn dev

# Build for production
yarn build

# Other commands
yarn lint
yarn generate:types
yarn seed
```

### Using npm (Fallback)
```bash
# Install dependencies
npm install

# Start development with Turbopack
npm run dev

# Build for production
npm run build

# Other commands
npm run lint
npm run generate:types
npm run seed
```

## Turbopack Configuration

### What is Turbopack?
Turbopack is Next.js's new bundler (successor to Webpack) that provides:
- ⚡ **10x faster** than Webpack
- 🔄 **Incremental compilation** - only rebuilds what changed
- 🎯 **Better error messages** and debugging
- 🚀 **Faster HMR** (Hot Module Replacement)

### Current Configuration

The project is already configured with Turbopack in `package.json`:

```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev --turbo -p 3003 -H 0.0.0.0"
  }
}
```

Key flags:
- `--turbo`: Enables Turbopack bundler
- `-p 3003`: Runs on port 3003
- `-H 0.0.0.0`: Allows external connections (useful for Docker)

### Performance Benefits

With Turbopack enabled, you'll experience:
- **Faster startup times** - Initial compilation is significantly faster
- **Instant HMR** - Changes reflect immediately in the browser
- **Better memory usage** - More efficient resource utilization
- **Improved error handling** - Clearer error messages and stack traces

## Docker Configuration

### Dockerfile with Fast Package Managers

The Dockerfile should prioritize the fastest available package manager:

```dockerfile
FROM node:20-alpine

# Install package managers
RUN npm install -g pnpm@latest yarn

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml* yarn.lock* ./

# Install dependencies with fastest available manager
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy source code
COPY . .

# Build application
RUN if command -v pnpm > /dev/null; then \
      pnpm build; \
    elif command -v yarn > /dev/null; then \
      yarn build; \
    else \
      npm run build; \
    fi

# Start with Turbopack in development
CMD if [ "$NODE_ENV" = "development" ]; then \
      if command -v pnpm > /dev/null; then \
        pnpm dev; \
      elif command -v yarn > /dev/null; then \
        yarn dev; \
      else \
        npm run dev; \
      fi; \
    else \
      if command -v pnpm > /dev/null; then \
        pnpm start; \
      elif command -v yarn > /dev/null; then \
        yarn start; \
      else \
        npm start; \
      fi; \
    fi
```

### Docker Compose with Package Manager Selection

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=development
      - PREFERRED_PACKAGE_MANAGER=pnpm  # or yarn, npm
    volumes:
      - .:/app
      - /app/node_modules
```

## Performance Optimization

### pnpm Configuration

Create `.npmrc` for pnpm optimizations:

```ini
# .npmrc
# Use pnpm for faster installs
package-manager=pnpm

# Enable strict peer dependencies
strict-peer-dependencies=true

# Use hard links for better performance
link-workspace-packages=true

# Faster installs
prefer-frozen-lockfile=true
```

### Yarn Configuration

Create `.yarnrc.yml` for yarn optimizations:

```yaml
# .yarnrc.yml
nodeLinker: node-modules
enableGlobalCache: true
compressionLevel: mixed
```

## Troubleshooting

### Common Issues

#### 1. Package Manager Not Found
```bash
# Error: 'pnpm' is not recognized
# Solution: Restart terminal or add to PATH
npm config get prefix
# Add the returned path to your system PATH
```

#### 2. Permission Errors (Windows)
```powershell
# Run as administrator or use:
npm config set prefix %APPDATA%\npm
```

#### 3. Turbopack Build Errors
```bash
# If Turbopack fails, fallback to Webpack:
npm run dev -- --no-turbo
```

#### 4. Lock File Conflicts
```bash
# If you have multiple lock files, choose one:
rm package-lock.json  # Keep pnpm-lock.yaml
# or
rm pnpm-lock.yaml     # Keep package-lock.json
```

### Performance Monitoring

Monitor build performance:

```bash
# With timing information
pnpm dev --profile

# With detailed stats
NEXT_TELEMETRY_DEBUG=1 pnpm dev
```

## Best Practices

### 1. Use pnpm for Development
- Fastest installation and updates
- Most disk-efficient
- Better dependency management

### 2. Keep Lock Files in Version Control
- Always commit `pnpm-lock.yaml` or `yarn.lock`
- Ensures consistent dependencies across environments

### 3. Use Turbopack for Development
- Significantly faster than Webpack
- Better debugging experience
- Automatic optimization

### 4. Docker Optimization
- Use multi-stage builds
- Leverage build cache
- Install only production dependencies in final stage

### 5. CI/CD Optimization
```yaml
# GitHub Actions example
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: latest

- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Build with Turbopack
  run: pnpm build
```

## Scripts Reference

The project includes optimized scripts for all package managers:

```json
{
  "scripts": {
    "dev": "next dev --turbo -p 3003",
    "build": "next build",
    "start": "next start -p 3003",
    "lint": "next lint",
    "generate:types": "payload generate:types",
    "seed": "node seed-script.js"
  }
}
```

All scripts work with any package manager:
- `pnpm [script]`
- `yarn [script]`
- `npm run [script]`

---

*This setup provides the fastest possible development experience with modern tooling and optimizations.*