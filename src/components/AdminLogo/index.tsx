import React from 'react'

const AdminLogo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0',
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: '#666666',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '4px',
        }}
      >
        IT
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: '1',
            marginBottom: '2px',
          }}
        >
          IntelliTrade
        </div>
        <div
          style={{
            color: 'white',
            fontSize: '10px',
            opacity: '0.8',
            lineHeight: '1',
          }}
        >
          Admin
        </div>
      </div>
    </div>
  )
}

export default AdminLogo
