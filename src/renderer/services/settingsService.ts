import log from '../log'
import { Settings } from '../../shared/types'
import { store } from '../store'
import { set as setSettings } from '../store/storeSettings'
import SettingsStructure from '../settings/settings.json'

async function loadSettings (): Promise<Settings> {
  log.debug('loading the settings')
  let settings = await window.__preload.invoke({
    channel: 'loadSettings'
  })

  // creaete settings based on defaults when there are no settings available yet
  if (settings === null) {
    log.debug('settings do not exist yet, creating defaults')
    settings = {}
    for (const category of SettingsStructure) {
      for (const setting of category.settings) {
        settings[setting.id] = setting.default
      }
    }

    // save the default settings
    window.__preload.invoke({
      channel: 'saveSettings',
      payload: settings
    })
  } else {
    log.debug('settings loaded')
  }

  log.debug(settings)
  store.dispatch(setSettings(settings))
  return settings
}

async function saveSettings (): Promise<void> {
  log.debug('save settings')
  window.__preload.invoke({
    channel: 'saveSettings',
    payload: store.getState().settings
  })
}

export { loadSettings, saveSettings }
