import { DateTime } from 'luxon'

function loadSuggestions (monaco) {
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
  console.log('loadSuggestions')
  console.log(suggestions[0].insertText)
  return suggestions.map(s => {
    return {
      ...s,
      kind: monaco.languages.CompletionItemKind.Keyword
    }
  })
}

export { loadSuggestions }
