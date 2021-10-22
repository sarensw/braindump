
export interface SharedFile {
  id: string
  name: string
  path: string
}

export interface Dump extends File {
  title: string
}

export interface SharedFileList {
  files: SharedFile[]
  lastUsed: string
}

export interface Settings {
  'app.theme': string
  'editor.minimap.show': boolean
}
