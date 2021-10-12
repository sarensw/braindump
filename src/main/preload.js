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
  },
  receive: (channel, func) => {
    const validChannels = ['shortcut']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  removeEventListener: (channel) => {
    try {
      console.log(`Remove listener for ${channel}`)
      ipcRenderer.removeAllListeners(channel)
    } catch (err) {
      // silent catch
    }
  }
})
