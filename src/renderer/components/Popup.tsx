import React, { ReactElement } from 'react'

const Popup: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <div
      className='fixed h-full w-full flex items-center justify-center bg-opacity-50 bg-gray-400 font-mono'
    >
      <div className='z-50'>
        <div
          id='login-card'
          className='w-96 h-96 text-center bg-white rounded-sm'
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Popup
