import { SharedFile } from '../../../shared/types'

export class File implements SharedFile {
  id: string
  cluster: string
  name: string
  path: string
  loaded: boolean
  text: string
  isNew: boolean
  viewState: string
  position: {
    line: number
    column: number
  }
}
