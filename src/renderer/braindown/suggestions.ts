import { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import suggestionService from '../services/suggestionService'

async function loadContactSuggestions (monaco: Monaco, start): Promise<monaco.languages.CompletionList> {
  const suggestions = await suggestionService.get('contact', 'start')
  const completionItems = suggestions.map(suggestion => ({
    label: suggestion.contact,
    filterText: suggestion.contact.substring(1),
    documentation: suggestion.contact,
    insertText: suggestion.contact.substring(1),
    kind: monaco.languages.CompletionItemKind.Text
  }))
  return {
    suggestions: [
      ...completionItems
    ]
  }
}

async function loadWordSuggestions (monaco: Monaco): Promise<monaco.languages.CompletionList> {
  const suggestions = await suggestionService.get('word', '')
  const completionItems = suggestions.map(suggestion => ({
    label: suggestion.word,
    filterText: suggestion.word,
    documentation: suggestion.word,
    insertText: suggestion.word,
    kind: monaco.languages.CompletionItemKind.Text
  }))
  return {
    suggestions: [
      ...completionItems
    ]
  }
}

export { loadContactSuggestions, loadWordSuggestions }
