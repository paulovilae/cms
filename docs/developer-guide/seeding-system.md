# IntelliTrade CMS - Database Seed Script

This script allows you to seed the IntelliTrade CMS database with initial data including:
- Team members
- Testimonials
- Features
- Pricing plans
- Companies
- Export transactions
- Routes
- Smart contracts
- Salarium collections (HR workflow system)
- Latinos collections (Trading bot system)
- Pages
- Posts
- Categories
- Forms

## Prerequisites

1. **Development Server Running**
   - The script requires the development server to be running
   - Run `npm run dev` or `pnpm dev` in a separate terminal window before executing the seed script

2. **User Credentials**
   - The script uses the following credentials for authentication:
     - Email: `test@test.com`
     - Password: `test`
   - Make sure this user exists in your database (created during initial setup)

## Usage

### Windows
Run the provided batch file:
```
seed.bat
```

### Manual Execution
Run the script directly with Node.js:
```
node seed-script.js
```

## Troubleshooting

If you encounter errors:

1. **Connection Refused**
   - Ensure the development server is running (`npm run dev` or `pnpm dev`)
   - Verify the server URL (default: http://localhost:3003)
   - Check if a custom port is configured in your environment

2. **Authentication Errors**
   - Verify that a user with email `test@test.com` and password `test` exists
   - You may need to create this user manually through the admin interface

3. **Seeding Errors**
   - Check the console output for specific error messages
   - Database might already have conflicting data; consider resetting the database if needed

## How It Works

The seed script:
1. Authenticates with the Payload CMS API using the provided credentials
2. Makes a request to the `/next/seed` endpoint
3. The endpoint runs the seed function from `src/endpoints/seed/index.ts`
4. The seed function clears existing data and creates new records for all collections

### Business Collections Seeded

**IntelliTrade Collections:**
- Companies (exporters and importers)
- Export transactions with blockchain verification
- Routes (shipping routes between ports)
- Smart contracts for trade finance

**Salarium Collections:**
- Organizations and departments
- Job families and career progression
- Flow templates for HR workflows

**Latinos Collections:**
- Market data for stocks and cryptocurrencies
- Trading strategies (RSI, MACD, Bollinger Bands, etc.)
- Trading bots with different risk levels
- Trading formulas with technical indicators
- Trading trades with profit/loss history

## Customization

If you need to customize the seeding process:
1. Modify the seed data in the corresponding files under `src/endpoints/seed/`
2. Adjust the server URL in the script if using a non-default port