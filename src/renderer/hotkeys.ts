import log from './log'
import * as monaco from 'monaco-editor'
import { store } from './store'
import { flushFile, closeFile, createNewFile, loadFiles } from './services/fileService'
import { setActivePage } from './store/storeApp'

const keyHandlers = {
  'cmd+t': handleOpenNewTab,
  'cmd+w': handleCloseActiveTab,
  'ctrl+n': handleChangeName,
  'ctrl+1': handleToggleTask
}
const keys = [
  'cmd+p',
  'cmd+t',
  'cmd+w'
].join(',')

function handleKeyDownEvent (event: KeyboardEvent, source: string, codeEditor: monaco.editor.IStandaloneCodeEditor | null): void {
  log.debug(`handle keydown event from ${source}`)
  let prefix: string = ''
  if (event.ctrlKey) prefix += 'ctrl+'
  if (event.altKey) prefix += 'alt+'
  if (event.metaKey) prefix += 'cmd+'
  const hk = prefix + event.key
  log.debug(`hotkey found ${hk}`)
  handleHotkeys(event, hk, source, codeEditor)
}

function handleHotkeys (event: KeyboardEvent, hotkey: string, source: string, codeEditor: monaco.editor.IStandaloneCodeEditor | null): void {
  if (keyHandlers[hotkey] !== undefined) {
    event.preventDefault()
    log.debug(`Catched ${hotkey} from ${source}`)
    keyHandlers[hotkey](codeEditor)
  }
}

async function handleOpenNewTab (): Promise<void> {
  log.debug('adding new dump via hotkey')
  flushFile()
  await createNewFile()
  store.dispatch(setActivePage('editor'))
  await loadFiles()
}

async function handleCloseActiveTab (): Promise<void> {
  log.debug('close current tab via hotkey')
  flushFile()
  const state = store.getState()
  if (state.files.current !== null) {
    if (typeof state.files.current === 'string') {
      await closeFile(state.files.current)
    } else {
      await closeFile(state.files.current.id)
    }
  }
}

function handleChangeName (): void {
  // TODO remove that functionality
  // store.dispatch(setFocusElement('fileName'))
}

function handleToggleTask (codeEditor: monaco.editor.IStandaloneCodeEditor): void {
  log.debug('toggle task')
  const model = codeEditor.getModel()

  const startLineNumber = codeEditor.getSelection()?.startLineNumber
  const endLineNumber = codeEditor.getSelection()?.endLineNumber

  if (startLineNumber === undefined || endLineNumber === undefined) return

  // loop through all lines and toggle all found tasks
  for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
    const line = model?.getLineContent(lineNumber)

    if (line === undefined) return

    // check if that line has a task
    if (line.includes('[ ]')) {
      const pos = line.indexOf('[ ]')
      model?.pushEditOperations(
        [],
        [{
          range: {
            startLineNumber: lineNumber,
            startColumn: pos + 1,
            endLineNumber: lineNumber,
            endColumn: pos + 4
          },
          text: '[x]'
        }],
        () => null
      )
    } else if (line.includes('[x]')) {
      const pos = line.indexOf('[x]')
      model?.pushEditOperations(
        [],
        [{
          range: {
            startLineNumber: lineNumber,
            startColumn: pos + 1,
            endLineNumber: lineNumber,
            endColumn: pos + 4
          },
          text: '[ ]'
        }],
        () => null
      )
    }
  }
}

export { keys, handleKeyDownEvent }
