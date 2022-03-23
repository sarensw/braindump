import { ITheme } from '../themes/ITheme'

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

export { updateInlineCodeTheme, updateBlockQuote }
