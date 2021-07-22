import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('__preload', {
  log: async (args) => {
    await ipcRenderer.send('log', args)
  },
  save: async (args) => {
    await ipcRenderer.send('save', args)
  },
  /* load: async (args) => {
    console.log('asking to load')
    const result = await ipcRenderer.send('load', { fileName: args.fileName })

    ipcRenderer.on('loaded', (event, arg) => {
      args.textLoaded(arg)
    })

    return result
  }, */
  loadTab: async (args) => {
    // console.log(`Loading tab ${args.tab.name} from ${args.tab.path}`)
    // const result = await ipcRenderer.send('loadTab', args.tab)
    const result = await ipcRenderer.invoke('loadTab', args.tab)

    // ipcRenderer.on('tabLoaded', (event, arg) => {
    //   console.log('event.tabLoaded')
    //   console.log(arg)
    //   args.tabLoaded(arg.tab, arg.text)
    // })

    return result
  },
  loadTabs: async (args) => {
    console.log('loading tabs')
    const result = await ipcRenderer.send('loadTabs')

    ipcRenderer.on('tabsLoaded', (event, arg) => {
      args.tabsLoaded(arg)
    })

    return result
  },
  showOpenDialog: async _ => {
    await ipcRenderer.send('showOpenDialog')
  }
})
