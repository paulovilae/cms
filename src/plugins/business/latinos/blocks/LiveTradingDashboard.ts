/**
 * Live Trading Dashboard Block
 *
 * Provides a real-time dashboard for monitoring active trading bots,
 * system status, and live market data.
 */

import type { Block } from 'payload'

export const LiveTradingDashboard: Block = {
  slug: 'liveTradingDashboard',
  labels: {
    singular: 'Live Trading Dashboard',
    plural: 'Live Trading Dashboards',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Live Trading Dashboard',
      admin: {
        description: 'Dashboard title displayed to users',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle or description',
      },
    },
    {
      name: 'displayOptions',
      type: 'group',
      label: 'Display Options',
      fields: [
        {
          name: 'showPerformanceMetrics',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show overall performance metrics',
          },
        },
        {
          name: 'showActiveTrades',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show currently active trades',
          },
        },
        {
          name: 'showMarketData',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show real-time market data',
          },
        },
        {
          name: 'showSystemStatus',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show trading system status',
          },
        },
        {
          name: 'showBotList',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show list of active trading bots',
          },
        },
      ],
    },
    {
      name: 'refreshSettings',
      type: 'group',
      label: 'Refresh Settings',
      fields: [
        {
          name: 'refreshInterval',
          type: 'number',
          defaultValue: 5,
          min: 1,
          max: 60,
          admin: {
            description: 'Refresh interval in seconds (1-60)',
          },
        },
        {
          name: 'enableAutoRefresh',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable automatic data refresh',
          },
        },
        {
          name: 'enableRealTimeUpdates',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable real-time WebSocket updates',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      label: 'Layout Configuration',
      fields: [
        {
          name: 'gridColumns',
          type: 'select',
          options: [
            { label: '1 Column', value: '1' },
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
          defaultValue: '3',
          admin: {
            description: 'Number of columns in the dashboard grid',
          },
        },
        {
          name: 'cardSize',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          defaultValue: 'medium',
          admin: {
            description: 'Size of dashboard cards',
          },
        },
        {
          name: 'theme',
          type: 'select',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Auto', value: 'auto' },
          ],
          defaultValue: 'auto',
          admin: {
            description: 'Dashboard color theme',
          },
        },
      ],
    },
    {
      name: 'filters',
      type: 'group',
      label: 'Data Filters',
      fields: [
        {
          name: 'botFilter',
          type: 'array',
          label: 'Bot Filters',
          fields: [
            {
              name: 'botId',
              type: 'relationship',
              relationTo: 'trading-bots' as any,
              admin: {
                description: 'Specific bots to display (leave empty for all)',
              },
            },
          ],
        },
        {
          name: 'symbolFilter',
          type: 'array',
          label: 'Symbol Filters',
          fields: [
            {
              name: 'symbol',
              type: 'text',
              admin: {
                description: 'Trading symbols to display (e.g., AAPL, BTC-USD)',
              },
            },
          ],
        },
        {
          name: 'statusFilter',
          type: 'array',
          label: 'Status Filters',
          fields: [
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Paused', value: 'paused' },
                { label: 'Stopped', value: 'stopped' },
                { label: 'Error', value: 'error' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'alerts',
      type: 'group',
      label: 'Alert Settings',
      fields: [
        {
          name: 'enableAlerts',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable dashboard alerts',
          },
        },
        {
          name: 'alertThresholds',
          type: 'group',
          label: 'Alert Thresholds',
          fields: [
            {
              name: 'profitThreshold',
              type: 'number',
              admin: {
                description: 'Alert when profit exceeds this amount',
              },
            },
            {
              name: 'lossThreshold',
              type: 'number',
              admin: {
                description: 'Alert when loss exceeds this amount',
              },
            },
            {
              name: 'volumeThreshold',
              type: 'number',
              admin: {
                description: 'Alert when trading volume exceeds this amount',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'customization',
      type: 'group',
      label: 'Customization',
      fields: [
        {
          name: 'customCSS',
          type: 'textarea',
          admin: {
            description: 'Custom CSS styles for the dashboard',
          },
        },
        {
          name: 'customJS',
          type: 'textarea',
          admin: {
            description: 'Custom JavaScript for dashboard functionality',
          },
        },
      ],
    },
  ],
}
