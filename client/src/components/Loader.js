import React from 'react'

export const Loader = () => (
  <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
    <div className="spinner-border text-primary">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)