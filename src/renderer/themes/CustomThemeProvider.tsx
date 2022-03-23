import React from 'react'
import { ThemeProvider } from 'styled-components'
import useAsyncEffect from 'use-async-effect'
import { useAppSelector } from '../hooks'
import { ITheme } from './ITheme'
import { loadTheme } from './themeLoader'

const CustomThemeProvider = ({ children }): React.ReactElement => {
  const theme = useAppSelector<ITheme>(state => state.themeNew.colors)
  const settings = useAppSelector(state => state.settings)

  useAsyncEffect(async () => {
    await loadTheme(settings['app.theme'])

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
