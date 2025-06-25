'use client'

import React, { useState } from 'react'

export const BeforeDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  const handleSeed = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const res = await fetch('/next/seed', {
        method: 'POST',
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setResult({ success: data.success })
      } else {
        const error = await res.text()
        setResult({ error })
      }
    } catch (error) {
      setResult({ error: 'Failed to seed data. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 mb-4 bg-white rounded shadow-md dark:bg-gray-800 border-l-4 border-blue-600">
      <div className="intellitrade-dashboard-header mb-4">
        <h2 className="text-2xl font-bold text-blue-600">IntelliTrade Admin</h2>
        <p className="text-sm text-gray-500">Trade Finance Platform Management</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleSeed}
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Seeding...' : 'Seed Demo Data'}
        </button>

        {result && (
          <div
            className={`p-2 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {result.success ? 'Data seeded successfully!' : `Error: ${result.error}`}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Click the button above to populate the database with demo data for IntelliTrade, including
        team members, features, testimonials, and pricing plans.
      </p>
    </div>
  )
}

export default BeforeDashboard
