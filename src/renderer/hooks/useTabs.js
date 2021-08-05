import log from '../log'

const useTabs = _ => {
  const saveTab = (tab, text) => {
    try {
      log.debug(tab)
      window.__preload.invoke('saveTab', {
        tab,
        text
      })
      log.debug('saved')
    } catch (error) {
      log.error(`Could not save the tab ${tab.name} because ${error.message}`)
    }
  }

  return {
    saveTab
  }
}

export default useTabs
