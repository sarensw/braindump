import log from '../log'
import store from '../store'
import { setCurrentTab } from '../store/storeTabs'
import { emit } from '../events'

const shortcuts = [
  {
    id: 'shortcut.dumps.new',
    keys: 'CmdOrCtrl+Alt+N',
    action: () => {
      window.__preload.send({
        channel: 'showMainWindow',
        payload: ''
      })
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      store.dispatch(setCurrentTab(null))
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
        console.log(`shortcut ${shortcut.id} received`)
        log.debug(`shortcut ${shortcut.id} received`)
        if (shortcut.action !== undefined && shortcut.action !== null) {
          shortcut.action()
        }
      }
    }
  })

  log.debug('shortcuts registered')
  console.log('shortcuts registered')
}

export default registerShortcuts
