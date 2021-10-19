import log from './log'
import { store } from './store'
import { flushFile, closeFile, createNewFile, loadFiles } from './services/fileService'

const keyHandlers = {
  'cmd+t': handleOpenNewTab,
  'cmd+w': handleCloseActiveTab
}
const keys = [
  'cmd+p',
  'cmd+t',
  'cmd+w'
].join(',')

function handleKeyDownEvent (event: KeyboardEvent, source: string): void {
  log.debug(`handle keydown event from ${source}`)
  let prefix: string = ''
  console.log(event)
  if (event.ctrlKey) prefix += 'ctrl+'
  if (event.altKey) prefix += 'alt+'
  if (event.metaKey) prefix += 'cmd+'
  const hk = prefix + event.key
  log.debug(`hotkey found ${hk}`)
  handleHotkeys(event, hk, source)
}

function handleHotkeys (event: KeyboardEvent, hotkey: string, source: string): void {
  if (keyHandlers[hotkey] !== undefined) {
    event.preventDefault()
    log.debug(`Catched ${hotkey} from ${source}`)
    keyHandlers[hotkey]()
  }
}

async function handleOpenNewTab (): Promise<void> {
  log.debug('adding new dump via hotkey')
  flushFile()
  await createNewFile()
  await loadFiles()
}

async function handleCloseActiveTab (): Promise<void> {
  log.debug('close current tab via hotkey')
  flushFile()
  const state = store.getState()
  if (state.files.current !== null) {
    await closeFile(state.files.current)
  }
}

export { keys, handleKeyDownEvent }
