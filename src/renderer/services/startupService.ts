import log from '../log'
import { store } from '../store'
import { setTheme } from '../store/storeThemeNew'
import { Settings } from '../../shared/types'
import { loadFiles } from './fileService'
import { loadSettings } from './settingsService'
import { Light } from '../themes/themeLoader'

/**
 * This is the startup method that is run when braindump starts up. It will
 * load the settings, theme, and everything else that is required in this
 * stage.
 */
async function startup (): Promise<void> {
  log.info('startup braindown')

  // load the settings
  const settings = await loadSettings()
  log.debug('settings loaded')

  // load the theme
  await loadTheme(settings)
  log.debug('theme loaded')

  // load the files
  await loadFiles()
  log.debug('files loaded')
}

async function loadTheme (settings: Settings): Promise<void> {
  try {
    log.debug('loading the theme')
    log.debug(`trying to load ${settings['app.theme']}`)
    const theme = Light
    store.dispatch(setTheme({
      theme,
      id: settings['app.theme']
    }))
  } catch (err: any) {
    log.error(err.message)
  }
}

export default { startup }
