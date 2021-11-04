import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SharedFile } from '../../shared/types'
import { File } from './files/file'

interface SerializableFile extends SharedFile {
  loaded: boolean
  text: string
}

interface FilesState {
  current: string | null
  files: SerializableFile[] | null
  count: number
  text: string
  dirty: boolean
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
    }
  }
})

export const { setFiles, addFile, closeFile, setCurrentFile, setCount, increaseCount, setDirtyText, cleanDirtyText } = filesSlice.actions
export default filesSlice.reducer
