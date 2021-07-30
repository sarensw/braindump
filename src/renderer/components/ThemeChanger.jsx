import React from 'react'
import Button from './elements/Button'
import { useDispatch } from 'react-redux'
import { set as setTheme } from '../store/storeTheme'
import themes from '../themes'

const ThemeChanger = _ => {
  const dispatch = useDispatch()

  const changeThemeByUser = themeId => {
    dispatch(setTheme({
      theme: themes[themeId],
      id: themeId
    }))
  }

  return (
    <>
      <div className='flex flex-row'>
        <Button onClick={() => changeThemeByUser('monokai')}>Monokai</Button>
        <Button onClick={() => changeThemeByUser('solarizedlight')}>Solarized Light</Button>
        <Button onClick={() => changeThemeByUser('nordlight')}>Nord Light</Button>
      </div>
    </>
  )
}

export default ThemeChanger
