import * as monaco from 'monaco-editor'

interface HotkeyAction {
  (source: string, codeEditor: monaco.editor.IStandaloneCodeEditor | null): boolean
}

interface Hotkey {
  id: string
  key: string | string[]
  description: string
  action: HotkeyAction
}

interface SerializableHotkey {
  id: string
  key: string | string[]
  description: string
}
