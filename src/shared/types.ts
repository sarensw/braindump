
export interface SharedFile {
  id: string
  cluster: string
  name: string
  path: string
}

export interface Dump extends File {
  title: string
}

export interface Settings {
  'app.theme': string
  'backup.enabled': boolean
  'backup.path': string
  'editor.minimap.show': boolean
  'editor.linenumbers.show': boolean
  'editor.wordwrap': boolean
  'tabs.show': boolean
}

export interface Snippet {
  name: string
  description: string
  body: string
}
