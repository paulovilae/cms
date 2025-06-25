import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div className="intellitrade-login">
      <div className="intellitrade-branding">
        <h1 className="text-2xl font-bold text-blue-600">IntelliTrade</h1>
        <p className="text-sm text-gray-600">Trade Finance Platform</p>
      </div>
      <div className="mt-4">
        <p>
          <b>Welcome to the IntelliTrade Admin Dashboard</b>
          {' — Manage your trade finance platform content and user experience.'}
        </p>
      </div>
    </div>
  )
}

export default BeforeLogin
