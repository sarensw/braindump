import React, { ReactElement } from 'react'
import { useAppSelector } from '../hooks'

const Overlay = ({ escToGoBack = false, type = 'full', children }): ReactElement => {
  const colors = useAppSelector(store => store.themeNew.colors)

  let size = 'w-96 h-96 top-20 p-4 border border-1'
  if (type === 'full') size = 'h-full w-full p-8'

  return (
    <div className='fixed inset-0 h-full w-full'>
      <div
        className={`relative mx-auto ${size}`}
        style={{
          background: colors.editor.background,
          borderColor: colors.overlay.border
        }}
      >
        {children}
      </div>
    </div>
  )
}

export { Overlay }
