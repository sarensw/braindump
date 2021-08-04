/* eslint-disable no-template-curly-in-string */

import log from '../log'
import { loadSuggestions } from './suggestions'

/**
 * Registers and configures the braindown language
 * @param {import('monaco-editor')} monaco monaco editor
 */
const registerBraindownLanguage = monaco => {
  if (monaco) {
    log.debug('registerBraindownLanguage')

    // Register a new language
    monaco.languages.register({ id: 'braindown' })

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('braindown', {
      tokenizer: {
        root: [
          [/^# .*/, 'entity.name.class'],
          [/\/\/[\w\d-:_;>=+]+\S/, 'keyword'],
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

    monaco.languages.registerOnTypeFormattingEditProvider('braindown', {
      autoFormatTriggerCharacters: [']'],
      /** @param {import('monaco-editor/esm/vs/editor/editor.api').editor.IModel} model */
      provideOnTypeFormattingEdits: (model, position, ch, options, token) => {
        const t = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        })
        if (t === '[]') {
          return [
            {
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 2,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              },
              text: '[ ] '
            }
          ]
        }
      }
    })

    monaco.languages.registerCompletionItemProvider('braindown', {
      triggerCharacters: ['/'],
      /**
       * @param {import('monaco-editor').editor.ITextModel} model the text model
       * @param {import('monaco-editor').Position} position the current position
       * @param {import('monaco-editor').languages.CompletionContext} context the completion context
       * @param {import('monaco-editor').CancellationToken} token the cancellation token
       */
      provideCompletionItems: (model, position, context, token) => {
        const t = model.getValueInRange({
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endColumn: position.column
        })

        if (t === '//') {
          return {
            suggestions: loadSuggestions(monaco)
          }
        }
      }
    })

    // monaco.editor.create(document.getElementById("container"), {
    //   theme: 'braindownTheme',
    //   value: getCode(),
    //   language: 'braindown'
    // });
    // monaco.editor.setTheme('braindownTheme')
    // monaco.editor.setModelLanguage(monaco.editor.getModels()[0], 'braindown')
    // monaco.editor.setLanguage('braindown')
  }
}

export default registerBraindownLanguage
