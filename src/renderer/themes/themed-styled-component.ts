// themed-styled-component.ts
// tslint:disable:no-duplicate-imports
import * as styledComponents from 'styled-components'
import { ThemedStyledComponentsModule } from 'styled-components'
import { ITheme } from './ITheme'

const {
  default: styled,
  css,
  keyframes,
  ThemeProvider
  // ... etc
} = (styledComponents as any as ThemedStyledComponentsModule<ITheme>)

export { css, keyframes, ThemeProvider }
export default styled
