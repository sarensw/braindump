import { createSlice } from '@reduxjs/toolkit'
import { ITheme } from '../themes/ITheme'
import { Light } from '../themes/themeLoader'

const initialState: { id: string, colors: ITheme } = {
  id: 'light',
  colors: Light
}

export const newThemeSlice = createSlice({
  name: 'themeNew',
  initialState,
  reducers: {
    setTheme: (state, action) => {

    }
  }
})

export const { setTheme } = newThemeSlice.actions
export default newThemeSlice.reducer
