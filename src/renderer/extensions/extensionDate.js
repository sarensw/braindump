import { EditorView } from '@codemirror/view'
import dateFormat from 'dateformat'

/**
 * Handles adding a date
 * @param {EditorView} view the editor view
 * @param {number} from starting point position
 * @param {number} to ending point position
 * @param {string} insert character inserted
 * @returns true in case transaction returned, false otherwise
 */
function handleDate (view, from, to, insert) {
  console.log({ view, from, to, insert })
  if (insert === '/') {
    console.log('/ found')
    if (view.state.doc.sliceString(from - 1, to) === '/') {
      const tr = view.state.update({
        changes: [
          { from, insert: `/${dateFormat(new Date(), 'yyyy-mm-dd')} ` }
        ],
        selection: { anchor: from + 12 },
        scrollIntoView: true
      })
      view.dispatch(tr)
      return true
    }
    return false
  } else {
    return false
  }
}

export function newDate () {
  return [
    EditorView.inputHandler.of(handleDate)
  ]
}
