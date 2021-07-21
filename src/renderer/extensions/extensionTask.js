
/**
 * Handles the creation of a new task
 * @param {EditorView} view the editor view
 * @param {number} from starting point position
 * @param {number} to ending point position
 * @param {string} insert character inserted
 * @returns true in case transaction returned, false otherwise
 */
function handleNewTask (view, from, to, insert) {
  /* console.log({ view, from, to, insert })
  if (insert === ']') {
    console.log('] found')
    if (view.state.doc.sliceString(from - 1, to) === '[') {
      const tr = view.state.update({
        changes: [
          { from, insert: ' ] ' }
        ],
        selection: { anchor: from + 3 },
        scrollIntoView: true
      })
      view.dispatch(tr)
      return true
    }
    return false
  } else {
    return false
  } */
}

/* function prevChar (view, from, length) {
  return view.state.doc.sliceString(from - length, from)
}

function nextChar (view, from, length) {
  return view.state.doc.sliceString(from, from + length)
} */

/**
 * Handles the toggling a task from done to not done and vv
 * @param {EditorView} view the editor view
 * @param {number} from starting point position
 * @param {number} to ending point position
 * @param {string} insert character inserted
 * @returns true in case transaction returned, false otherwise
 */
function handleToggleTask (view, from, to, insert) {
  /* if (insert === 'x') {
    // handle x (marking task as done)
    if (prevChar(view, from, 1) === '[' && nextChar(view, from, 2) === ' ]') {
      const tr = view.state.update({
        changes: [
          { from, to: to + 2, insert: 'x]' }
        ],
        scrollIntoView: true
      })
      view.dispatch(tr)
      return true
    }
    if (prevChar(view, from, 2) === '[ ' && nextChar(view, from, 1) === ']') {
      const tr = view.state.update({
        changes: [
          { from: from - 1, to: to + 1, insert: 'x]' }
        ],
        selection: { anchor: from },
        scrollIntoView: true
      })
      view.dispatch(tr)
      return true
    }

    // handle space (marking task as not done)
    if (prevChar(view, from, 1) === '[' && nextChar(view, from, 2) === 'x]') {
      const tr = view.state.update({
        changes: [
          { from, to: to + 2, insert: ' ]' }
        ],
        scrollIntoView: true
      })
      view.dispatch(tr)
      return true
    }
    if (prevChar(view, from, 2) === '[x' && nextChar(view, from, 1) === ']') {
      const tr = view.state.update({
        changes: [
          { from: from - 1, to: to + 1, insert: ' ]' }
        ],
        selection: { anchor: from },
        scrollIntoView: true
      })
      view.dispatch(tr)
      return true
    }
  } */

  return false
}

export function newTask () {
  return [
    /* EditorView.inputHandler.of(handleNewTask),
    EditorView.inputHandler.of(handleToggleTask) */
  ]
}
