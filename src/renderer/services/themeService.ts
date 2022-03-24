import { ITheme } from '../themes/ITheme'
import { loadTheme } from '../themes/themeLoader'
import { store } from '../store'
import { setTheme } from '../store/storeThemeNew'
import { saveSettings } from './settingsService'
import { update as updateSetting } from '../store/storeSettings'

async function changeTheme (id: string): Promise<void> {
  const theme = loadTheme(id)

  updateScrollbarStyle(theme)

  store.dispatch(setTheme({
    id,
    theme
  }))

  store.dispatch(updateSetting({
    id: 'app.theme',
    value: id
  }))
  await saveSettings()
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

function updateInlineCodeTheme (theme: ITheme): void {
  const innerHtml = `
    .codeBlock {
      background: ${theme.editorTokens.inlineCode.background ?? '#ffffffaa'};
    }
    .codeBlockFirstLine {
      border-bottom: 1px solid ${theme.editorTokens.inlineCode.borderTop ?? '#ffffffaa'};
    }
    .codeBlockLastLine {
      border-top: 1px solid ${theme.editorTokens.inlineCode.borderBottom ?? '#ffffffaa'};
    }
    `

  const style = window.document.createElement('style')
  style.id = 'codeBlockCss'
  style.innerHTML = innerHtml
  if (document.getElementById('codeBlockCss') !== null) {
    const element = document.getElementById('codeBlockCss')
    element?.remove()
  }
  document.getElementsByTagName('head')[0].appendChild(style)
}

function updateBlockQuote (theme: ITheme): void {
  const innerHtml = `
    .blockQuote {
      background: ${theme.editorTokens.blockQuote.background ?? '#ffffffaa'};
    }
    .blockQuoteMargin {
      border-right: 1ch solid ${theme.editorTokens.blockQuote.marginBackground ?? '#ffffffaa'};
    }
    `

  const style = window.document.createElement('style')
  style.id = 'blockQuoteCss'
  style.innerHTML = innerHtml
  if (document.getElementById('blockQuoteCss') !== null) {
    const element = document.getElementById('blockQuoteCss')
    element?.remove()
  }
  document.getElementsByTagName('head')[0].appendChild(style)
}

export { changeTheme, updateInlineCodeTheme, updateBlockQuote }
