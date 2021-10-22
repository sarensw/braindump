import electron from 'electron'
import log from 'electron-log'
import path from 'path'
import fs from 'fs/promises'
import { fileExists } from './helper'
import { Settings } from '../shared/types'

export class SettingsFile {
  userDataPath: string = ''
  path: string = ''

  constructor () {
    this.userDataPath = electron.app.getPath('userData')
    this.path = path.join(this.userDataPath, 'settings.json')
  }

  async read (): Promise<Settings | null> {
    log.debug('loading settings from ' + this.path)
    const exists = await fileExists(this.path)
    if (exists) {
      log.debug('settings found, loading')
      const raw = await fs.readFile(this.path)
      const settings = JSON.parse(raw.toString())
      return settings
    } else {
      log.debug('settings not found, creating based on default settings')
      return null
    }
  }

  async write (settings): Promise<void> {
    log.debug(`saving settings at ${this.path}`)
    await fs.writeFile(this.path, JSON.stringify(settings))
  }
}
