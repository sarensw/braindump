import log from '../log'
import { loadFiles } from './fileService'
import { loadSettings } from './settingsService'
import { loadLicense } from './licenseService'

/**
 * This is the startup method that is run when braindump starts up. It will
 * load the settings, theme, and everything else that is required in this
 * stage.
 */
async function startup (): Promise<void> {
  log.info('startup braindump')

  // load the settings
  /* const settings =  */await loadSettings()
  log.debug('settings loaded')

  // load the license
  await loadLicense()
  log.debug('license loaded')

  // load the files
  await loadFiles()
  log.debug('files loaded')
}

export default { startup }
