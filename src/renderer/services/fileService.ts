import log from '../log'
import { store } from '../store'
import { File } from '../store/files/file'
import { setFiles, closeFile as closeFileInStore, setCurrentFile, cleanDirtyText, setCount, addFile, setName } from '../store/storeFiles'
import { randomString } from './utilitiesService'
import { v4 as uuidv4 } from 'uuid'

const id = randomString(4)
const timerInterval = 2000

const PATH_FILE_FILES: string = 'files.json'

function initializeFileService (): void {
  log.debug('initializing the dump service', id)
  setInterval(saveFile, timerInterval)
  log.debug(`started timer in an interval of ${timerInterval}ms`, id)
}

async function createNewFile (): Promise<void> {
  let state = store.getState()
  const files = state.files
  const counter = files.count + 1

  // create a new dump
  const newFileName = `dump_${counter}_${Date.now()}`
  const newFileId = uuidv4()

  const file: File = {
    id: newFileId,
    name: `<dump ${counter}>`,
    path: newFileName,
    loaded: false,
    text: `<dump ${counter}> // <- change the title here`
  }

  window.__preload.send({
    channel: 'file/write',
    payload: {
      path: file.path,
      text: file.text
    }
  })

  store.dispatch(addFile(file))
  log.debug(`Added ${file.id} to files`)

  store.dispatch(setCurrentFile(file.id))
  log.debug(`File ${file.id} loaded`)

  store.dispatch(setCount(counter))
  log.debug(`File count set to ${counter}`)

  state = store.getState()
  const newFiles = {
    files: state.files.files,
    lastUsed: state.files.current,
    count: state.files.count
  }

  window.__preload.send({
    channel: 'file/write',
    payload: {
      path: PATH_FILE_FILES,
      text: JSON.stringify(newFiles, null, 2)
    }
  })
}

async function setFileName (path: string, name: string): Promise<void> {
  store.dispatch(setName({
    path,
    name
  }))

  const state = store.getState()
  if (state.files.files === null) return
  const newFiles = {
    lastUsed: state.files.current,
    files: state.files.files,
    count: state.files.count
  }
  window.__preload.send({
    channel: 'file/write',
    payload: {
      path: PATH_FILE_FILES,
      text: JSON.stringify(newFiles, null, 2)
    }
  })
}

async function readFile (path: string): Promise<string> {
  const content: string = await window.__preload.invoke({
    channel: 'file/read',
    payload: {
      path
    }
  })
  return content
}

async function loadFiles (): Promise<void> {
  const filesRaw: string = await window.__preload.invoke({
    channel: 'file/read',
    payload: {
      path: PATH_FILE_FILES
    }
  })

  if (filesRaw === null) {
    log.debug(`no ${PATH_FILE_FILES} file existing yet. Creating the default`)

    // create a new dump
    const newFileName = `dump_0_${Date.now()}`
    const newFileId = uuidv4()
    window.__preload.send({
      channel: 'file/write',
      payload: {
        path: newFileName,
        text: '# Welcome to Braindump'
      }
    })
    const files = {
      files: [
        {
          id: newFileId,
          name: 'dump 0',
          path: newFileName
        }
      ],
      lastUsed: newFileId,
      count: 1
    }

    window.__preload.send({
      channel: 'file/write',
      payload: {
        path: PATH_FILE_FILES,
        text: JSON.stringify(files, null, 2)
      }
    })

    store.dispatch(setFiles(files.files as File[]))
    log.debug(`Loaded ${files.files.length} files`)

    store.dispatch(setCurrentFile(newFileId))
    log.debug(`File ${newFileId} loaded`)

    store.dispatch(setCount(1))
    log.debug('File count set to 1')
  } else {
    const files = JSON.parse(filesRaw)

    store.dispatch(setFiles(files.files as File[]))
    log.debug(`Loaded ${(files.files as File[]).length} files`)

    store.dispatch(setCurrentFile(files.lastUsed))
    log.debug(`File ${files.lastUsed as number} loaded`)

    store.dispatch(setCount(files.count as number))
    log.debug(`File count set to ${files.count as number}`)
  }
}

function saveFile (): void {
  const state = store.getState()

  if (state !== undefined) {
    const id = state.files.current
    const file = state.files.files?.find(f => f.id === id)

    if (state.files.dirty && file !== null) {
      window.__preload.send({
        channel: 'file/write',
        payload: {
          path: file?.path,
          text: state.files.text
        }
      })

      store.dispatch(cleanDirtyText())
    }
  }
}

function flushFile (): void {
  saveFile()
}

async function closeFile (id: string): Promise<void> {
  let state = store.getState()
  const files = state.files.files

  log.debug(`current number of files is ${state.files?.count}`)
  if (files?.length === 1) {
    await createNewFile()
  }

  store.dispatch(closeFileInStore(id))
  log.debug(`new number of files is ${state.files?.count}`)

  state = store.getState()
  const newFiles = {
    files: state.files.files,
    lastUsed: state.files.current,
    count: state.files.count
  }

  window.__preload.send({
    channel: 'file/write',
    payload: {
      path: PATH_FILE_FILES,
      text: JSON.stringify(newFiles, null, 2)
    }
  })
}

export { initializeFileService, loadFiles, saveFile, flushFile, createNewFile, closeFile, readFile, setFileName }
