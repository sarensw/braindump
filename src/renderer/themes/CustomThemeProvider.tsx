import React from 'react'
import { ThemeProvider } from 'styled-components'
import { useAppSelector } from '../hooks'
import { ITheme } from './ITheme'

const CustomThemeProvider = ({ children }): React.ReactElement => {
  const theme = useAppSelector<ITheme>(state => state.themeNew.colors)

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export default CustomThemeProvider
