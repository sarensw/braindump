export interface IEditorTokens {
  header: IEditorToken
  email: IEditorToken
  link: IEditorToken
  user: IEditorToken
  taskOpen: IEditorToken
  taskDone: IEditorToken
  keyword: IEditorToken
  inlineCode: {
    background?: string
    borderBottom?: string
    borderTop?: string
  }
  blockQuote: {
    background?: string
    marginBackground?: string
  }
}

export interface IEditorToken {
  foreground: string
  fontStyle: string
}

export interface ITheme {
  type: string
  background?: string
  foreground?: string
  foregroundLight?: string
  scrollbar: {
    size?: string
    thumbBackground?: string
    borderLeft?: string
  }
  files: {
    foreground?: string
    selectedForeground?: string
    selectedBackground?: string
    headerForeground?: string
    headerBackground?: string
  }
  editor: {
    background?: string
    foreground?: string
    cursorForeground?: string
    lineHighlightBackground?: string
    lineNumberForeground?: string
    lineNumberActiveForeground?: string
    selectionBackground?: string
    selectionHighlightBackground?: string
    indentGuideBackground?: string
  }
  editorTokens: IEditorTokens
  button: {
    foreground?: string
    background?: string
    border?: string
    hoverForeground?: string
    hoverBackground?: string
    hoverBorder?: string
  }
  settings: {
    label: {
      foreground?: string
    }
    description: {
      foreground?: string
      background?: string
    }
    text: {
      foreground?: string
      background?: string
      border?: string
      hoverForeground?: string
      hoverBackground?: string
      hoverBorder?: string
    }
    dropdown: {
      foreground?: string
      background?: string
      border?: string
      hoverForeground?: string
      hoverBackground?: string
      hoverBorder?: string
    }
  }
  breadcrumb: {
    pathBackground: string
    pathForeground: string
  }
  tabs: {
    background?: string
  }
  tab: {
    border?: string
    activeBackground?: string
    activeBorder?: string
    activeBorderTop?: string
    activeBorderBottom?: string
    activeForeground?: string
    inactiveBackground?: string
    inactiveBorder?: string
    inactiveBorderTop?: string
    inactiveBorderBottom?: string
    inactiveForeground?: string
    hoverBackground?: string
    hoverBorder?: string
    hoverBorderTop?: string
    hoverBorderBottom?: string
    hoverForeground?: string
  }
  toolBar: {
    hoverBackground?: string
  }
  titleBar: {
    activeBackground?: string
    activeForeground?: string
    borderBottom?: string
  }
  pro: {
    background?: string
    border?: string
  }
}
