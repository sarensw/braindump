import { DateTime } from 'luxon'
import suggestionService from '../services/suggestionService'

function loadCommandSuggestions (monaco) {
  const suggestions = [
    {
      label: '//date',
      documentation: 'current date',
      insertText: `${DateTime.now().toFormat('yyyy-MM-dd')}`
    },
    {
      label: '//time',
      documentation: 'current time',
      insertText: `${DateTime.now().toFormat('hh:mm')}`
    },
    {
      label: '//date+time',
      documentation: 'current date',
      insertText: `${DateTime.now().toFormat('yyyy-MM-dd_hh:mm')}`
    },
    {
      label: '//calendar week',
      documentation: 'current calendar week',
      insertText: `cw${DateTime.now().toFormat('WW')}`
    }
  ]
  return suggestions.map(s => {
    return {
      ...s,
      kind: monaco.languages.CompletionItemKind.Keyword
    }
  })
}

async function loadContactSuggestions (monaco, start) {
  const suggestions = await suggestionService.get('contact', start)
  return suggestions.map(suggestion => ({
    label: suggestion.contact,
    filterText: suggestion.contact.substring(1),
    documentation: suggestion.contact,
    insertText: suggestion.contact.substring(1),
    kind: monaco.languages.CompletionItemKind.Text
  }))
}

async function loadWordSuggestions (monaco) {
  const suggestions = await suggestionService.get('word')
  return suggestions.map(suggestion => ({
    label: suggestion.word,
    filterText: suggestion.word,
    documentation: suggestion.word,
    insertText: suggestion.word,
    kind: monaco.languages.CompletionItemKind.Text
  }))
}

export { loadCommandSuggestions, loadContactSuggestions, loadWordSuggestions }
