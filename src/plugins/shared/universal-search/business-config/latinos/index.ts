import { BusinessSearchConfig } from '../../types/business-config.types'

/**
 * Latinos-specific search configuration
 * Focused on trading bot performance, strategies, market segments,
 * and trading metrics
 */
export const latinosSearchConfig: BusinessSearchConfig = {
  searchFields: [
    // Bot information fields with high weights
    { name: 'name', weight: 2.5, boost: 'exact' },
    { name: 'description', weight: 2.0, type: 'richText' },
    { name: 'strategy.name', weight: 2.2, type: 'relationship' },

    // Performance metrics with high weights
    { name: 'performance.roi', weight: 2.0, type: 'number' },
    { name: 'performance.winRate', weight: 2.0, type: 'number' },
    { name: 'performance.profitFactor', weight: 1.8, type: 'number' },

    // Market and risk fields with medium weights
    { name: 'tradingPairs', weight: 1.7, type: 'array' },
    { name: 'marketSegment', weight: 1.5 },
    { name: 'riskLevel', weight: 1.5 },

    // Technical fields with lower weights
    { name: 'formula.name', weight: 1.3, type: 'relationship' },
    { name: 'timeframe', weight: 1.2 },
    { name: 'executionType', weight: 1.0 },
  ],

  filters: [
    // Strategy filters
    {
      key: 'strategy',
      label: 'Strategy',
      type: 'relationship',
      relationTo: 'trading-strategies',
      fieldPath: 'strategy',
    },
    {
      key: 'formula',
      label: 'Trading Formula',
      type: 'relationship',
      relationTo: 'trading-formulas',
      fieldPath: 'formula',
      dependsOn: 'strategy',
    },

    // Performance filters
    {
      key: 'performance.roi',
      label: 'Return on Investment',
      type: 'range',
      min: -100,
      max: 500,
      step: 5,
      unit: '%',
      fieldPath: 'performance.roi',
    },
    {
      key: 'performance.winRate',
      label: 'Win Rate',
      type: 'range',
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      fieldPath: 'performance.winRate',
    },

    // Market and risk filters
    {
      key: 'tradingPairs',
      label: 'Trading Pairs',
      type: 'multiselect',
      options: [
        { label: 'BTC/USD', value: 'btc-usd' },
        { label: 'ETH/USD', value: 'eth-usd' },
        { label: 'BNB/USD', value: 'bnb-usd' },
        { label: 'SOL/USD', value: 'sol-usd' },
        { label: 'ADA/USD', value: 'ada-usd' },
        { label: 'XRP/USD', value: 'xrp-usd' },
        { label: 'DOT/USD', value: 'dot-usd' },
        { label: 'AVAX/USD', value: 'avax-usd' },
      ],
      multiple: true,
      fieldPath: 'tradingPairs',
    },
    {
      key: 'marketSegment',
      label: 'Market Segment',
      type: 'select',
      options: [
        { label: 'Cryptocurrency', value: 'crypto' },
        { label: 'Forex', value: 'forex' },
        { label: 'Stocks', value: 'stocks' },
        { label: 'Commodities', value: 'commodities' },
        { label: 'Indices', value: 'indices' },
      ],
      fieldPath: 'marketSegment',
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      type: 'select',
      options: [
        { label: 'Conservative', value: 'conservative' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Aggressive', value: 'aggressive' },
        { label: 'Very Aggressive', value: 'very-aggressive' },
      ],
      fieldPath: 'riskLevel',
    },

    // Technical filters
    {
      key: 'timeframe',
      label: 'Timeframe',
      type: 'select',
      options: [
        { label: '1 Minute', value: '1m' },
        { label: '5 Minutes', value: '5m' },
        { label: '15 Minutes', value: '15m' },
        { label: '1 Hour', value: '1h' },
        { label: '4 Hours', value: '4h' },
        { label: 'Daily', value: '1d' },
        { label: 'Weekly', value: '1w' },
      ],
      fieldPath: 'timeframe',
    },

    // Bot status filter
    {
      key: 'status',
      label: 'Bot Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Backtesting', value: 'backtesting' },
        { label: 'Development', value: 'development' },
        { label: 'Deprecated', value: 'deprecated' },
      ],
      fieldPath: 'status',
    },
  ],

  actions: [
    {
      id: 'view',
      label: 'View Bot Details',
      icon: 'Eye',
      requiresSelection: true,
      handler: 'viewTradingBot',
      permission: ({ user }) => !!user,
    },
    {
      id: 'edit',
      label: 'Edit Bot',
      icon: 'Edit',
      requiresSelection: true,
      handler: 'editTradingBot',
      permission: ({ user, item }) =>
        !!user && (user.role === 'admin' || user.id === item.createdBy),
    },
    {
      id: 'duplicate',
      label: 'Duplicate Bot',
      icon: 'Copy',
      requiresSelection: true,
      handler: 'duplicateTradingBot',
      permission: ({ user }) => !!user,
    },
    {
      id: 'toggleStatus',
      label: 'Activate Bot',
      icon: 'Play',
      requiresSelection: true,
      handler: 'toggleBotStatus',
      permission: ({ user, item }) =>
        !!user && (user.role === 'admin' || user.id === item.createdBy),
      dynamicLabel: (item) => {
        if (item.status === 'active') return 'Pause Bot'
        if (item.status === 'paused') return 'Activate Bot'
        return 'Activate Bot'
      },
    },
    {
      id: 'viewPerformance',
      label: 'View Performance',
      icon: 'BarChart',
      requiresSelection: true,
      handler: 'viewBotPerformance',
      permission: ({ user }) => !!user,
    },
    {
      id: 'runBacktest',
      label: 'Run Backtest',
      icon: 'Rewind',
      requiresSelection: true,
      handler: 'runBotBacktest',
      permission: ({ user }) => !!user && (user.role === 'admin' || user.role === 'developer'),
    },
  ],

  previewConfig: {
    layout: 'card',
    fields: [
      {
        key: 'name',
        label: 'Bot Name',
        formatter: 'highlightMatch',
        typographyVariant: 'h3',
        highlightMatches: true,
      },
      {
        key: 'strategy.name',
        label: 'Strategy',
        formatter: 'relationship',
        typographyVariant: 'body1',
      },
      {
        key: 'tradingPairs',
        label: 'Trading Pairs',
        formatter: 'tags',
        maxItems: 3,
        typographyVariant: 'body2',
      },
      {
        key: 'performance.roi',
        label: 'ROI',
        formatter: 'percentage',
        typographyVariant: 'h4',
        fields: {
          value: 'performance.roi',
          suffix: '%',
          colorPositive: 'green',
          colorNegative: 'red',
        },
      },
      {
        key: 'performance.winRate',
        label: 'Win Rate',
        formatter: 'percentage',
        typographyVariant: 'body1',
      },
      {
        key: 'riskLevel',
        label: 'Risk Level',
        formatter: 'badge',
        statusColors: {
          conservative: 'green',
          moderate: 'blue',
          aggressive: 'orange',
          'very-aggressive': 'red',
        },
      },
      {
        key: 'status',
        label: 'Status',
        formatter: 'badge',
        statusColors: {
          active: 'green',
          paused: 'orange',
          backtesting: 'blue',
          development: 'purple',
          deprecated: 'gray',
        },
      },
      {
        key: 'marketSegment',
        label: 'Market',
        formatter: 'text',
        typographyVariant: 'body2',
      },
      {
        key: 'lastUpdated',
        label: 'Last Updated',
        formatter: 'date',
        typographyVariant: 'body2',
      },
    ],
    thumbnail: {
      field: 'strategy.icon',
      fallback: '/images/default-strategy-icon.png',
      width: 64,
      height: 64,
      alt: 'Strategy Icon',
    },
  },

  aiPromptCustomizations: {
    systemPrompt:
      'You are a trading assistant helping to find trading bots, strategies, and performance information. ' +
      'You understand trading terminology, technical indicators, risk levels, and performance metrics.',

    queryEnhancement:
      'Given the user\'s search query "{query}" about trading bots or strategies, expand this into a more comprehensive search. ' +
      'Consider trading strategies, performance metrics, risk levels, and market segments that might be relevant. ' +
      'If trading abbreviations are used (like "MACD" or "RSI"), include both the abbreviation and full term.',

    contextData: {
      entityType: 'trading bot',
      terminology: {
        ma: 'Moving Average',
        ema: 'Exponential Moving Average',
        macd: 'Moving Average Convergence Divergence',
        rsi: 'Relative Strength Index',
        bb: 'Bollinger Bands',
        atr: 'Average True Range',
        roi: 'Return on Investment',
        pf: 'Profit Factor',
        dd: 'Drawdown',
        sl: 'Stop Loss',
        tp: 'Take Profit',
      },
      tradingStrategies: [
        'Trend Following',
        'Mean Reversion',
        'Breakout',
        'Momentum',
        'Statistical Arbitrage',
        'Scalping',
        'Swing Trading',
      ],
      riskLevels: ['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'],
      timeframes: ['1m', '5m', '15m', '1h', '4h', '1d', '1w'],
    },

    suggestionPrompt:
      "Based on the user's search for '{query}' related to trading bots, suggest 3-5 related searches that might help them find relevant bots or strategies. " +
      'Consider related trading strategies, performance metrics, or market segments.',
  },
}
