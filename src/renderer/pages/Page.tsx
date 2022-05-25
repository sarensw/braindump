import React, { ReactElement, useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { registerHotkey, unregisterHotkey } from '../services/hotkeyService'
import { goToLastPage } from '../store/storeApp'

const Page = ({ escToGoBack = false, children }): ReactElement => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let escHk: any | null = null
    if (escToGoBack) {
      escHk = {
        id: 'general:esc',
        key: 'esc',
        description: 'last page',
        action: (source, codeEditor): boolean => {
          dispatch(goToLastPage(''))
          return true
        }
      }
      registerHotkey(escHk, 'editor', null)
    }
    return () => {
      if (escHk !== null) {
        unregisterHotkey(escHk)
      }
    }
  }, [])

  return (
    <div className='h-full w-full'>
      {children}
    </div>
  )
}

export default Page
