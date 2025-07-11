'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { salariumNavItems } from '@/plugins/business/salarium/utils/navigation'

interface SalariumLayoutProps {
  children: React.ReactNode
}

/**
 * Layout component for Salarium business unit
 * This provides navigation and business context for all Salarium pages
 */
export default function SalariumLayout({ children }: SalariumLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-violet-900 text-white flex-shrink-0">
        <div className="p-4 border-b border-violet-800">
          <h2 className="text-xl font-bold">Salarium HR</h2>
          <p className="text-sm text-violet-300">AI-Powered HR Assistant</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {salariumNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded transition-colors ${
                      isActive
                        ? 'bg-violet-800 text-white'
                        : 'text-violet-100 hover:bg-violet-800/50'
                    }`}
                  >
                    {/* You can add proper icon support later */}
                    <span className="mr-3">
                      {item.icon === 'Search'
                        ? '🔍'
                        : item.icon === 'Dashboard'
                          ? '📊'
                          : item.icon === 'FileText'
                            ? '📄'
                            : '📌'}
                    </span>
                    <span>{item.label}</span>
                    {item.isNew && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-violet-600 text-white rounded-full">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">{children}</main>
    </div>
  )
}
