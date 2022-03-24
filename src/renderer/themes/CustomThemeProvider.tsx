import React from 'react'
import { ThemeProvider } from 'styled-components'
import useAsyncEffect from 'use-async-effect'
import { useAppSelector } from '../hooks'
import { changeTheme } from '../services/themeService'
import { ITheme } from './ITheme'

const CustomThemeProvider = ({ children }): React.ReactElement => {
  const theme = useAppSelector<ITheme>(state => state.themeNew.colors)
  const settings = useAppSelector(state => state.settings)

  useAsyncEffect(async () => {
    await changeTheme(settings['app.theme'])

    // return () => {
    //   second
    // }
  }, [settings['app.theme']])

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export default CustomThemeProvider
