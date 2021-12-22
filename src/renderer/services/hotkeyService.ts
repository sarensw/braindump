// import hotkeys from 'hotkeys-js'
import * as monaco from 'monaco-editor'
import { Hotkey } from '../braindump'
import { store } from '../store'
import { addHotkeys, removeHotkeys } from '../store/storeHotkeys'

const registry: Hotkey[] = []

function registerHotkey (hotkey: Hotkey, source: string, codeEditor: monaco.editor.IStandaloneCodeEditor | null): void {
  // hotkeys(hotkey.key, function (event, handler) {
  //   event.preventDefault()
  //   hotkey.action(source, codeEditor)
  // })
  registry.push(hotkey)
  store.dispatch(addHotkeys([hotkey]))
}

function unregisterHotkey (hotkey: Hotkey): void {
  // hotkeys.unbind(hotkey.key)
  const i = registry.findIndex(hk => hk.id === hotkey.id)
  registry.splice(i, 1)

  store.dispatch(removeHotkeys([hotkey]))
}

export { registerHotkey, unregisterHotkey }
