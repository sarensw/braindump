import React, { ReactElement, FunctionComponent } from 'react'

const Page: FunctionComponent = ({ children }): ReactElement => {
  return (
    <div className='h-full w-full'>
      {children}
    </div>
  )
}

export default Page
