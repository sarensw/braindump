import electron from 'electron'
import log from 'electron-log'
import path from 'path'
import fs from 'fs/promises'
import { fileExists } from './helper'

const defaultSettings = {
  theme: 'nordlight'
}

export class Settings {
  constructor () {
    this.userDataPath = electron.app.getPath('userData')
    this.path = path.join(this.userDataPath, 'settings.json')
  }

  async read () {
    log.debug('loading settings from ' + this.path)
    const exists = await fileExists(this.path)
    if (exists) {
      log.debug('settings found, loading')
      const raw = await fs.readFile(this.path)
      const settings = JSON.parse(raw)
      return {
        path: this.path,
        settings: settings
      }
    } else {
      log.debug('settings not found, creating based on default settings')
      await fs.writeFile(this.path, JSON.stringify(defaultSettings))
      return defaultSettings
    }
  }

  async write (settings) {
    log.debug(`saving settings at ${this.path}`)
    await fs.writeFile(this.path, JSON.stringify(settings))
  }
}
