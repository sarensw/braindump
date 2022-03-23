import { ITheme } from './ITheme'
import { store } from '../store'
import Light from './light'
import Dark from './dark'
import log from '../log'
import { setTheme } from '../store/storeThemeNew'

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

  log.debug({
    id,
    theme
  })

  updateScrollbarStyle(theme)

  store.dispatch(setTheme({
    id,
    theme
  }))

  return theme
}

function updateScrollbarStyle (theme: ITheme): void {
  const innerHtml = `
      .styled-scrollbars::-webkit-scrollbar {
        width: ${theme.scrollbar.size ?? '14px'};
        height: ${theme.scrollbar.size ?? '14px'};
      }
      .styled-scrollbars::-webkit-scrollbar-thumb { /* Foreground */
        background: ${theme.scrollbar.thumbBackground ?? '#79797966'};
      }
      .styled-scrollbars::-webkit-scrollbar-track { /* Background */
        border-left: 1px solid ${theme.scrollbar.borderLeft ?? '#333333'};
      }
    `

  const style = window.document.createElement('style')
  style.id = 'scrollBarStyleCss'
  style.innerHTML = innerHtml
  if (document.getElementById('scrollBarStyleCss') !== null) {
    const element = document.getElementById('scrollBarStyleCss')
    element?.remove()
  }
  document.getElementsByTagName('head')[0].appendChild(style)
}

export { loadTheme, Light, Dark }
