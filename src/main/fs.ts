import * as electron from 'electron'
import { join } from 'path'
import * as fs from 'fs/promises'
import log from 'electron-log'

export class FileSystem {
  private readonly userDataPath: string

  constructor (parameters) {
    this.userDataPath = electron.app.getPath('userData')
  }

  /**
   * Checks whether the given file actually exists
   * @param path path to the file to check
   * @returns true in case the file exists, false otherwise
   */
  public async exists (path: string): Promise<boolean> {
    try {
      await fs.stat(path)
      return true
    } catch (err) {
      return false
    }
  }

  /**
   * Gets the size in bytes of the given file
   * @param path path to the file to measure
   * @returns number of bytes of the given file
   */
  public async size (path: string): Promise<number> {
    try {
      const stats = await fs.stat(path)
      const size = stats.size
      return size
    } catch (err) {
      return 0
    }
  }

  /**
   * Loads the content of a given file
   * @param path path to the file to load
   */
  public async read (path: string): Promise<string | null> {
    log.debug(`Attempting to read file ${path}`)

    let fullPath = path
    if (!fullPath.startsWith('/')) {
      fullPath = join(this.userDataPath, path)
    }
    const exists = await this.exists(fullPath)
    if (exists) {
      log.debug(`${fullPath} exists. Reading...`)
      const text = await fs.readFile(fullPath)
      log.debug(`text length is ${text.length}`)
      return text.toString()
    } else {
      log.debug(`${fullPath} not found. Returning null`)
      return null
    }
  }

  /**
   * Writes the given text into the given file. Existing content is overriden.
   * @param path path to the file to write
   * @param text text to write into the file
   */
  async write (path: string, text: string): Promise<void> {
    log.debug(`attempting to write some text of length ${text.length} to ${path}`)

    let fullPath = path
    if (!fullPath.startsWith('/')) {
      fullPath = join(this.userDataPath, path)
    }

    await fs.writeFile(fullPath, text)
  }
}
