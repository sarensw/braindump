import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import pSBC from 'shade-blend-color'

const CustomThemeProvider = ({ children }) => {
  const tc = useSelector(state => state.theme.theme.colors)
  const theme = useSelector(state => state.theme.theme)
  const defaultThemeLight = {
    'button.foreground': '#000',
    'button.background': '#007ACC',
    'button.hoverBackground': '#0085dd'
  }
  const defaultThemeDark = {
    'button.foreground': '#fff',
    'button.background': '#0E639C',
    'button.hoverBackground': '#0085dd'
  }
  const defaultTheme = (theme && theme.type) ? (theme.type === 'dark' ? defaultThemeDark : defaultThemeLight) : defaultThemeLight

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
