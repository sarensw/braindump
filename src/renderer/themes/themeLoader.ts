import { ITheme } from './ITheme'
import Light from './themes/light'
import Dark from './themes/dark'
import log from '../log'

function loadTheme (id: string): ITheme {
  log.debug(`about to set theme ${id}`)
  // Light is the default light theme. When custom themes will be
  // supported, then here we have to merge the custom theme over
  // the light theme. Every single property in ITheme has to be set
  // with a color value. And the default themes (light and dark)
  // both have all set. When the custom theme is merged with the
  // default theme, then we are sure that still all colors are set.
  let theme: ITheme | null = null
  if (id.toLowerCase() === 'light') theme = Light as ITheme
  if (id.toLowerCase() === 'dark') theme = Dark as ITheme

  if (theme === null) theme = Light as ITheme

  return theme
}

export { loadTheme, Light, Dark }
