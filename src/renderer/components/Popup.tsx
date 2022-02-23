import React, { ReactElement } from 'react'

const Popup: React.FunctionComponent = (): ReactElement => {
  return (
    <div
      className='fixed h-full w-full flex items-center justify-center bg-opacity-50 bg-gray-400'
    >
      <div className='z-50'>
        <div
          id='login-card'
          className='w-56 h-64 text-center bg-green-500 rounded-lg'
        >Hello
        </div>
      </div>
    </div>
  )
}

export default Popup
