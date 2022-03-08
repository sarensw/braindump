import log from '../log'
import { store } from '../store'
import { set as setSettings } from '../store/storeSettings'
import SettingsStructure from '../settings/settings.json'
import { readFile, saveFileContent } from './fileService'
import { Settings } from '../braindump'

const PATH_FILE_SETTINGS: string = 'settings.json'

async function loadSettings (): Promise<Settings> {
  log.debug('loading the settings')
  let settingsRaw = await readFile(PATH_FILE_SETTINGS)
  let settings = JSON.parse(settingsRaw)

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
    settingsRaw = JSON.stringify(settings, null, 2)
    saveFileContent(PATH_FILE_SETTINGS, settingsRaw)
  } else {
    log.debug('settings loaded')
  }

  log.debug(settings)
  store.dispatch(setSettings(settings))
  return settings
}

async function saveSettings (): Promise<void> {
  const settings = store.getState().settings
  const settingsRaw = JSON.stringify(settings, null, 2)
  log.debug('save settings')
  saveFileContent(PATH_FILE_SETTINGS, settingsRaw)
}

export { loadSettings, saveSettings }
