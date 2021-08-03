import electron from 'electron'
import log from 'electron-log'
import path from 'path'
import fs from 'fs/promises'

const fileExists = async path => !!(await fs.stat(path).catch(e => false))

export class Tab {
  constructor (name, path) {
    this.name = name
    this.path = path
  }

  static fromObject (obj) {
    log.debug('Creating new Tab from', obj)
    return new Tab(obj.name, obj.path)
  }

  async read () {
    log.debug(`Attempting to read file ${this.name} from ${this.path}`)
    if (this.name && this.path) {
      const exists = await fileExists(this.path)
      if (exists) {
        log.debug(`${this.name} exists. Reading...`)
        const text = await fs.readFile(this.path)
        log.debug(`text length is ${text.length}`)
        return text.toString()
      } else {
        log.debug(`${this.name} not found. Just returning the default`)
        return '# Welcome to braindump'
      }
    }
  }

  async write (text) {
    log.debug('writing file')
    if (this.name && this.path) {
      const exists = await fileExists(this.path)
      if (exists) {
        await fs.writeFile(this.path, text)
      } else {
        await fs.writeFile(this.path, '')
      }
    }
  }
}

export class Tabs {
  constructor () {
    log.info('initialize tabs')
    this.userDataPath = electron.app.getPath('userData')
    this.tabs = []
    this.tabsFilePath = path.join(this.userDataPath, 'tabs.json')
  }

  async newTab () {
    const lastTab = this.tabs[this.tabs.length - 1]
    const lastChar = lastTab.name.charAt(lastTab.name.length - 1)
    const lastInt = parseInt(lastChar)
    const newInt = lastInt + 1
    const newTabName = `dump_${newInt}`
    const newTabFile = `dump_${newInt}_${Date.now()}`

    const tab = new Tab(newTabName, path.join(this.userDataPath, newTabFile))
    this.tabs.push(tab)

    await fs.writeFile(this.tabsFilePath, JSON.stringify(this.tabs))

    return tab
  }

  async loadTabs () {
    const exists = await fileExists(this.tabsFilePath)
    if (exists) {
      // load
      log.debug('tabs.json found. Loading...')
      const raw = await fs.readFile(this.tabsFilePath)
      const tabs = JSON.parse(raw)
      this.tabs = tabs
      return tabs
    } else {
      // create as new
      log.debug('No tabs.json existing. Creating a new one')
      const tab = new Tab('dump 0', path.join(this.userDataPath, 'dump_0'))
      tab.write('')
      const tabs = [tab]
      await fs.writeFile(this.tabsFilePath, JSON.stringify(tabs))
      this.tabs = tabs
      return tabs
    }
  }
}
