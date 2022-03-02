// import hotkeys from 'hotkeys-js'
import * as monaco from 'monaco-editor'
import { Hotkey } from '../braindump'
import { store } from '../store'
import { addHotkeys, removeHotkeys } from '../store/storeHotkeys'
import hotkeys from 'hotkeys-js'

const registry: Hotkey[] = []
let activeHotkey: Hotkey | null = null

hotkeys('*', { keyup: true, keydown: false }, function (event, handler) {
  if (activeHotkey?.release !== undefined) {
    activeHotkey.release('', null)
  }
  activeHotkey = null
})

function runActionForHotkey (key: string, source: string, codeEditor: monaco.editor.IStandaloneCodeEditor | null): void {
  console.log('runActionForHotkey')
  console.log(registry)
  const hotkey = registry.find(hk => hk.key === key)
  console.log(`hotkey found with key: ${String(hotkey?.key)}`)
  if (hotkey === undefined) return
  activeHotkey = hotkey
  hotkey?.action(source, codeEditor)
}

function registerHotkey (hotkey: Hotkey, source: string, codeEditor: monaco.editor.IStandaloneCodeEditor | null): void {
  if (Array.isArray(hotkey.key)) {
    for (const hk of hotkey.key) {
      hotkeys(hk, function (event, handler) {
        event.preventDefault()
        activeHotkey = hotkey
        hotkey.action(source, codeEditor)
      })
    }
  } else {
    hotkeys(hotkey.key, function (event, handler) {
      event.preventDefault()
      activeHotkey = hotkey
      hotkey.action(source, codeEditor)
    })
  }

  registry.push(hotkey)

  const hotkeysToBeAdded = [hotkey].map(({ action, release, ...rest }) => rest)
  store.dispatch(addHotkeys([...hotkeysToBeAdded]))
}

function unregisterHotkey (hotkey: Hotkey): void {
  if (Array.isArray(hotkey.key)) {
    for (const hk of hotkey.key) {
      hotkeys.unbind(hk)
    }
  } else {
    hotkeys.unbind(hotkey.key)
  }

  const i = registry.findIndex(hk => hk.id === hotkey.id)
  registry.splice(i, 1)

  const hotkeysToBeRemoved = [hotkey].map(({ action, release, ...rest }) => rest)
  store.dispatch(removeHotkeys(hotkeysToBeRemoved))
}

export { registerHotkey, unregisterHotkey, runActionForHotkey }
