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
  text: string
  dirty: boolean
}

const initialState: FilesState = {
  current: null,
  files: null,
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
    setCurrentFile: (state, action: PayloadAction<string>) => {
      state.current = action.payload
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

export const { setFiles, setCurrentFile, setDirtyText, cleanDirtyText } = filesSlice.actions
export default filesSlice.reducer
