/**
 * Utility functions for handling business context in API requests
 */

/**
 * Creates HTTP headers with business context information
 *
 * @param business - The business mode identifier
 * @returns An object with appropriate headers for API requests
 */
export const createBusinessHeaders = (business: string): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'x-business': business,
  }
}

/**
 * Extracts business context from a request object
 *
 * @param req - The request object
 * @returns The business context information
 */
export const getBusinessContext = (req: Request): { business: string } => {
  // In a real implementation, this would extract from headers or URL
  // For now, we'll default to 'salarium' for simplicity
  return {
    business: 'salarium',
  }
}

/**
 * Validates if a business mode is valid for an operation
 *
 * @param business - The business mode to validate
 * @param allowedBusinesses - List of allowed business modes
 * @returns True if the business mode is valid
 */
export const isValidBusinessMode = (business: string, allowedBusinesses: string[]): boolean => {
  return allowedBusinesses.includes(business)
}
