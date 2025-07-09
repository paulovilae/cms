import React from 'react'

interface BusinessLayoutProps {
  children: React.ReactNode
  params: Promise<{
    business: string
  }>
}

export default async function BusinessLayout({ children, params }: BusinessLayoutProps) {
  const { business } = await params

  // Validate business parameter
  const validBusinesses = ['intellitrade', 'salarium', 'latinos', 'capacita']
  if (!validBusinesses.includes(business)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
          <p className="text-gray-600">The business &ldquo;{business}&rdquo; is not available.</p>
        </div>
      </div>
    )
  }

  // Just pass through children - the root layout handles header/footer
  return <>{children}</>
}

// Generate static params for known businesses
export function generateStaticParams() {
  return [
    { business: 'intellitrade' },
    { business: 'salarium' },
    { business: 'latinos' },
    { business: 'capacita' },
  ]
}
