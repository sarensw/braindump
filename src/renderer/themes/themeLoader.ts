import { ITheme } from './ITheme'
import Light from './light.json'

function loadTheme (id: string): ITheme {
  // Light is the default light theme. When custom themes will be
  // supported, then here we have to merge the custom theme over
  // the light theme. Every single property in ITheme has to be set
  // with a color value. And the default themes (light and dark)
  // both have all set. When the custom theme is merged with the
  // default theme, then we are sure that still all colors are set.
  if (id === 'Light') return Light as ITheme
  return Light as ITheme
}

export { loadTheme, Light }
