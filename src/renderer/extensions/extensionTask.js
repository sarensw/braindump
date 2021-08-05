
/**
 * Handles toggling a task
 * @param {string} text the text that was entered
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor monaco editor instance
 * @returns true in case the extension did change anything, false otherwise
 */
function handleToggleTask (text, editor) {
  const model = editor.getModel()
  const position = editor.getPosition()

  // handle the cases [xx] and [ x]
  //                    |        |
  //                 inserted character
  let token = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: position.column - 3,
    endLineNumber: position.lineNumber,
    endColumn: position.column + 1
  })
  if (token === '[ x]') {
    model.pushEditOperations([],
      [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column - 3,
          endLineNumber: position.lineNumber,
          endColumn: position.column + 1
        },
        text: '[x]'
      }])
    const newPosition = position
    newPosition.column = position.column - 1
    editor.setPosition(newPosition)
    return true
  }
  if (token === '[xx]') {
    model.pushEditOperations([],
      [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column - 3,
          endLineNumber: position.lineNumber,
          endColumn: position.column + 1
        },
        text: '[ ]'
      }])
    const newPosition = position
    newPosition.column = position.column - 1
    editor.setPosition(newPosition)
    return true
  }

  // handle the cases [xx] and [x ]
  //                   |        |
  //                 inserted character
  token = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: position.column - 2,
    endLineNumber: position.lineNumber,
    endColumn: position.column + 2
  })
  if (token === '[x ]') {
    model.pushEditOperations([],
      [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endLineNumber: position.lineNumber,
          endColumn: position.column + 2
        },
        text: '[x]'
      }])
    const newPosition = position
    newPosition.column = position.column - 1
    editor.setPosition(newPosition)
    return true
  }
  if (token === '[xx]') {
    model.pushEditOperations([],
      [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endLineNumber: position.lineNumber,
          endColumn: position.column + 2
        },
        text: '[ ]'
      }])
    const newPosition = position
    newPosition.column = position.column - 1
    editor.setPosition(newPosition)
    return true
  }

  return false
}

export default [
  handleToggleTask
]
