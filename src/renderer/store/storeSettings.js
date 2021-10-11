import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import log from '../log'

const saveSettings = createAsyncThunk(
  'settings/save',
  async (args, thunkApi) => {
    log.debug(thunkApi.getState().settings.settings)
    window.__preload.invoke({
      channel: 'saveSettings',
      payload: thunkApi.getState().settings.settings
    })
  }
)

export const configSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: {},
    path: null
  },
  reducers: {
    set: (state, action) => {
      state.path = action.payload.path
      state.settings = action.payload.settings
    },
    update: (state, action) => {
      state.settings[action.payload.id] = action.payload.value
    }
  },
  extraReducers: {
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

export const { set, update } = configSlice.actions
export { saveSettings }
export default configSlice.reducer
