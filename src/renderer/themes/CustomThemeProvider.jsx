import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import pSBC from 'shade-blend-color'
import { colorRegistry } from './ColorRegistry'

const CustomThemeProvider = ({ children }) => {
  const tc = useSelector(state => state.theme.theme.colors)
  const theme = useSelector(state => state.theme.theme)

  const defaultTheme = colorRegistry.getColors(theme.type)

  const correctedTheme = {}
  if (tc['button.hoverBackground']) {
    correctedTheme['button.hoverBackground'] = tc['button.hoverBackground']
  } else {
    if (theme && theme.type && theme.type === 'dark') {
      correctedTheme['button.hoverBackground'] = pSBC(-0.2, tc['button.background'])
    } else {
      correctedTheme['button.hoverBackground'] = pSBC(0.2, tc['button.background'])
    }
  }

  console.log(tc)
  return (
    <ThemeProvider theme={{ ...defaultTheme, ...correctedTheme, ...tc }}>
      {children}
    </ThemeProvider>
  )
}

export default CustomThemeProvider
