import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SharedFile } from '../../shared/types'
import type { Positionable } from '../common/cursorPosition'
import { File } from './files/file'

interface SerializableFile extends SharedFile {
  loaded: boolean
  text: string
  isNew: boolean
  position: Positionable
}

interface FilesState {
  current: string | null
  files: SerializableFile[] | null
  filesSize: number
  filesSearch: string
  count: number
  text: string
  dirty: boolean
  shareFile: SharedFile | null
}

interface FileNameUpdate {
  path: string
  name: string
}

interface FileClusterUpdate {
  path: string
  cluster: string
}

const initialState: FilesState = {
  current: null,
  files: null,
  filesSize: 0,
  filesSearch: '',
  count: -1,
  text: '',
  dirty: false,
  shareFile: null
}

export const filesSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload
    },
    addFile: (state, action: PayloadAction<File>) => {
      state.files?.splice(0, 0, action.payload)
    },
    closeFile: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (id === state.current) {
        const i = state.files === null ? 0 : state.files?.findIndex(f => f.id === id)

        const files = state.files === null ? [] : state.files
        const length = files.length
        // [0, 1, 2, 3, 4] -> length 5, delete index 4
        if (i === length - 1) {
          // 4 === 5-1
          // 3
          state.current = files[i - 1].id
        } else {
          // 2
          state.current = files[i + 1].id
        }
      }

      const newFiles = state.files === null ? null : state.files?.filter(f => f.id !== action.payload)

      state.files = newFiles
    },
    setCluster: (state, action: PayloadAction<FileClusterUpdate>) => {
      if (state.files === null) return
      const cluster = action.payload.cluster
      const i = state.files.findIndex(f => f.path === action.payload.path)
      state.files[i].cluster = cluster
    },
    setName: (state, action: PayloadAction<FileNameUpdate>) => {
      if (state.files === null) return
      const name = action.payload.name
      const i = state.files.findIndex(f => f.path === action.payload.path)
      state.files[i].name = name
    },
    setCurrentFile: (state, action: PayloadAction<string>) => {
      state.current = action.payload
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload
    },
    increaseCount: (state) => {
      state.count++
    },
    setDirtyText: (state, action) => {
      state.text = action.payload
      state.dirty = true
    },
    cleanDirtyText: (state) => {
      if (state === null) return

      state.dirty = false

      if (state.files === null || state.files === undefined) return

      const i = state.files.findIndex(f => f.id === state.current)
      state.files[i].isNew = false
    },
    setLastCursorPosition: (state, action: PayloadAction<Positionable>) => {
      const i = state.files?.findIndex(f => f.id === state.current)
      if (i !== undefined && state.files !== null) {
        state.files[i].position = action.payload
      }
    },
    moveFileUp: (state) => {
      if (state === null || state.files === null || state.files === undefined) return

      const i = state.files.findIndex(f => f.id === state.current)
      const file = state.files[i]

      if (i <= 0) return

      const result = state.files

      if (result[i - 1].cluster !== file.cluster) {
        // when the previous file has a different cluster, just change the cluster,
        // but not the order
        state.files[i].cluster = result[i - 1].cluster
      } else {
        // the cluster of the previous file is the same, so just skip
        result[i] = result[i - 1]
        result[i - 1] = file
        state.files = result
      }
    },
    moveFileDown: (state) => {
      if (state === null || state.files === null || state.files === undefined) return

      const i = state.files.findIndex(f => f.id === state.current)
      const file = state.files[i]

      if (i >= state.files.length - 1) return

      const result = state.files

      if (result[i + 1].cluster !== file.cluster) {
        state.files[i].cluster = result[i + 1].cluster
      } else {
        result[i] = result[i + 1]
        result[i + 1] = file
        state.files = result
      }
    },
    setFilesSearch: (state, action: PayloadAction<string>) => {
      state.filesSearch = action.payload
    },
    setShareFile: (state, action: PayloadAction<SharedFile>) => {
      state.shareFile = action.payload
    }
  }
})

export const { setFiles, addFile, closeFile, setCluster, setName, setCurrentFile, setCount, increaseCount, setDirtyText, cleanDirtyText, setLastCursorPosition, moveFileUp, moveFileDown, setFilesSearch, setShareFile } = filesSlice.actions
export default filesSlice.reducer
