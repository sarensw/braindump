import log from '../log'
import store from '../store'
import { randomString } from './utilitiesService'
import { clean } from '../store/storeDump'
import { set as setTabs, setCurrentTab } from '../store/storeTabs'

const id = randomString(4)
const timerInterval = 2000

function initializeDumpService () {
  log.debug('initializing the dump service', id)
  setInterval(saveDump, timerInterval)
  log.debug(`started timer in an interval of ${timerInterval}ms`, id)
}

async function loadDumps () {
  log.info('loading tabs')
  const { tabs, lastUsed } = await window.__preload.invoke({ channel: 'loadTabs' })
  console.log(tabs)
  console.log(lastUsed)
  store.dispatch(setTabs(tabs))
  return { tabs, lastUsed }
}

async function initializeDumps () {
  log.info('loading tabs')
  const { tabs, lastUsed } = await loadDumps()
  const lastUsedTab = tabs.find(tab => tab.path === lastUsed)
  store.dispatch(setCurrentTab(lastUsedTab))
}

function saveDump () {
  const state = store.getState()

  if (state) {
    const currentTab = state.tabs.currentTab
    const showSettings = state.tabs.showSettings
    const dump = state.dump
    if (dump) {
      if (dump.dirty && !showSettings) {
        const text = dump.text
        log.debug(`intent to save text of length ${text.length}`, id, showSettings)

        window.__preload.send({
          channel: 'saveDump',
          payload: {
            tab: currentTab,
            text
          }
        })

        store.dispatch(clean())
      }
    }
  }
}

function flush () {
  saveDump()
}

export default { initializeDumpService, loadDumps, initializeDumps, flush }
