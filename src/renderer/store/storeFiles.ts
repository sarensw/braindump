import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SharedFile } from '../../shared/types'
import type { Positionable } from '../common/cursorPosition'
import { File } from './files/file'

interface SerializableFile extends SharedFile {
  loaded: boolean
  text: string
  position: Positionable
}

interface FilesState {
  current: string | null
  files: SerializableFile[] | null
  count: number
  text: string
  dirty: boolean
}

interface FileNameUpdate {
  path: string
  name: string
}

const initialState: FilesState = {
  current: null,
  files: null,
  count: -1,
  text: '',
  dirty: false
}

export const filesSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload
    },
    addFile: (state, action: PayloadAction<File>) => {
      state.files?.push(action.payload)
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
    setName: (state, action: PayloadAction<FileNameUpdate>) => {
      if (state.files === null) return
      let name = action.payload.name
      const regex = new RegExp(/#* *([<>.,;:'"\w ]*) *(\/{2,})?/g)
      const match = regex.exec(name)
      if (match !== null) {
        name = match[1]
      }
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
      state.dirty = false
    },
    setLastCursorPosition: (state, action: PayloadAction<Positionable>) => {
      const i = state.files?.findIndex(f => f.id === state.current)
      if (i !== undefined && state.files !== null) {
        state.files[i].position = action.payload
      }
    }
  }
})

export const { setFiles, addFile, closeFile, setName, setCurrentFile, setCount, increaseCount, setDirtyText, cleanDirtyText, setLastCursorPosition } = filesSlice.actions
export default filesSlice.reducer
