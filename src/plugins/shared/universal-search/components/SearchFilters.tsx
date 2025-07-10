'use client'

import React, { useState } from 'react'
import type { SearchFilter, FilterOption } from '../types/search.types'

interface SearchFiltersProps {
  filters: SearchFilter[]
  activeFilters: Record<string, string[]>
  onFilterChange: (filterId: string, values: string[]) => void
  className?: string
}

/**
 * Displays and manages search filters
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  className = '',
}) => {
  // State for expanded filter sections
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>(() => {
    // Initialize with first 2 filters expanded
    const expanded: Record<string, boolean> = {}
    filters.slice(0, 2).forEach((filter) => {
      expanded[filter.id] = true
    })
    return expanded
  })

  // Toggle filter section expansion
  const toggleFilterExpansion = (filterId: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }))
  }

  // Handle filter option change
  const handleFilterOptionChange = (filterId: string, optionValue: string, isChecked: boolean) => {
    // Get current values for this filter
    const currentValues = activeFilters[filterId] || []

    // Update values based on selection
    let newValues: string[]
    if (isChecked) {
      // Add value if checked
      newValues = [...currentValues, optionValue]
    } else {
      // Remove value if unchecked
      newValues = currentValues.filter((value) => value !== optionValue)
    }

    // Call the onChange handler
    onFilterChange(filterId, newValues)
  }

  // Render filter options
  const renderFilterOptions = (filter: SearchFilter) => {
    return (
      <div className="filter-options">
        {filter.options.map((option) => (
          <div key={option.value} className="filter-option">
            <label className="option-label">
              <input
                type="checkbox"
                checked={(activeFilters[filter.id] || []).includes(option.value)}
                onChange={(e) =>
                  handleFilterOptionChange(filter.id, option.value, e.target.checked)
                }
                className="option-checkbox"
              />
              <span className="option-text">{option.label}</span>
              {option.count !== undefined && <span className="option-count">{option.count}</span>}
            </label>
          </div>
        ))}
      </div>
    )
  }

  // Render a date range filter
  const renderDateRangeFilter = (filter: SearchFilter) => {
    // For simplicity, we'll render this as predefined options
    // In a real implementation, this would be a date picker
    const dateRangeOptions: FilterOption[] = [
      { label: 'Today', value: 'today' },
      { label: 'This Week', value: 'week' },
      { label: 'This Month', value: 'month' },
      { label: 'This Year', value: 'year' },
      { label: 'Custom Range', value: 'custom' },
    ]

    return (
      <div className="filter-options">
        {dateRangeOptions.map((option) => (
          <div key={option.value} className="filter-option">
            <label className="option-label">
              <input
                type="checkbox"
                checked={(activeFilters[filter.id] || []).includes(option.value)}
                onChange={(e) =>
                  handleFilterOptionChange(filter.id, option.value, e.target.checked)
                }
                className="option-checkbox"
              />
              <span className="option-text">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    )
  }

  // Render a range filter (like price or rating)
  const renderRangeFilter = (filter: SearchFilter) => {
    // For simplicity, just render a min/max input
    // In a real implementation, this would be a slider
    return (
      <div className="filter-range">
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            className="range-input"
            // This would need proper state management in a real implementation
          />
          <span className="range-separator">to</span>
          <input
            type="number"
            placeholder="Max"
            className="range-input"
            // This would need proper state management in a real implementation
          />
        </div>
        <button className="range-apply-button">Apply</button>
      </div>
    )
  }

  // Render the appropriate filter input based on type
  const renderFilterInput = (filter: SearchFilter) => {
    switch (filter.type) {
      case 'checkbox':
        return renderFilterOptions(filter)
      case 'date':
        return renderDateRangeFilter(filter)
      case 'range':
        return renderRangeFilter(filter)
      default:
        return renderFilterOptions(filter)
    }
  }

  // If no filters, return null
  if (!filters || filters.length === 0) {
    return null
  }

  return (
    <div className={`search-filters ${className}`}>
      <h3 className="filters-title">Filters</h3>
      <div className="filters-list">
        {filters.map((filter) => (
          <div key={filter.id} className="filter-section">
            <button
              className="filter-header"
              onClick={() => toggleFilterExpansion(filter.id)}
              aria-expanded={expandedFilters[filter.id]}
            >
              <span className="filter-title">{filter.label}</span>
              <span className="filter-toggle-icon">{expandedFilters[filter.id] ? '−' : '+'}</span>
            </button>

            {expandedFilters[filter.id] && (
              <div className="filter-content">{renderFilterInput(filter)}</div>
            )}
          </div>
        ))}
      </div>

      {/* Clear all filters button */}
      <button
        className="clear-filters-button"
        onClick={() => {
          // Clear all filters
          Object.keys(activeFilters).forEach((filterId) => {
            onFilterChange(filterId, [])
          })
        }}
      >
        Clear All Filters
      </button>

      {/* This would be replaced with proper CSS in a real implementation */}
      <style jsx>{`
        .search-filters {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          background-color: white;
          padding: 1rem;
        }

        .filters-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: #2d3748;
        }

        .filters-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-section {
          border-bottom: 1px solid #edf2f7;
          padding-bottom: 0.5rem;
        }

        .filter-section:last-child {
          border-bottom: none;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: none;
          border: none;
          padding: 0.5rem 0;
          text-align: left;
          cursor: pointer;
          color: #4a5568;
          font-weight: 500;
        }

        .filter-title {
          font-size: 0.875rem;
        }

        .filter-toggle-icon {
          font-size: 1rem;
          color: #a0aec0;
        }

        .filter-content {
          padding: 0.5rem 0;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .filter-option {
          display: flex;
          align-items: center;
        }

        .option-label {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #4a5568;
          cursor: pointer;
        }

        .option-checkbox {
          margin-right: 0.5rem;
        }

        .option-text {
          flex: 1;
        }

        .option-count {
          color: #a0aec0;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        .filter-range {
          padding: 0.5rem 0;
        }

        .range-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .range-input {
          width: 4rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .range-separator {
          color: #a0aec0;
        }

        .range-apply-button {
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          color: #4a5568;
          cursor: pointer;
        }

        .range-apply-button:hover {
          background-color: #edf2f7;
        }

        .clear-filters-button {
          width: 100%;
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          padding: 0.5rem;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-filters-button:hover {
          background-color: #edf2f7;
        }
      `}</style>
    </div>
  )
}

export default SearchFilters
