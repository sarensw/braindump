export default {
  type: 'dark',

  background: '#212427',
  foreground: '#e1e1e1',
  foregroundLight: '#abb2bf',

  scrollbar: {
    size: '14px',
    thumbBackground: '#79797966',
    borderLeft: '#333333'
  },

  files: {
    foreground: '#e1e1e1',
    selectedForeground: '#212427',
    selectedBackground: '#06bee1',
    headerForeground: '#06bee1',
    headerBackground: 'transparent'
  },

  editor: {
    background: '#212427',
    foreground: '#e1e1e1',
    cursorForeground: '#e1e1e1',
    lineHighlightBackground: '#292c30',
    lineNumberForeground: '#8c939c',
    lineNumberActiveForeground: '#e1e1e1',
    selectionBackground: '#444b53',
    selectionHighlightBackground: '#444b53',
    indentGuideBackground: '#444b53'
  },

  editorTokens: {
    header: {
      foreground: '#06bee1',
      fontStyle: 'bold'
    },
    email: {
      foreground: '#04a5fb',
      fontStyle: 'underline'
    },
    link: {
      foreground: '#04a5fb',
      fontStyle: 'underline'
    },
    user: {
      foreground: '#04a5fb',
      fontStyle: 'italic'
    },
    taskOpen: {
      foreground: '#fe5157',
      fontStyle: 'bold'
    },
    taskDone: {
      foreground: '#8c939c',
      fontStyle: ''
    },
    keyword: {
      foreground: '#fed449',
      fontStyle: ''
    },
    inlineCode: {
      background: '#ffffff0a',
      borderBottom: '#ffffff0a',
      borderTop: '#ffffff0a'
    },
    blockQuote: {
      background: '#ffffff0a',
      marginBackground: '#ffffff21'
    }
  },

  button: {
    foreground: '#e1e1e1',
    background: '#212427',
    border: '#e1e1e1',
    hoverForeground: '#212427',
    hoverBackground: '#e1e1e1',
    hoverBorder: '#e1e1e1'
  },

  list: {
    selectedBackground: '#ffffff',
    selectedForeground: '#000000',
    highlight: '#22c55e',
    secondaryForeground: '#ffffff4d',
    foreground: '#ffffff'
  },

  overlay: {
    border: '#e1e1e1'
  },

  settings: {
    label: {
      foreground: '#e1e1e1'
    },

    description: {
      foreground: '#8c939c'
    },

    dropdown: {
      foreground: '#e1e1e1',
      background: '#212427',
      border: '#e1e1e1'
    },

    text: {
      foreground: '#e1e1e1',
      background: '#212427',
      border: '#8c939c'
    }
  },

  breadcrumb: {
    pathBackground: 'transparent',
    pathForeground: '#797873'
  },

  tabs: {
    background: '#fdfdfd'
  },
  tab: {
    border: 'black',
    activeBackground: '#fdfdfd',
    activeBorder: '#ffffff',
    activeBorderTop: '#fb8f44',
    activeBorderBottom: '#ffffff',
    activeForeground: '#24292f',
    inactiveBackground: '#fdfdfd',
    inactiveBorder: 'white',
    inactiveBorderTop: 'black',
    inactiveBorderBottom: 'black',
    inactiveForeground: '#57606a',
    hoverBackground: '#ffffff',
    hoverBorder: 'black',
    hoverBorderTop: 'black',
    hoverBorderBottom: 'black',
    hoverForeground: 'black'
  },

  toolBar: {
    hoverBackground: 'white'
  },

  titleBar: {
    activeBackground: '#212427',
    activeForeground: '#e1e1e1'
  },

  pro: {
    background: 'transparent',
    border: '#fed449'
  }
}
