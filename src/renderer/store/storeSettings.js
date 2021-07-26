import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import log from '../log'

const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async (args, thunkApi) => {
    const result = await window.__preload.loadSettings()
    return result
  }
)

const saveSettings = createAsyncThunk(
  'settings/save',
  async (args, thunkApi) => {
    window.__preload.saveSettings(args)
  }
)

export const configSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: {},
    path: null
  },
  reducers: {
  },
  extraReducers: {
    [loadSettings.fulfilled]: (state, action) => {
      log.debug('loadSettings.fulfilled')
      log.debug(action)
      state.path = action.payload.path
      state.settings = action.payload.settings
    },
    [loadSettings.rejected]: (state, action) => {
      log.debug('loadSettings.rejected')
      log.debug(action)
    },
    [loadSettings.pending]: (state, action) => {
      log.debug('loadSettings.pending')
      log.debug(action)
    },
    [saveSettings.fulfilled]: (state, action) => {
      log.debug('saveSettings.fulfilled')
      log.debug(action)
    },
    [saveSettings.rejected]: (state, action) => {
      log.debug('saveSettings.rejected')
      log.debug(action)
    },
    [saveSettings.pending]: (state, action) => {
      log.debug('saveSettings.pending')
      log.debug(action)
    }
  }
})

// export const {} = settingsSlice.actions
export { loadSettings, saveSettings }
export default configSlice.reducer
