import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import log from '../log'
import { store } from '../store'

interface SearchResult {
  id: string
  score: number
  indexes: number[]
  target: string
  path: string
  lnr: number
  name: string
}

const fuzzySearch = createAsyncThunk(
  'search/fuzzy',
  async (what: string, thunkApi) => {
    log.debug('thunk for search created')
    const files = store.getState().files.files
    let result: SearchResult[] = await window.__preload.invoke({
      channel: 'search/fuzzy',
      payload: {
        files: files?.map(file => {
          return {
            path: file.path,
            id: file.id
          }
        }),
        what
      }
    })

    const getNameFromPath = (path: string): string => {
      const files = store.getState().files.files
      if (files == null) return ''
      const name = files.find(file => file.path === path)?.name
      return name ?? ''
    }

    result = result.map(item => {
      return {
        ...item,
        name: getNameFromPath(item.path)
      }
    })

    return result
  }
)

interface SearchState {
  fuzzy: SearchResult[]
}

const initialState: SearchState = {
  fuzzy: []
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fuzzySearch.rejected, (state, action) => {
      log.debug('search failed')
      log.error(action)
    })
    builder.addCase(fuzzySearch.fulfilled, (state, action) => {
      log.debug('search finished')
      state.fuzzy = action.payload
    })
  }
})

export { fuzzySearch }
export default searchSlice.reducer
