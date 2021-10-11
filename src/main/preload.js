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
})
