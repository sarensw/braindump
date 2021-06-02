
/**
 * handles tasks
 * @param { import('codemirror').DocOrEditor } editor
 * @param {*} data
 */
const handleNewTask = (editor, data) => {
  if (data.text[0] === ']') {
    const line = data.from.line
    const ch = data.from.ch
    if (ch > 0 && editor.doc.getRange({ line, ch: ch - 1 }, { line, ch }) === '[') {
      editor.doc.replaceRange(' ] ', { line, ch }, { line, ch: ch + 1 })
    }
  }
}

/**
 * handles toggle tasks
 * @param { import('codemirror').DocOrEditor } editor
 * @param {*} data
 */
const handleToggleTask = (editor, data) => {
  if (data.text[0] === 'x') {
    const line = data.from.line
    const ch = data.from.ch

    const input = editor.doc.getRange({ line, ch: ch - 2 }, { line, ch: ch + 3 })
    let phrase = input
    phrase = phrase.replace(/\[x \]/g, '[x]')
    phrase = phrase.replace(/\[ x\]/g, '[x]')
    phrase = phrase.replace(/\[xx\]/g, '[ ]')

    if (input !== phrase) {
      editor.doc.replaceRange(phrase, { line, ch: ch - 2 }, { line, ch: ch + 3 })
      editor.doc.setCursor({ line, ch })
    }
    /* if (ch > 0 &&
      editor.doc.getRange({ line, ch: ch - 1 }, { line, ch }) === '[' &&
      editor.doc.getRange({ line, ch: ch + 2 }, { line, ch: ch + 3 }) === ']') {
      if (editor.doc.getRange({ line, ch: ch + 1 }, { line, ch: ch + 2 }) === ' ') {
        editor.doc.replaceRange('x', { line, ch }, { line, ch: ch + 2 })
      } else if (editor.doc.getRange({ line, ch: ch + 1 }, { line, ch: ch + 2 }) === 'x') {
        editor.doc.replaceRange(' ', { line, ch }, { line, ch: ch + 2 })
      }
    } else if (ch > 0 &&
      editor.doc.getRange({ line, ch: ch - 2 }, { line, ch: -1 }) === '[' &&
      editor.doc.getRange({ line, ch: ch + 1 }, { line, ch: ch + 2 }) === ']') {
      if (editor.doc.getRange({ line, ch: ch }, { line, ch: ch + 1 }) === ' ') {
        editor.doc.replaceRange('x', { line, ch }, { line, ch: ch + 2 })
      } else if (editor.doc.getRange({ line, ch: ch }, { line, ch: ch + 1 }) === 'x') {
        editor.doc.replaceRange(' ', { line, ch }, { line, ch: ch + 2 })
      }
    } */
  }
}

export default {
  handleNewTask,
  handleToggleTask
}
