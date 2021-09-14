import log from './log'
import store from './store'
import { setCurrentTab/* , setSettingsAsCurrentTab */ } from './store/storeTabs'
import dumpService from './services/dumpService'

const keyHandlers = {
  'cmd+p': handleCmdP,
  'cmd+t': handleCmdT
}
const keys = [
  'cmd+p',
  'cmd+t'
].join(',')

function handleKeyDownEvent (event, source) {
  let prefix = ''
  if (event.ctrlKey) prefix += 'ctrl+'
  if (event.altKey) prefix += 'alt+'
  if (event.metaKey) prefix += 'cmd+'
  const hk = prefix + event.key
  handleHotkeys(hk, source)
}

function handleHotkeys (hotkey, source) {
  if (keyHandlers[hotkey]) {
    log.debug(`Catched ${hotkey} from ${source}`)
    keyHandlers[hotkey]()
  }
}

function handleCmdP () {

}

function handleCmdT () {
  log.debug('adding new dump')
  dumpService.flush()
  store.dispatch(setCurrentTab(null))
}

export { keys, handleKeyDownEvent }
