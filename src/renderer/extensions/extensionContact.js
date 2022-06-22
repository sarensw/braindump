import suggestionsDb from '../services/suggestionService'

/**
 * Handles toggling a task
 * @param {string} text the text that was entered
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor monaco editor instance
 * @returns true in case the extension did change anything, false otherwise
 */
function handleNewWord (text, editor) {
  if (text.match(/\s/)) {
    const model = editor.getModel()
    const currentPosition = editor.getPosition()
    const previousPosition = {
      column: currentPosition.column - 1,
      lineNumber: currentPosition.lineNumber
    }
    if (text === '\n') {
      previousPosition.lineNumber--
      previousPosition.column = model.getLineLength(previousPosition.lineNumber)
    }
    const lastWord = model.getWordAtPosition(previousPosition)
    if (lastWord) {
      const character = model.getValueInRange({
        startColumn: lastWord.startColumn - 1,
        endColumn: lastWord.startColumn,
        startLineNumber: previousPosition.lineNumber,
        endLineNumber: previousPosition.lineNumber
      })
      const hasAt = character === '@'
      const hasSharp = character === '#'

      if (hasAt) {
        suggestionsDb.put('contact', '@' + lastWord.word)
      } else if (hasSharp) {
        suggestionsDb.put('hashtag', '#' + lastWord.word)
      } else {
        suggestionsDb.put('word', lastWord.word)
      }
    }
  }
}

export default [
  handleNewWord
]
