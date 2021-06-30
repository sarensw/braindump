import electron from 'electron'
import log from 'electron-log'
import path from 'path'
import fs from 'fs/promises'

class Storage {
  constructor () {
    log.info('Initializing Storage')
    this.userDataPath = electron.app.getPath('userData')
  }

  async getDocument ({ fileName }) {
    const filePath = path.join(this.userDataPath, fileName + '.txt')
    try {
      const text = await fs.readFile(filePath)
      return text.toString()
    } catch (error) {
      console.error(error)
      return error.message
    }
  }

  async saveDocument ({ tabId, text }) {
    log.debug(`Saving document: ${tabId}, ${text.length}`)

    const filePath = path.join(this.userDataPath, tabId + '.txt')
    log.debug(`Storing text in ${filePath}`)
    try {
      await fs.writeFile(filePath, text)
      log.debug('write ok')
    } catch (err) {
      log.error(err)
    }
  }
}

// expose the class
export default Storage
