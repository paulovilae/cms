# Latinos Trading Bot System - Seed Data

This directory contains comprehensive seed data for the Latinos Trading Bot System collections. The seed system populates the database with realistic sample data for testing and demonstration purposes.

## Overview

The seed system creates sample data for all Latinos collections:

- **Market Data**: Real-time market data for popular stocks and cryptocurrencies
- **Trading Strategies**: Various algorithmic trading strategies (RSI, MACD, Bollinger Bands, etc.)
- **Trading Bots**: Sample trading bots using different strategies and symbols
- **Trading Formulas**: Formula configurations linked to specific bots
- **Trading Trades**: Historical trade records with realistic profit/loss data

## Usage

### 1. Using the Seed Endpoint (Recommended)

The easiest way to seed data is through the REST API endpoint:

```bash
# Seed fresh data
curl -X POST http://localhost:3003/api/latinos/seed \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action": "seed"}'

# Clear all data
curl -X POST http://localhost:3003/api/latinos/seed \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action": "clear"}'

# Clear and reseed (fresh start)
curl -X POST http://localhost:3003/api/latinos/seed \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action": "reseed"}'
```

### 2. Programmatic Usage

You can also use the seed functions directly in your code:

```typescript
import { seedLatinosData, clearLatinosData } from '@/plugins/business/latinos'

// Seed all Latinos data
await seedLatinosData(payload)

// Clear all Latinos data
await clearLatinosData(payload)
```

### 3. Integration with Main Seed Script

The Latinos seed functions can be integrated into the main project seed script:

```typescript
import { seedLatinosData } from '@/plugins/business/latinos'

// In your main seed function
if (process.env.BUSINESS_MODE === 'latinos' || process.env.BUSINESS_MODE === 'all') {
  await seedLatinosData(payload)
}
```

## Sample Data Details

### Market Data (12 entries)

- **Stocks**: AAPL, GOOGL, MSFT, TSLA, AMZN, NVDA, META, NFLX, AMD, INTC
- **Crypto**: BTC-USD, ETH-USD
- Includes realistic price data, volume, 24h changes, market cap

### Trading Strategies (6 strategies)

1. **RSI Oversold/Overbought**: Conservative RSI-based strategy
2. **Golden Cross MA Strategy**: Moving average crossover strategy
3. **MACD Momentum**: MACD-based momentum strategy
4. **Bollinger Band Squeeze**: Volatility-based strategy
5. **Multi-Timeframe RSI**: Custom multi-timeframe approach
6. **Scalping Quick Profits**: High-frequency scalping strategy

### Trading Bots (8 bots)

- **Active Bots**: Apple RSI, Google MA, NVIDIA Bollinger, Microsoft Multi-timeframe, Bitcoin RSI
- **Paused Bots**: Tesla MACD
- **Stopped Bots**: Amazon Scalper
- **Error Bots**: Meta MACD (for testing error scenarios)

### Trading Formulas (8 formulas)

- Each bot has a corresponding formula with specific parameters
- Includes buy/sell conditions based on technical indicators
- Mix of active and inactive formulas for testing

### Trading Trades (17 trades)

- **Successful Trades**: Profitable trades with realistic profit amounts
- **Failed Trades**: Loss-making trades for realistic scenarios
- **Open Trades**: Current positions for live testing
- **Various Statuses**: filled, open, cancelled, rejected, expired

## Data Relationships

The seed data maintains proper relationships between collections:

```
Market Data (symbols) ← Trading Bots (symbol reference)
Trading Strategies ← Trading Bots (strategy relationship)
Trading Bots ← Trading Formulas (bot relationship)
Trading Bots ← Trading Trades (bot relationship)
```

## Realistic Features

### Profit/Loss Scenarios

- **Profitable Bots**: Apple RSI (+$1,247), NVIDIA Bollinger (+$2,156), Microsoft (+$1,834)
- **Loss-Making Bots**: Tesla MACD (-$234), Meta MACD (-$89)
- **Mixed Results**: Various win rates and performance metrics

### Bot Status Variety

- **Active**: Currently running bots with recent execution times
- **Paused**: Temporarily stopped bots
- **Stopped**: Manually stopped bots
- **Error**: Bots with technical issues

### Trading Patterns

- **Day Trading**: Short-term trades with quick profits
- **Swing Trading**: Medium-term positions
- **Scalping**: High-frequency micro-profits
- **Crypto Trading**: 24/7 cryptocurrency trading

## Development Tips

### Testing Scenarios

The seed data provides various scenarios for testing:

1. **Performance Analytics**: Mix of profitable and losing bots
2. **Status Management**: Different bot states for UI testing
3. **Real-time Updates**: Open trades for live data simulation
4. **Error Handling**: Failed trades and error states
5. **Multi-asset Trading**: Stocks and crypto for diverse testing

### Customization

To customize the seed data:

1. **Edit Individual Files**: Modify specific seed files for your needs
2. **Add New Data**: Extend arrays in seed files with additional entries
3. **Adjust Relationships**: Ensure proper ID relationships when adding data
4. **Update Parameters**: Modify trading parameters for different strategies

### Database Considerations

- **Order Matters**: Collections are seeded in dependency order
- **ID Handling**: String IDs are converted to numbers for relationships
- **Error Recovery**: Individual creation failures don't stop the entire process
- **Cleanup**: Always use the clear function before reseeding

## Troubleshooting

### Common Issues

1. **Authentication Required**: Ensure you're logged in when using the API endpoint
2. **Relationship Errors**: Check that strategy IDs exist before creating bots
3. **Type Mismatches**: Verify field types match collection definitions
4. **Missing Dependencies**: Ensure all prerequisite collections are seeded first

### Debug Information

The seed process provides detailed logging:

- Collection-by-collection progress
- Individual creation success/failure
- Total counts and timing information
- Error details for failed operations

## Integration with Microservices

The seed data includes microservice integration fields:

- `microserviceId`: Links to Python FastAPI trading service
- `microserviceTradeId`: References for trade synchronization
- Realistic IDs for testing microservice communication

This allows for full end-to-end testing of the trading bot system including external service integration.
