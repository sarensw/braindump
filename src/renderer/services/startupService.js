import log from '../log'
import store from '../store'
import { set as setTheme } from '../store/storeTheme'
import { set as setSettings } from '../store/storeSettings'
import themes from '../themes'

/**
 * This is the startup method that is run when braindump starts up. It will
 * load the settings, theme, and everything else that is required in this
 * stage.
 */
async function startup () {
  log.info('startup braindown')
  const settings = await loadSettings()
  log.debug('settings loaded')
  log.debug(settings)
  await loadTheme(settings.settings)
  log.debug('theme loaded')
}

async function loadSettings () {
  log.debug('loading the settings')
  const settings = await window.__preload.invoke({
    channel: 'loadSettings'
  })
  store.dispatch(setSettings(settings))
  return settings
}

async function loadTheme (settings) {
  try {
    log.debug('loading the theme')
    log.debug(`trying to load ${settings.theme}`)
    const theme = themes[settings.theme]
    store.dispatch(setTheme({
      theme,
      id: settings.theme
    }))
  } catch (err) {
    log.error(err.message)
  }
}

export default { startup }
