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

  // Render filter options with improved contrast
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
                className="option-checkbox checkbox-visible"
              />
              <span className="option-text">{option.label}</span>
              {option.count !== undefined && <span className="option-count">{option.count}</span>}
            </label>
          </div>
        ))}
      </div>
    )
  }

  // Render a date range filter with improved contrast
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
                className="option-checkbox checkbox-visible"
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
            className="range-input border-visible"
            // This would need proper state management in a real implementation
          />
          <span className="range-separator">to</span>
          <input
            type="number"
            placeholder="Max"
            className="range-input border-visible"
            // This would need proper state management in a real implementation
          />
        </div>
        <button className="range-apply-button border-visible">Apply</button>
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

      {/* Clear all filters button with improved contrast */}
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

      {/* CSS variables-based styles for improved contrast */}
      <style jsx>{`
        .search-filters {
          width: 100%;
          border: 1px solid var(--border-light);
          border-radius: 0.375rem;
          background-color: var(--background-secondary);
          padding: 1rem;
        }

        .filters-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: var(--filter-title-text);
        }

        .filters-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-section {
          border-bottom: 1px solid var(--border-light);
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
          color: var(--filter-title-text);
          font-weight: 500;
        }

        .filter-title {
          font-size: 0.875rem;
        }

        .filter-toggle-icon {
          font-size: 1rem;
          color: var(--text-tertiary);
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
          color: var(--filter-label-text);
          cursor: pointer;
        }

        .option-checkbox {
          margin-right: 0.5rem;
          border: 2px solid var(--checkbox-border);
          background-color: var(--checkbox-bg);
        }

        .option-text {
          flex: 1;
        }

        .option-count {
          color: var(--filter-count-text);
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
          border: 1px solid var(--border-input);
          border-radius: 0.25rem;
          font-size: 0.875rem;
          background-color: var(--input-bg);
          color: var(--input-text);
        }

        .range-separator {
          color: var(--text-tertiary);
        }

        .range-apply-button {
          background-color: var(--secondary-button-bg);
          border: 1px solid var(--secondary-button-border);
          border-radius: 0.25rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          color: var(--secondary-button-text);
          cursor: pointer;
        }

        .range-apply-button:hover {
          background-color: var(--secondary-button-hover);
        }

        .clear-filters-button {
          width: 100%;
          background-color: var(--clear-button-bg);
          border: 1px solid var(--clear-button-border);
          border-radius: 0.25rem;
          padding: 0.5rem;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--clear-button-text);
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .clear-filters-button:hover {
          background-color: var(--clear-button-hover);
        }
      `}</style>
    </div>
  )
}

export default SearchFilters
