import log from '../log'
import { store } from '../store'
import { File } from '../store/files/file'
import { setFiles, closeFile as closeFileInStore, setCurrentFile, cleanDirtyText, setCount, addFile, setName, moveFileUp, moveFileDown, setCluster } from '../store/storeFiles'
import { randomString } from './utilitiesService'
import { v4 as uuidv4 } from 'uuid'
import dateFormat from 'dateformat'
import { Direction } from '../common/direction'
import StackTrace from 'stacktrace-js'
import { FileServiceMoveResult } from '../braindump.d'

const id = randomString(4)
const saveTimerInterval = 2000
const backupTimerInterval = 1000 * 60 * 10 // 10 minute default backup interval

const PATH_FILE_FILES: string = 'files.json'
const PATH_FILE_SNIPPETS: string = 'snippets.yaml'

function initializeFileService (): void {
  log.debug('initializing the dump service', id)

  setInterval(saveFile, saveTimerInterval)
  log.debug(`started timer in an interval of ${saveTimerInterval}ms`, id)

  setInterval(backup, backupTimerInterval)
  log.debug(`started timer in an interval of ${backupTimerInterval}ms`, id)
}

function saveFilesFile (payload: any): void {
  if (payload.files === null || payload.lastUsed === null || payload.count === -1) {
    const st = StackTrace.getSync()
    log.error('invalid files.json about to be created')
    log.error(st)
    return
  }

  window.__preload.send({
    channel: 'file/write',
    payload: {
      path: PATH_FILE_FILES,
      text: JSON.stringify(payload, null, 2)
    }
  })
}

async function calculateOverallFileSizes (): Promise<number> {
  const files = store.getState().files.files

  if (files === undefined || files === null) return 0

  let size = 0
  for (const file of files) {
    const fileSize: number = await window.__preload.invoke({
      channel: 'file/size',
      payload: {
        path: file.path
      }
    })
    size += fileSize
  }

  return size
}

async function createNewFile (): Promise<void> {
  let state = store.getState()
  const files = state.files
  const counter = files.count + 1

  // create a new dump
  const newFilePath = `dump_${counter}_${Date.now()}`
  const currentDateTime = dateFormat(new Date(), 'yyyy-mm-dd_HH:MM:ss')
  const newFileName = `${currentDateTime} (dump ${counter})`
  const newFileId = uuidv4()

  const file: File = {
    id: newFileId,
    cluster: '',
    name: newFileName,
    path: newFilePath,
    loaded: false,
    text: '',
    isNew: true,
    position: {
      line: 0,
      column: 0
    },
    viewState: ''
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

  store.dispatch(setCurrentFile({
    id: file.id
  }))
  log.debug(`File ${file.id} loaded`)

  store.dispatch(setCount(counter))
  log.debug(`File count set to ${counter}`)

  state = store.getState()
  const newFiles = {
    files: state.files.files,
    lastUsed: state.files.current == null ? null : state.files.current.id,
    count: state.files.count
  }

  saveFilesFile(newFiles)
}

async function setLastUsedFile (id: string): Promise<void> {
  log.debug(`about to set the last used file to ${id}`)

  // TODO why do I set the current file ID here? This
  //      causes a rerender and reload in the editor
  store.dispatch(setCurrentFile({
    id
  }))

  const state = store.getState()
  if (state.files.files === null) return
  const newFiles = {
    files: state.files.files,
    lastUsed: state.files.current,
    count: state.files.count
  }
  saveFilesFile(newFiles)
}

async function setClusterName (path: string, cluster: string): Promise<void> {
  if (cluster === undefined) return

  // update the store to make sure the correct cluster name is
  // in the serialized file
  store.dispatch(setCluster({
    path,
    cluster
  }))

  // get the store
  const state = store.getState()
  if (state.files.files === null) return

  // detach, so we can do the operations first
  const files = [...state.files.files]

  // get the index and file for the given path
  const currentIndex = files.findIndex(f => f.path === path)
  const currentFile = files[currentIndex]

  // in any way, delete the current file from the list to place it
  // at the right position afterwards
  files.splice(currentIndex, 1)

  // if the cluster name is now empty, just move it to the top
  // of the unclustered list
  if (cluster === '') {
    files.unshift(currentFile)
  }

  // find the new place
  let addedToCluster = false
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.cluster === cluster) {
      files.splice(i, 0, currentFile)
      addedToCluster = true
      break
    }
  }

  // if there wasn't any cluster, then this would not be added
  // again after it was removed -> add it to the end as a new cluster
  // then
  if (!addedToCluster) {
    files.push(currentFile)
  }

  // distribute the changes to the store
  store.dispatch(setFiles(files))

  // persist this now
  persist()
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
  saveFilesFile(newFiles)
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

    saveFilesFile(files)

    store.dispatch(setFiles(files.files as File[]))
    log.debug(`Loaded ${files.files.length} files`)

    store.dispatch(setCurrentFile({
      id: newFileId
    }))
    log.debug(`File ${newFileId} loaded`)

    store.dispatch(setCount(1))
    log.debug('File count set to 1')
  } else {
    const files = JSON.parse(filesRaw)

    store.dispatch(setFiles(files.files as File[]))
    log.debug(`Loaded ${(files.files as File[]).length} files`)

    if (typeof files.lastUsed === 'string') {
      // check for string for backward compatibility
      store.dispatch(setCurrentFile({
        id: files.lastUsed
      }))
    } else if (typeof files.lastUsed === 'object') {
      // now, the last current file might be stored as an object
      store.dispatch(setCurrentFile(files.lastUsed))
    }
    log.debug(`File ${String(files.lastUsed)} loaded`)

    store.dispatch(setCount(files.count as number))
    log.debug(`File count set to ${files.count as number}`)
  }
}

function saveFileContent (path: string, text: string): void {
  window.__preload.send({
    channel: 'file/write',
    payload: {
      path,
      text
    }
  })
}

function saveFile (): void {
  const state = store.getState()

  if (state == null) return
  if (state.files.current == null) return

  const id = state.files.current.id
  const file = state.files.files?.find(f => f.id === id)

  if (state.files.dirty && file !== undefined && file?.path !== undefined) {
    saveFileContent(file?.path, state.files.text)

    store.dispatch(cleanDirtyText())

    persist()
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

  saveFilesFile(newFiles)
}

function getViewState (id: string | null): string | null {
  if (id === null) return null

  log.debug(`get view state for file ${id}`)
  const state = store.getState()
  if (state !== undefined) {
    const file = state.files.files?.find(f => f.id === id)

    if (file?.viewState !== undefined && file?.viewState !== '') {
      return file.viewState
    }
  }
  return null
}

function moveFile (direction: Direction): void {
  switch (direction) {
    case Direction.Up:
      store.dispatch(moveFileUp())
      break
    case Direction.Down:
      store.dispatch(moveFileDown())
      break
    case Direction.Left:
    case Direction.Right:
      break
  }
  persist()
}

function persist (): void {
  log.debug('persisting files')
  const state = store.getState()

  // log.debug({
  //   files: state.files.files,
  //   lastUsed: state.files.current,
  //   count: state.files.count
  // })

  const newFiles = {
    files: state.files.files,
    lastUsed: state.files.current,
    count: state.files.count
  }

  saveFilesFile(newFiles)
}

async function isPathValid (path: string): Promise<boolean> {
  try {
    const isValid = window.__preload.invoke({
      channel: 'file/valid',
      payload: {
        path
      }
    })
    return isValid
  } catch (err) {
    return false
  }
}

function backup (): void {
  const settings = store.getState().settings

  if (!settings['backup.enabled']) return

  const files = store.getState().files.files
  const filePaths = files?.map(f => f.path)

  if (filePaths === undefined) return

  const backupFileName = `Braindump_backup_${dateFormat(Date.now(), 'yyyymmddHHMMss')}.zip`

  log.debug(`Starting backup ${settings['backup.path']}/${backupFileName}`)
  log.debug(`Backing up ${filePaths.length} files + ${PATH_FILE_FILES} + ${PATH_FILE_SNIPPETS}`)

  if (filePaths !== undefined) {
    window.__preload.send({
      channel: 'file/compress',
      payload: {
        filePaths: [
          PATH_FILE_FILES,
          PATH_FILE_SNIPPETS,
          ...filePaths
        ],
        targetPath: settings['backup.path'] + `/${backupFileName}`
      }
    })
  }
}

async function moveUserDataDirectory (newPath: string): Promise<string | null> {
  const state = store.getState()
  const files = state.files.files

  let filePaths = files?.map(file => file.path)
  if (filePaths === undefined) filePaths = []

  const result: FileServiceMoveResult = await window.__preload.invoke({
    channel: 'file/move',
    payload: {
      filePaths: [
        ...filePaths
      ],
      targetPath: newPath
    }
  })

  switch (result) {
    case FileServiceMoveResult.Successful:
      return null
    case FileServiceMoveResult.FailedInvalidPath:
      return 'Invalid path'
    case FileServiceMoveResult.FailedCopy:
      return 'Could not move at least one file. Check that the target directory has write accesss.'
    default:
      return 'Return code not handled'
  }
}

export { initializeFileService, loadFiles, saveFileContent, saveFile, flushFile, createNewFile, closeFile, readFile, setClusterName, setFileName, setLastUsedFile, getViewState, moveFile, persist, calculateOverallFileSizes, isPathValid, backup, moveUserDataDirectory }
