
export interface SharedFile {
  id: string
  name: string
  path: string
}

export interface Dump extends File {
  title: string
}

export interface Settings {
  'app.theme': string
  'editor.minimap.show': boolean
  'editor.linenumbers.show': boolean
  'editor.wordwrap': boolean
}

export interface Snippet {
  name: string
  description: string
  body: string
}
