import log from '../log'
import { emit } from '../events'
import { createNewFile, loadFiles } from './fileService'

const shortcuts = [
  {
    id: 'shortcut.dumps.new',
    keys: 'CmdOrCtrl+Alt+N',
    action: async () => {
      window.__preload.send({
        channel: 'showMainWindow',
        payload: ''
      })
      await createNewFile()
      await loadFiles()
      emit('event.editor.focus')
    }
  },
  {
    id: 'shortcut.app.appear',
    keys: 'CmdOrCtrl+Alt+.',
    action: () => {
      window.__preload.send({
        channel: 'showMainWindow',
        payload: ''
      })
      emit('event.editor.focus')
    }
  }
]

function registerShortcuts (): void {
  window.__preload.removeEventListener('shortcut')
  window.__preload.send({
    channel: 'registerShortcuts',
    payload: shortcuts.map(s => {
      return {
        id: s.id,
        keys: s.keys
      }
    })
  })
  window.__preload.receive('shortcut', (data: any) => {
    for (const shortcut of shortcuts) {
      if (shortcut.id === data) {
        log.debug(`shortcut ${shortcut.id} received`)
        if (shortcut.action !== undefined && shortcut.action !== null) {
          shortcut.action()
        }
      }
    }
  })

  log.debug('shortcuts registered')
}

export default registerShortcuts
