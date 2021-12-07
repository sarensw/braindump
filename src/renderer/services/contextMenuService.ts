import { toggle } from '../store/storeSettings'
import { set as setPage } from '../store/storeApp'
import { store } from '../store'
import { saveSettings } from './settingsService'

function initializeContextMenus (): void {
  window.__preload.receive('context-menu-command', (commandId: string) => {
    let command: any | null = null
    const templates = getAllContextMenus()
    for (const key in templates) {
      const template = templates[key]
      for (const item of template) {
        console.log(item.id)
        if (item.id !== null && item.id === commandId) command = item
        if (item.submenu !== undefined) {
          for (const submenuItem of item.submenu) {
            console.log(submenuItem.id)
            if (submenuItem.id === commandId) command = submenuItem
          }
        }
      }
    }
    console.log(command)
    if (command !== null) command.click()
  })
}

function getAllContextMenus (): any {
  return {
    appContext: getAppContextMenu()
  }
}

function getAppContextMenu (): any {
  const settings = store.getState().settings
  const menu = [
    {
      id: 'menu-editor-minimap',
      label: 'Show Minimap',
      type: 'checkbox',
      checked: settings['editor.minimap.show'],
      click: async () => {
        store.dispatch(toggle({ id: 'editor.minimap.show' }))
        await saveSettings()
      }
    },
    {
      id: 'menu-editor-linenumbers',
      label: 'Show Line Numbers',
      type: 'checkbox',
      checked: settings['editor.linenumbers.show'],
      click: async () => {
        store.dispatch(toggle({ id: 'editor.linenumbers.show' }))
        await saveSettings()
      }
    },
    {
      id: 'menu-editor-wordwrap',
      label: 'Word Wrap',
      type: 'checkbox',
      checked: settings['editor.wordwrap'],
      click: async () => {
        store.dispatch(toggle({ id: 'editor.wordwrap' }))
        await saveSettings()
      }
    },
    { type: 'separator' },
    {
      id: 'menu-editor-snippets',
      label: 'Configure Snippets',
      click: async () => {
        store.dispatch(setPage('snippets'))
        await saveSettings()
      }
    },
    { type: 'separator' },
    {
      label: 'Theme',
      submenu: [
        {
          id: 'theme-braindump-light',
          label: 'Braindump Light',
          type: 'checkbox',
          checked: true
        }
      ]
    }
  ]
  return menu
}

function getMenuTemplate (templateId: string): any {
  console.log(templateId)
  if (templateId === 'appContext') {
    const template = JSON.parse(JSON.stringify(getAppContextMenu()))
    return template
  }

  const template = JSON.parse(JSON.stringify(getAllContextMenus()))
  return template
}

export { initializeContextMenus, getMenuTemplate }