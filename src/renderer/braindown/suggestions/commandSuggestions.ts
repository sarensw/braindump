import { Monaco } from '@monaco-editor/react'
import { DateTime } from 'luxon'
import { Position } from 'monaco-editor'
import { store } from '../../store'

export function loadCommandSuggestions (monaco: Monaco, model: monaco.editor.ITextModel, position: Position): monaco.languages.CompletionItem[] {
  var word = model.getWordUntilPosition(position)
  var range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  }

  const suggestions: monaco.languages.CompletionItem[] = [
    {
      label: '//date',
      documentation: 'current date',
      insertText: `${String(DateTime.now().toFormat('yyyy-MM-dd'))}`,
      range: range,
      kind: monaco.languages.CompletionItemKind.Keyword
    },
    {
      label: '//time',
      documentation: 'current time',
      insertText: `${String(DateTime.now().toFormat('hh:mm'))}`,
      range: range,
      kind: monaco.languages.CompletionItemKind.Keyword
    },
    {
      label: '//date+time',
      documentation: 'current date',
      insertText: `${String(DateTime.now().toFormat('yyyy-MM-dd_hh:mm'))}`,
      range: range,
      kind: monaco.languages.CompletionItemKind.Keyword
    },
    {
      label: '//calendar week',
      documentation: 'current calendar week',
      insertText: `cw${String(DateTime.now().toFormat('WW'))}`,
      range: range,
      kind: monaco.languages.CompletionItemKind.Keyword
    }
  ]

  // add user snippets
  const snippets = store.getState().snippets
  for (const snippet of snippets) {
    suggestions.push({
      label: '//' + snippet.name,
      documentation: snippet.description,
      insertText: snippet.body,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
      kind: monaco.languages.CompletionItemKind.Snippet
    })
  }

  return suggestions
}
