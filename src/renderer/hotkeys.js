import log from './log'
import store from './store'
import { setCurrentTab, closeTab } from './store/storeTabs'
import dumpService from './services/dumpService'

const keyHandlers = {
  'cmd+p': handleCmdP,
  'cmd+t': handleOpenNewTab,
  'cmd+w': handleCloseActiveTab
}
const keys = [
  'cmd+p',
  'cmd+t',
  'cmd+w'
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

function handleOpenNewTab () {
  log.debug('adding new dump via hotkey')
  dumpService.flush()
  store.dispatch(setCurrentTab(null))
}

function handleCloseActiveTab () {
  log.debug('close current tab via hotkey')
  dumpService.flush()
  const state = store.getState()
  if (state) {
    const currentTab = state.tabs.currentTab
    if (currentTab) {
      store.dispatch(closeTab(currentTab))
    }
  }
}

export { keys, handleKeyDownEvent }
