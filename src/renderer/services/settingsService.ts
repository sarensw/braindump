import log from '../log'
import { Settings } from '../settings/Settings'
import { store } from '../store'
import { set as setSettings } from '../store/storeSettings'

async function loadSettings (): Promise<Settings> {
  log.debug('loading the settings')
  const settings = await window.__preload.invoke({
    channel: 'loadSettings'
  })
  log.debug('settings loaded')
  log.debug(settings)
  store.dispatch(setSettings(settings))
  return settings.settings
}

async function saveSettings (): Promise<void> {
  log.debug('save settings')
  window.__preload.invoke({
    channel: 'saveSettings',
    payload: store.getState().settings.settings
  })
}

export { loadSettings, saveSettings }
