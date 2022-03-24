import { createSlice } from '@reduxjs/toolkit'
import { ITheme } from '../themes/ITheme'
import { Light, Dark } from '../themes/themeLoader'

const arg = true

const initialState: { id: string, colors: ITheme } = {
  id: 'light',
  colors: arg ? Light : Dark
}

export const newThemeSlice = createSlice({
  name: 'themeNew',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.id = action.payload.id
      state.colors = action.payload.theme
    }
  }
})

export const { setTheme } = newThemeSlice.actions
export default newThemeSlice.reducer
