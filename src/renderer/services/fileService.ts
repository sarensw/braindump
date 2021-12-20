import log from '../log'
import { store } from '../store'
import { File } from '../store/files/file'
import { setFiles, closeFile as closeFileInStore, setCurrentFile, cleanDirtyText, setCount, addFile, setName, moveFileUp, moveFileDown, setCluster } from '../store/storeFiles'
import { randomString } from './utilitiesService'
import { v4 as uuidv4 } from 'uuid'
import { CursorPosition } from '../common/cursorPosition'
import dateFormat from 'dateformat'
import { Direction } from '../common/direction'

const id = randomString(4)
const timerInterval = 2000

const PATH_FILE_FILES: string = 'files.json'

function initializeFileService (): void {
  log.debug('initializing the dump service', id)
  setInterval(saveFile, timerInterval)
  log.debug(`started timer in an interval of ${timerInterval}ms`, id)
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
    }
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

async function setLastUsedFile (id: string): Promise<void> {
  store.dispatch(setCurrentFile(id))

  const state = store.getState()
  if (state.files.files === null) return
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

      persist()
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

function getCursorPosition (id: string | null): CursorPosition {
  if (id === null) return new CursorPosition(0, 0)

  log.debug(`get cursor position for file ${id}`)
  const state = store.getState()
  if (state !== undefined) {
    const file = state.files.files?.find(f => f.id === id)

    if (file?.position !== undefined) {
      return file.position
    }
  }
  return new CursorPosition(0, 0)
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
  const state = store.getState()

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

export { initializeFileService, loadFiles, saveFile, flushFile, createNewFile, closeFile, readFile, setClusterName, setFileName, setLastUsedFile, getCursorPosition, moveFile, persist, calculateOverallFileSizes }
