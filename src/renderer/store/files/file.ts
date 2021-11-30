import { SharedFile } from '../../../shared/types'

export class File implements SharedFile {
  id: string
  name: string
  path: string
  loaded: boolean
  text: string
  position: {
    line: number
    column: number
  }
}
