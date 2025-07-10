/**
 * Navigation utilities for Salarium business unit
 * This file contains the navigation items for the Salarium side navigation
 */

export type NavItem = {
  label: string
  href: string
  icon: string
  isNew?: boolean
}

export const salariumNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/salarium',
    icon: 'Dashboard',
  },
  {
    label: 'Job Description Creator',
    href: '/salarium/job-flow',
    icon: 'FileText',
  },
  {
    label: 'HR Search',
    href: '/salarium/hr-search',
    icon: 'Search',
    isNew: true, // Highlight as a new feature
  },
  // Add other navigation items as needed
]

/**
 * Get Salarium navigation items
 * This function is used by the Salarium layout to retrieve navigation items
 */
export const getSalariumNavigation = () => {
  return salariumNavItems
}
