import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SerializableHotkey } from '../braindump'

const initialState: SerializableHotkey[] = []

export const hotkeysSlice = createSlice({
  name: 'hotkeys',
  initialState,
  reducers: {
    addHotkeys: (state, action: PayloadAction<SerializableHotkey[]>): void => {
      state.push(...action.payload)
    },
    removeHotkeys: (state, action: PayloadAction<SerializableHotkey[]>): any => {
      return state.filter(hka => action.payload.findIndex(hkb => hka.id === hkb.id) < 0)
    }
  }
})

export const { addHotkeys, removeHotkeys } = hotkeysSlice.actions
export default hotkeysSlice.reducer
