import log from '../log'

const registerBraindownLanguage = monaco => {
  log.debug('registerBraindownLanguage')

  // Register a new language
  monaco.languages.register({ id: 'braindown' })

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('braindown', {
    tokenizer: {
      root: [
        [/^# .*/, 'entity.name.class'],
        [/\[error.*/, 'custom-error'],
        [/\[notice.*/, 'custom-notice'],
        [/\[info.*/, 'custom-info'],
        [/\[[a-zA-Z 0-9:]+\]/, 'custom-date']
      ]
    }
  })

  // Define a new theme that contains only rules that match this language
  /* monaco.editor.defineTheme('braindownTheme', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: 'custom-info', foreground: '808080' },
      { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
      { token: 'custom-notice', foreground: 'FFA500' },
      { token: 'custom-date', foreground: '008800' },
    ]
  }); */

  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider('braindown', {
    provideCompletionItems: () => {
      const suggestions = [{
        label: 'simpleText',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'simpleText'
      }, {
        label: 'testing',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'testing(${1:condition})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      }, {
        label: 'ifelse',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          'if (${1:condition}) {',
          '\t$0',
          '} else {',
          '\t',
          '}'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'If-Else Statement'
      }]
      return { suggestions: suggestions }
    }
  })

  // monaco.editor.create(document.getElementById("container"), {
  //   theme: 'braindownTheme',
  //   value: getCode(),
  //   language: 'braindown'
  // });
  // monaco.editor.setTheme('braindownTheme')
  monaco.editor.setModelLanguage(monaco.editor.getModels()[0], 'braindown')
  // monaco.editor.setLanguage('braindown')
}

export default registerBraindownLanguage
