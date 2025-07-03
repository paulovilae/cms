/**
 * Bot Performance Analytics Block
 *
 * Provides detailed performance analytics and charts for trading bots,
 * including profit/loss analysis, trade history, and performance metrics.
 */

import type { Block } from 'payload'

export const BotPerformanceAnalytics: Block = {
  slug: 'botPerformanceAnalytics',
  labels: {
    singular: 'Bot Performance Analytics',
    plural: 'Bot Performance Analytics',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Performance Analytics',
      admin: {
        description: 'Analytics section title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description for the analytics section',
      },
    },
    {
      name: 'timeframe',
      type: 'group',
      label: 'Time Frame Settings',
      fields: [
        {
          name: 'defaultTimeframe',
          type: 'select',
          options: [
            { label: '24 Hours', value: '24h' },
            { label: '7 Days', value: '7d' },
            { label: '30 Days', value: '30d' },
            { label: '90 Days', value: '90d' },
            { label: '1 Year', value: '1y' },
            { label: 'All Time', value: 'all' },
          ],
          defaultValue: '30d',
          admin: {
            description: 'Default time frame for analytics',
          },
        },
        {
          name: 'allowTimeframeSelection',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow users to change the time frame',
          },
        },
        {
          name: 'customTimeframes',
          type: 'array',
          label: 'Custom Time Frames',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                description: 'Time frame value (e.g., 14d, 6m)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'chartSettings',
      type: 'group',
      label: 'Chart Configuration',
      fields: [
        {
          name: 'showProfitChart',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show profit/loss chart',
          },
        },
        {
          name: 'showPerformanceChart',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show performance metrics chart',
          },
        },
        {
          name: 'showVolumeChart',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show trading volume chart',
          },
        },
        {
          name: 'showWinRateChart',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show win rate chart',
          },
        },
        {
          name: 'chartType',
          type: 'select',
          options: [
            { label: 'Line Chart', value: 'line' },
            { label: 'Bar Chart', value: 'bar' },
            { label: 'Area Chart', value: 'area' },
            { label: 'Candlestick', value: 'candlestick' },
          ],
          defaultValue: 'line',
          admin: {
            description: 'Default chart type',
          },
        },
        {
          name: 'chartHeight',
          type: 'number',
          defaultValue: 400,
          min: 200,
          max: 800,
          admin: {
            description: 'Chart height in pixels',
          },
        },
      ],
    },
    {
      name: 'metricsDisplay',
      type: 'group',
      label: 'Metrics Display',
      fields: [
        {
          name: 'showTradeHistory',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show detailed trade history table',
          },
        },
        {
          name: 'showKeyMetrics',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show key performance metrics cards',
          },
        },
        {
          name: 'showComparison',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show comparison with other bots',
          },
        },
        {
          name: 'metricsToShow',
          type: 'array',
          label: 'Metrics to Display',
          fields: [
            {
              name: 'metric',
              type: 'select',
              options: [
                { label: 'Total Profit/Loss', value: 'total_profit' },
                { label: 'Win Rate', value: 'win_rate' },
                { label: 'Average Trade', value: 'avg_trade' },
                { label: 'Max Drawdown', value: 'max_drawdown' },
                { label: 'Sharpe Ratio', value: 'sharpe_ratio' },
                { label: 'Total Trades', value: 'total_trades' },
                { label: 'Successful Trades', value: 'successful_trades' },
                { label: 'Average Hold Time', value: 'avg_hold_time' },
                { label: 'Best Trade', value: 'best_trade' },
                { label: 'Worst Trade', value: 'worst_trade' },
              ],
              required: true,
            },
            {
              name: 'displayName',
              type: 'text',
              admin: {
                description: 'Custom display name for this metric',
              },
            },
            {
              name: 'format',
              type: 'select',
              options: [
                { label: 'Currency', value: 'currency' },
                { label: 'Percentage', value: 'percentage' },
                { label: 'Number', value: 'number' },
                { label: 'Time', value: 'time' },
              ],
              defaultValue: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'filterOptions',
      type: 'group',
      label: 'Filter Options',
      fields: [
        {
          name: 'enableBotFilter',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow filtering by specific bots',
          },
        },
        {
          name: 'enableSymbolFilter',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow filtering by trading symbols',
          },
        },
        {
          name: 'enableStrategyFilter',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow filtering by trading strategies',
          },
        },
        {
          name: 'defaultBots',
          type: 'array',
          label: 'Default Bots to Show',
          fields: [
            {
              name: 'bot',
              type: 'relationship',
              relationTo: 'trading-bots' as any,
              admin: {
                description: 'Bots to show by default (leave empty for all)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'exportOptions',
      type: 'group',
      label: 'Export Options',
      fields: [
        {
          name: 'enableExport',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable data export functionality',
          },
        },
        {
          name: 'exportFormats',
          type: 'array',
          label: 'Available Export Formats',
          fields: [
            {
              name: 'format',
              type: 'select',
              options: [
                { label: 'CSV', value: 'csv' },
                { label: 'Excel', value: 'xlsx' },
                { label: 'PDF', value: 'pdf' },
                { label: 'JSON', value: 'json' },
              ],
              required: true,
            },
          ],
        },
        {
          name: 'includeCharts',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Include charts in exported reports',
          },
        },
      ],
    },
    {
      name: 'alertSettings',
      type: 'group',
      label: 'Performance Alerts',
      fields: [
        {
          name: 'enableAlerts',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable performance-based alerts',
          },
        },
        {
          name: 'alertThresholds',
          type: 'array',
          label: 'Alert Thresholds',
          fields: [
            {
              name: 'metric',
              type: 'select',
              options: [
                { label: 'Profit Threshold', value: 'profit' },
                { label: 'Loss Threshold', value: 'loss' },
                { label: 'Win Rate Threshold', value: 'win_rate' },
                { label: 'Drawdown Threshold', value: 'drawdown' },
              ],
              required: true,
            },
            {
              name: 'threshold',
              type: 'number',
              required: true,
              admin: {
                description: 'Threshold value for the alert',
              },
            },
            {
              name: 'condition',
              type: 'select',
              options: [
                { label: 'Greater Than', value: 'gt' },
                { label: 'Less Than', value: 'lt' },
                { label: 'Equal To', value: 'eq' },
              ],
              defaultValue: 'gt',
            },
          ],
        },
      ],
    },
    {
      name: 'styling',
      type: 'group',
      label: 'Styling Options',
      fields: [
        {
          name: 'colorScheme',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Professional', value: 'professional' },
            { label: 'Dark', value: 'dark' },
            { label: 'Colorful', value: 'colorful' },
          ],
          defaultValue: 'default',
          admin: {
            description: 'Color scheme for charts and metrics',
          },
        },
        {
          name: 'customColors',
          type: 'group',
          label: 'Custom Colors',
          fields: [
            {
              name: 'profitColor',
              type: 'text',
              defaultValue: '#10B981',
              admin: {
                description: 'Color for profit indicators (hex code)',
              },
            },
            {
              name: 'lossColor',
              type: 'text',
              defaultValue: '#EF4444',
              admin: {
                description: 'Color for loss indicators (hex code)',
              },
            },
            {
              name: 'neutralColor',
              type: 'text',
              defaultValue: '#6B7280',
              admin: {
                description: 'Color for neutral indicators (hex code)',
              },
            },
          ],
        },
        {
          name: 'customCSS',
          type: 'textarea',
          admin: {
            description: 'Custom CSS for additional styling',
          },
        },
      ],
    },
  ],
}
