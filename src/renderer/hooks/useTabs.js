import { useDispatch } from 'react-redux'
import { set as setTabs, setTabText } from '../store/storeTabs'
import log from '../log'

const useTabs = _ => {
  const dispatch = useDispatch()

  const tabLoaded = (tab, text) => {
    log.debug('useTabs.tabLoaded')
    dispatch(setTabText({ tab, text }))
  }

  const tabsLoaded = tabs => {
    dispatch(setTabs(tabs))
  }

  const loadTab = tab => {
    try {
      const result = window.__preload.loadTab({
        tab,
        tabLoaded
      })
      return result
    } catch (error) {
      log.error(`Could not load the tabe ${tab.name}, because ${error.message}`)
    }
  }

  const loadTabs = _ => {
    try {
      const result = window.__preload.loadTabs({
        tabsLoaded
      })
      return result
    } catch (error) {
      log.error(`Could not load the tabs because ${error.message}`)
    }
  }

  const saveTab = (tab, text) => {
    try {
      log.debug(tab)
      window.__preload.save({
        tab,
        text
      })
      log.debug('saved')
    } catch (error) {
      log.error(`Could not save the tab ${tab.name} because ${error.message}`)
    }
  }

  return {
    loadTab,
    loadTabs,
    saveTab
  }
}

export default useTabs
