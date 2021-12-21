import { createSlice } from '@reduxjs/toolkit'
import { Settings } from '../../shared/types'
import SettingsStructure from '../settings/settings.json'

function getDefaultValue<T> (id: string): T | null {
  for (const category of SettingsStructure) {
    for (const setting of category.settings) {
      if (setting.id === id) {
        return setting.default as unknown as T
      }
    }
  }

  return null
}

const initialState: Settings = {
  'app.theme': getDefaultValue<string>('app.theme') ?? '',
  'backup.enabled': getDefaultValue<boolean>('backup.enabled') ?? false,
  'backup.path': getDefaultValue<string>('backup.path') ?? '',
  'editor.minimap.show': getDefaultValue<boolean>('editor.minimap.show') ?? false,
  'editor.linenumbers.show': getDefaultValue<boolean>('editor.linenumber.show') ?? true,
  'editor.wordwrap': getDefaultValue<boolean>('editor.wordwrap') ?? true,
  'tabs.show': getDefaultValue<boolean>('tabs.show') ?? true
}

export const configSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    set: (state, action) => {
      return {
        ...initialState,
        ...action.payload
      }
    },
    update: (state: Settings, action) => {
      state[action.payload.id] = action.payload.value
    },
    toggle: (state: Settings, action) => {
      if (typeof state[action.payload.id] === 'boolean') {
        if (state[action.payload.id] === true) {
          state[action.payload.id] = false
        } else {
          state[action.payload.id] = true
        }
      }
    }
  }
})

export const { set, update, toggle } = configSlice.actions
export default configSlice.reducer
