import * as monaco from 'monaco-editor'

type HotkeyAction = (source: string, codeEditor: monaco.editor.IStandaloneCodeEditor | null) => boolean

interface Hotkey {
  id: string
  key: string | string[]
  description: string
  action: HotkeyAction
  release?: HotkeyAction
}

interface SerializableHotkey {
  id: string
  key: string | string[]
  description: string
}

interface Settings {
  'app.theme': string
  'app.hotkeys.show': boolean
  'backup.enabled': boolean
  'backup.path': string
  'editor.minimap.show': boolean
  'editor.linenumbers.show': boolean
  'editor.wordwrap': boolean
  'editor.mode': string
  'tabs.show': boolean
  'presentation.title.subTitle': string
  'pro.licenseKey': string
}

interface Snippet {
  name: string
  description: string
  body: string
}

export interface SharedFile {
  id: string
  cluster: string
  name: string
  path: string
}
