import log from '../log'
import store from '../store'
import { randomString } from './utilitiesService'
import { clean } from '../store/storeDump'

const id = randomString(4)
const timerInterval = 2000

function initializeDumpService () {
  log.debug('initializing the dump service', id)
  setInterval(saveDump, timerInterval)
  log.debug(`started timer in an interval of ${timerInterval}ms`, id)
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

export default { initializeDumpService, flush }
