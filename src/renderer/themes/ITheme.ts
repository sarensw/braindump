export interface IEditorTokens {
  header: IEditorToken
  email: IEditorToken
  link: IEditorToken
  user: IEditorToken
  taskOpen: IEditorToken
  taskDone: IEditorToken
  keyword: IEditorToken
}

export interface IEditorToken {
  foreground: string
  fontStyle: string
}

export interface ITheme {
  background?: string
  foreground?: string
  files: {
    selectedForeground?: string
  }
  editor: {
    background?: string
    foreground?: string
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
  dropdown: {
    foreground?: string
    background?: string
    border?: string
    hoverForeground?: string
    hoverBackground?: string
    hoverBorder?: string
  }
  label: {
    foreground?: string
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
}
