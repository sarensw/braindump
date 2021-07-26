import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('__preload', {
  /**
   * Calls the handle method in the electron main process
   * @param {{channel: string, payload: any}} args args
   * @returns result from electron
   */
  invoke: async (args) => {
    const result = await ipcRenderer.invoke(args.channel, args.payload)
    return result
  },
  send: args => {
    ipcRenderer.send(args.channel, args.payload)
  }

  /* loadSettings: async (args) => {
    const result = await ipcRenderer.invoke('loadSettings')
    return result
  },
  saveSettings: async (args) => {
    const result = await ipcRenderer.invoke('saveSettings', args)
    return result
  },
  loadTab: async (args) => {
    const result = await ipcRenderer.invoke('loadTab', args.tab)
    return result
  },
  showOpenDialog: async _ => {
    await ipcRenderer.send('showOpenDialog')
  } */
})
