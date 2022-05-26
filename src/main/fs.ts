import AdmZip from 'adm-zip'
import { app } from 'electron'
import log from 'electron-log'
import * as fs from 'fs/promises'
import { join, parse } from 'path'
import IFileSystem from './IFileSystem'

const PATH_FILE_SNIPPETS: string = 'snippets.yaml'
const PATH_FILE_SETTINGS: string = 'settings.json'
const PATH_FILE_FILES: string = 'files.json'

export class FileSystem implements IFileSystem {
  private userDataPath: string

  public async initialize (): Promise<void> {
    this.userDataPath = await this.getDataPath()
  }

  /**
   * Determines the current path to where the user files are stored
   * @returns path to where the dumps are stored
   */
  public async getDataPath (): Promise<string> {
    // read the settings to get the current user data directory
    let userDataPath = ''

    const settingsString = await this.read(PATH_FILE_SETTINGS)
    if (settingsString == null) {
      // we're not able to load the file
      userDataPath = app.getPath('userData')
    } else {
      const settings = JSON.parse(settingsString)
      if (settings['app.path'] == null || settings['app.path'] === '') {
        userDataPath = app.getPath('userData')
      } else {
        userDataPath = settings['app.path']
      }
    }
    return userDataPath
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
    fullPath = this.correctPath(path)

    log.debug(`about to read ${fullPath}`)
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
   * Corrects the path in a way that internal files are loaded
   * from the electron userData dir. All other files are loaded
   * from the curren user data directory (see settings.json)
   *
   * @param path path to correct
   * @returns corrected path
   */
  private correctPath (path: string): string {
    let result = path
    if (path === PATH_FILE_FILES ||
      path === PATH_FILE_SETTINGS ||
      path === PATH_FILE_SNIPPETS) {
      log.debug(`about to join ${path} with ${app.getPath('userData')}`)
      result = join(app.getPath('userData'), path)
    } else {
      const parsedPath = parse(path)
      if (parsedPath.dir == null || parsedPath.dir === '') {
        result = join(this.userDataPath, path)
      }
    }
    return result
  }

  /**
   * Writes the given text into the given file. Existing content is overriden.
   * @param path path to the file to write
   * @param text text to write into the file
   */
  async write (path: string, text: string): Promise<void> {
    log.debug(`attempting to write some text of length ${text.length} to ${path}`)

    let fullPath = path
    fullPath = this.correctPath(path)

    await fs.writeFile(fullPath, text)
  }

  /**
   * Compresses all files given by the array of paths to one zip file
   * @param filePaths list of paths to the files that shall be stored in the zip
   * @param targetPath path including file name of the zip file to be created
   */
  async compress (filePaths: string[], targetPath: string): Promise<void> {
    log.debug(`Request to compress the following files to ${targetPath}`)
    log.debug(filePaths)

    const zip = new AdmZip()
    filePaths.forEach(filePath => {
      if (filePath.startsWith('/')) {
        zip.addLocalFile(filePath)
      } else {
        const fullFilePath = join(this.userDataPath, filePath)
        zip.addLocalFile(fullFilePath)
      }
    })
    zip.writeZip(targetPath)
  }

  /**
   * Moves all given files to the new path. This method can have the following return codes
   *  - 0: successfull
   *  - 1: failed because the target directory doesn't exist
   *  - 2: failed because one of the files couldn't be moved
   *
   * @param filePaths list of paths to all files that shall be moved to the new location
   * @param newPath the new path to move all the given files to
   * @returns number that describes the status
   */
  async move (filePaths: string[], newPath: string): Promise<number> {
    log.debug(`Moving ${filePaths.length} to ${newPath}`)
    log.debug(filePaths)

    // check if the target path exists
    const newPathExists = await this.exists(newPath)
    if (!newPathExists) {
      log.info(`target path ${newPath} does not exist`)
      return 1 // FileServiceMoveResult.FailedInvalidPath
    }

    // move all the given files
    for (const filePath of filePaths) {
      const parsedPath = parse(filePath)

      let fullFilePath = ''
      if (parsedPath.dir !== '') fullFilePath = filePath
      else fullFilePath = join(this.userDataPath, filePath)

      try {
        await fs.copyFile(fullFilePath, join(newPath, parsedPath.base))
      } catch (err) {
        log.info(`could not copy the file ${filePath} because ${String(err)}`)
        return 2 // FileServiceMoveResult.FailedCopy
      }
    }

    return 0 // FileServiceMoveResult.Successful
  }
}
