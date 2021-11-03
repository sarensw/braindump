import suggestionService from '../services/suggestionService'

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

export { loadContactSuggestions, loadWordSuggestions }
