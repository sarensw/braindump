import { SharedFileList } from '../../shared/types'
import log from '../log'
import { store } from '../store'
import { File } from '../store/files/file'
import { setFiles, setCurrentFile, cleanDirtyText } from '../store/storeFiles'
import { randomString } from './utilitiesService'

const id = randomString(4)
const timerInterval = 2000

function initializeFileService (): void {
  log.debug('initializing the dump service', id)
  setInterval(saveFile, timerInterval)
  log.debug(`started timer in an interval of ${timerInterval}ms`, id)
}

async function createNewFile (): Promise<void> {
  const id: string = await window.__preload.invoke({
    channel: 'file/new'
  })
  await window.__preload.invoke({
    channel: 'files/lastUsedChanged',
    payload: id
  })

  await loadFiles()
}

async function loadFile (file: File): Promise<void> {
  const result: string = await window.__preload.invoke({
    channel: 'file/content',
    payload: file.id
  })
  const loadedFile = new File()
  loadedFile.id = file.id
  loadedFile.name = file.name
  loadedFile.path = file.path
  loadedFile.loaded = true
  loadedFile.text = result
  store.dispatch(setCurrentFile(loadedFile.id))

  await window.__preload.invoke({
    channel: 'files/lastUsedChanged',
    payload: file.id
  })
}

async function loadFileContent (id: string): Promise<string> {
  const content: string = await window.__preload.invoke({
    channel: 'file/content',
    payload: id
  })
  return content
}

async function loadFiles (): Promise<void> {
  const result: SharedFileList = await window.__preload.invoke({
    channel: 'files/load'
  })

  const files = result.files.map(f => {
    const file: File = {
      id: f.id,
      name: f.name,
      path: f.path,
      loaded: false,
      text: ''
    }
    return file
  })
  store.dispatch(setFiles(files))
  log.debug(`Loaded ${files.length} files`)

  const id = result.lastUsed
  store.dispatch(setCurrentFile(id))
  log.debug(`File ${id} loaded`)
}

function saveFile (): void {
  const state = store.getState()

  if (state !== undefined) {
    const id = state.files.current
    const files = state.files
    if (files !== undefined) {
      if (files.dirty) {
        const text = files.text

        window.__preload.send({
          channel: 'file/save',
          payload: {
            id,
            text
          }
        })

        store.dispatch(cleanDirtyText())
      }
    }
  }
}

function flushFile (): void {
  saveFile()
}

async function closeFile (id: string): Promise<void> {
  await window.__preload.invoke({
    channel: 'file/close',
    payload: {
      id
    }
  })

  await loadFiles()
}

export { initializeFileService, loadFiles, loadFile, loadFileContent, saveFile, flushFile, createNewFile, closeFile }
