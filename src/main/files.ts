import * as electron from 'electron'
import log from 'electron-log'
import * as path from 'path'
import * as fs from 'fs/promises'
import { SharedFile } from '../shared/types'
import { v4 as uuidv4 } from 'uuid'

export class File implements SharedFile {
  id: string
  name: string
  path: string

  constructor (id: string | null, name: string, path: string) {
    if (id === null) this.id = uuidv4()
    else this.id = id
    this.name = name
    this.path = path
  }

  async exists (path: string): Promise<boolean> {
    try {
      await fs.stat(path)
      return true
    } catch (err) {
      return false
    }
  }

  async read (): Promise<string> {
    log.debug(`Attempting to read file ${this.name} from ${this.path}`)

    const exists = await this.exists(this.path)
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

  async write (text: string): Promise<void> {
    log.debug('writing file')

    const exists = await this.exists(this.path)
    if (exists) {
      await fs.writeFile(this.path, text)
    } else {
      await fs.writeFile(this.path, '')
    }
  }
}

export class Files {
  private static readonly CONFIG_FILE_NAME: string = 'files.json'

  private count: number
  private readonly filesConfigFile: string
  private lastUsed: string
  private fileList: File[] = []

  constructor () {
    log.info('initialize tabs')
    this.count = 0

    const userDataPath: string = electron.app.getPath('userData')
    this.filesConfigFile = path.join(userDataPath, Files.CONFIG_FILE_NAME)
  }

  public get files (): File[] {
    return this.fileList
  }

  public get lastUsedFile (): string {
    return this.lastUsed
  }

  async write (id: string, text: string): Promise<void> {
    log.debug(`attempting to write some text to ${id}`)
    const file = this.fileList.find(f => f.id === id)
    if (file !== undefined) {
      await file.write(text)
    }
  }

  async writeConfig (): Promise<void> {
    await fs.writeFile(this.filesConfigFile, JSON.stringify({
      lastUsed: this.lastUsed,
      files: this.fileList,
      count: this.count
    }, null, 2))
  }

  async createNewDump (number: number = this.count): Promise<File> {
    const newFileName = `dump_${number}_${Date.now()}`
    const userDataPath: string = electron.app.getPath('userData')
    const file = new File(null, `dump ${number}`, path.join(userDataPath, newFileName))
    await file.write('')

    this.fileList.push(file)
    this.count++

    await this.writeConfig()

    return file
  }

  async close (id: string): Promise<void> {
    log.debug(`attemting to delete file with id ${id}`)
    const i = this.fileList.findIndex(f => f.id === id)
    log.debug(`found the file at index ${i} with length ${this.fileList.length}`)
    this.fileList.splice(i, 1)
    log.debug(`new number of files is ${this.fileList.length}`)
    if (this.fileList.length === 0) {
      const newFile = await this.createNewDump()
      this.lastUsed = newFile.id
    } else {
      // [0, 1, 2, 3, 4] -> length 5, delete 4
      // [0, 1, 2, 3] -> length 4
      if (i === this.fileList.length) {
        this.lastUsed = this.fileList[this.fileList.length - 1].id
      } else {
        this.lastUsed = this.fileList[i].id
      }
    }

    await this.writeConfig()
  }

  async exists (path: string): Promise<boolean> {
    try {
      await fs.stat(path)
      return true
    } catch (err) {
      return false
    }
  }

  async createConfigFileIfNotExists (): Promise<void> {
    const userDataPath: string = electron.app.getPath('userData')

    // check that there is really no config file
    if (await this.exists(path.join(userDataPath, Files.CONFIG_FILE_NAME))) {
      log.debug('Supposed to create a files.json file, but this already exists. Abort.')
      return
    }

    // starting from scratch, first create a new dump file
    const firstDumpFile = await this.createNewDump(0)
    this.fileList.push(firstDumpFile)
    this.lastUsed = firstDumpFile.id
    this.count = 1

    // second, create the files.json file
    await this.writeConfig()
  }

  async loadFiles (): Promise<void> {
    // create the config file if it doesn't exist yet
    await this.createConfigFileIfNotExists()

    // read the config file
    const raw = await fs.readFile(this.filesConfigFile)
    const { files, count, lastUsed } = JSON.parse(raw.toString())
    this.count = count

    this.fileList = []
    for (const file of files) {
      this.fileList.push(new File(file.id, file.name, file.path))
    }
    this.lastUsed = lastUsed
    if (lastUsed === undefined) {
      this.lastUsed = files[0].id
    }
  }

  async lastUsedChanged (id: string): Promise<void> {
    // second, create the files.json file
    await fs.writeFile(this.filesConfigFile, JSON.stringify({
      files: this.fileList,
      lastUsed: id,
      count: this.count
    }, null, 2))
  }

  async loadFileContent (id: string): Promise<string> {
    const file = this.files.find(f => f.id === id)
    if (file === undefined) throw Error(`Couldn't find file with id ${id}`)
    const content = await file.read()
    return content
  }
}
