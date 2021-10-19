import { createSlice } from '@reduxjs/toolkit'
import { colorRegistry } from '../themes/ColorRegistry'
// import pSBC from 'shade-blend-color'
import { registerExtendedColors } from '../themes/colorRegistryExtended'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    type: 'light',
    colors: {},
    tokenColors: {},
    id: null
  },
  reducers: {
    set: (state, action) => {
      // Custom theme can be any vs code theme extension. No customization
      // needed for this to work.
      const customTheme = action.payload.theme
      const themeId = action.payload.id

      // The default theme of vs code
      const defaultTheme = colorRegistry.getColors(customTheme.type)

      // Intermediary theme based on the original default theme + the custom
      // theme. Howeverm there are colors defined in the extended registry
      // that build upon those two. Therefore, the extended colors are
      // calculated now only.
      const intermediaryTheme = { ...defaultTheme, ...customTheme.colors }
      const extendedTheme = registerExtendedColors(customTheme.type, intermediaryTheme)
      // const extendedTheme = intermediaryTheme

      /* const correctedTheme = {}
      const tc = extendedTheme.colors
      if (tc['button.hoverBackground']) {
        correctedTheme['button.hoverBackground'] = tc['button.hoverBackground']
      } else {
        if (customTheme && customTheme.type && customTheme.type === 'dark') {
          correctedTheme['button.hoverBackground'] = pSBC(-0.2, tc['button.background'])
        } else {
          correctedTheme['button.hoverBackground'] = pSBC(0.2, tc['button.background'])
        }
      } */

      // Finally, the custom theme colors have to be applied again. There are colors
      // in the extended color registry that require the intermediary theme color.
      // Example: editor.background
      // And there are colors that have a fix value in the extended color registry
      // that would override the intermediatry color again.
      // Example: STATUS_BAR_WARNING_ITEM_FOREGROUND
      const finalTheme = {
        ...extendedTheme,
        ...customTheme.colors
        /* , ...tc */
      }

      state.type = customTheme.type
      state.colors = finalTheme
      state.tokenColors = customTheme.tokenColors
      state.id = themeId
    }
  }
})

export const { set } = themeSlice.actions
export default themeSlice.reducer
