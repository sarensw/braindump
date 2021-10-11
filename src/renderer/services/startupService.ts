import log from '../log'
import store from '../store'
import { set as setTheme } from '../store/storeTheme'
import { set as setSettings } from '../store/storeSettings'
import themes from '../themes'
import { Settings } from '../settings/Settings'

/**
 * This is the startup method that is run when braindump starts up. It will
 * load the settings, theme, and everything else that is required in this
 * stage.
 */
async function startup (): Promise<void> {
  log.info('startup braindown')
  const settings = await loadSettings()
  log.debug('settings loaded')
  log.debug(settings)
  await loadTheme(settings)
  log.debug('theme loaded')
}

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

async function loadTheme (settings: Settings): Promise<void> {
  try {
    log.debug('loading the theme')
    log.debug(`trying to load ${settings['app.theme']}`)
    const theme = themes[settings['app.theme']]
    store.dispatch(setTheme({
      theme,
      id: settings['app.theme']
    }))
  } catch (err: any) {
    log.error(err.message)
  }
}

export default { startup }
