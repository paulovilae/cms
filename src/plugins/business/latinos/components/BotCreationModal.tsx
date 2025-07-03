/**
 * BotCreationModal Component
 *
 * Modal component for creating new trading bots with comprehensive form
 * validation, strategy selection, and real-time configuration preview.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Bot, Strategy } from '../hooks/useBotData'
import { formatCurrency, formatPercentage } from '../utils/formatting'

interface BotCreationModalProps {
  strategies: Strategy[]
  onSubmit: (botData: Partial<Bot>) => Promise<Bot | null>
  onCancel: () => void
  isOpen: boolean
  loading?: boolean
}

interface FormData {
  name: string
  symbol: string
  exchange: string
  investmentAmount: number
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  maxDailyTrades: number
  stopLossPercentage: number
  takeProfitPercentage: number
  strategyId: string
}

interface FormErrors {
  [key: string]: string
}

const initialFormData: FormData = {
  name: '',
  symbol: '',
  exchange: 'NASDAQ',
  investmentAmount: 1000,
  riskLevel: 'moderate',
  maxDailyTrades: 5,
  stopLossPercentage: 5,
  takeProfitPercentage: 10,
  strategyId: '',
}

export const BotCreationModal: React.FC<BotCreationModalProps> = ({
  strategies,
  onSubmit,
  onCancel,
  isOpen,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData)
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen])

  // Auto-select first strategy if available
  useEffect(() => {
    if (strategies.length > 0 && !formData.strategyId && strategies[0]) {
      setFormData((prev) => ({ ...prev, strategyId: strategies[0].id }))
    }
  }, [strategies, formData.strategyId])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Step 1 validation
    if (!formData.name.trim()) {
      newErrors.name = 'Bot name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Bot name must be at least 3 characters'
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Trading symbol is required'
    } else if (!/^[A-Z0-9-]+$/.test(formData.symbol)) {
      newErrors.symbol = 'Symbol must contain only letters, numbers, and hyphens'
    }

    if (!formData.strategyId) {
      newErrors.strategyId = 'Please select a trading strategy'
    }

    // Step 2 validation
    if (formData.investmentAmount < 100) {
      newErrors.investmentAmount = 'Minimum investment is $100'
    } else if (formData.investmentAmount > 100000) {
      newErrors.investmentAmount = 'Maximum investment is $100,000'
    }

    if (formData.maxDailyTrades < 1 || formData.maxDailyTrades > 50) {
      newErrors.maxDailyTrades = 'Daily trades must be between 1 and 50'
    }

    if (formData.stopLossPercentage < 1 || formData.stopLossPercentage > 20) {
      newErrors.stopLossPercentage = 'Stop loss must be between 1% and 20%'
    }

    if (formData.takeProfitPercentage < 2 || formData.takeProfitPercentage > 50) {
      newErrors.takeProfitPercentage = 'Take profit must be between 2% and 50%'
    }

    if (formData.takeProfitPercentage <= formData.stopLossPercentage) {
      newErrors.takeProfitPercentage = 'Take profit must be higher than stop loss'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Bot name is required'
      if (!formData.symbol.trim()) newErrors.symbol = 'Trading symbol is required'
      if (!formData.strategyId) newErrors.strategyId = 'Please select a strategy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    try {
      const selectedStrategy = strategies.find((s) => s.id === formData.strategyId)

      const botData: Partial<Bot> = {
        name: formData.name.trim(),
        symbol: formData.symbol.toUpperCase().trim(),
        exchange: formData.exchange,
        investmentAmount: formData.investmentAmount,
        riskLevel: formData.riskLevel,
        maxDailyTrades: formData.maxDailyTrades,
        stopLossPercentage: formData.stopLossPercentage,
        takeProfitPercentage: formData.takeProfitPercentage,
        strategy: selectedStrategy
          ? {
              id: selectedStrategy.id,
              name: selectedStrategy.name,
            }
          : undefined,
        status: 'stopped', // New bots start stopped
      }

      const result = await onSubmit(botData)
      if (result) {
        onCancel() // Close modal on success
      }
    } catch (error) {
      console.error('Error creating bot:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedStrategy = strategies.find((s) => s.id === formData.strategyId)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Create New Trading Bot</h3>
            <p className="text-sm text-gray-500">
              Step {currentStep} of 2:{' '}
              {currentStep === 1 ? 'Basic Configuration' : 'Trading Parameters'}
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {currentStep === 1 ? (
            <Step1
              formData={formData}
              errors={errors}
              strategies={strategies}
              onChange={handleInputChange}
            />
          ) : (
            <Step2
              formData={formData}
              errors={errors}
              selectedStrategy={selectedStrategy}
              onChange={handleInputChange}
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <div className="flex items-center space-x-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>

              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {submitting || loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Bot...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Bot
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Step 1: Basic Configuration
const Step1: React.FC<{
  formData: FormData
  errors: FormErrors
  strategies: Strategy[]
  onChange: (field: keyof FormData, value: any) => void
}> = ({ formData, errors, strategies, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bot Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.name ? 'border-red-300' : ''
            }`}
            placeholder="e.g., AAPL Momentum Bot"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trading Symbol <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => onChange('symbol', e.target.value.toUpperCase())}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.symbol ? 'border-red-300' : ''
            }`}
            placeholder="e.g., AAPL, BTC-USD"
          />
          {errors.symbol && <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Exchange</label>
        <select
          value={formData.exchange}
          onChange={(e) => onChange('exchange', e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="NASDAQ">NASDAQ</option>
          <option value="NYSE">NYSE</option>
          <option value="AMEX">AMEX</option>
          <option value="CRYPTO">Crypto</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Trading Strategy <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.strategyId}
          onChange={(e) => onChange('strategyId', e.target.value)}
          className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.strategyId ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select a strategy...</option>
          {strategies.map((strategy) => (
            <option key={strategy.id} value={strategy.id}>
              {strategy.name} ({strategy.type})
            </option>
          ))}
        </select>
        {errors.strategyId && <p className="mt-1 text-sm text-red-600">{errors.strategyId}</p>}

        {formData.strategyId && (
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              {strategies.find((s) => s.id === formData.strategyId)?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Step 2: Trading Parameters
const Step2: React.FC<{
  formData: FormData
  errors: FormErrors
  selectedStrategy?: Strategy
  onChange: (field: keyof FormData, value: any) => void
}> = ({ formData, errors, selectedStrategy, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Investment Settings */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Investment Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Investment Amount <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                min="100"
                max="100000"
                step="100"
                value={formData.investmentAmount}
                onChange={(e) => onChange('investmentAmount', parseFloat(e.target.value) || 0)}
                className={`block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.investmentAmount ? 'border-red-300' : ''
                }`}
              />
            </div>
            {errors.investmentAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.investmentAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Level</label>
            <select
              value={formData.riskLevel}
              onChange={(e) => onChange('riskLevel', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trading Parameters */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Trading Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Daily Trades</label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.maxDailyTrades}
              onChange={(e) => onChange('maxDailyTrades', parseInt(e.target.value) || 0)}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.maxDailyTrades ? 'border-red-300' : ''
              }`}
            />
            {errors.maxDailyTrades && (
              <p className="mt-1 text-sm text-red-600">{errors.maxDailyTrades}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stop Loss (%)</label>
            <input
              type="number"
              min="1"
              max="20"
              step="0.1"
              value={formData.stopLossPercentage}
              onChange={(e) => onChange('stopLossPercentage', parseFloat(e.target.value) || 0)}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.stopLossPercentage ? 'border-red-300' : ''
              }`}
            />
            {errors.stopLossPercentage && (
              <p className="mt-1 text-sm text-red-600">{errors.stopLossPercentage}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Take Profit (%)</label>
            <input
              type="number"
              min="2"
              max="50"
              step="0.1"
              value={formData.takeProfitPercentage}
              onChange={(e) => onChange('takeProfitPercentage', parseFloat(e.target.value) || 0)}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.takeProfitPercentage ? 'border-red-300' : ''
              }`}
            />
            {errors.takeProfitPercentage && (
              <p className="mt-1 text-sm text-red-600">{errors.takeProfitPercentage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration Preview</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Investment per trade:</span>
            <span className="ml-2 font-medium">{formatCurrency(formData.investmentAmount)}</span>
          </div>
          <div>
            <span className="text-gray-500">Risk/Reward ratio:</span>
            <span className="ml-2 font-medium">
              1:{(formData.takeProfitPercentage / formData.stopLossPercentage).toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Max daily exposure:</span>
            <span className="ml-2 font-medium">
              {formatCurrency(formData.investmentAmount * formData.maxDailyTrades)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Strategy:</span>
            <span className="ml-2 font-medium">{selectedStrategy?.name || 'None selected'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotCreationModal
