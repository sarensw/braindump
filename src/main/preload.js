import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('__preload', {
  save: async (args) => {
    await ipcRenderer.send('save', args)
  },
  load: async (args) => {
    console.log('asking to load')
    const result = await ipcRenderer.send('load', { fileName: args.fileName })

    ipcRenderer.on('loaded', (event, arg) => {
      console.log('text loaded')
      console.log(arg)
      args.textLoaded(arg)
    })

    return result
  }
})
