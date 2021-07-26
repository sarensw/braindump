import { useDispatch } from 'react-redux'
import { set as setTabs } from '../store/storeTabs'
import log from '../log'

const useTabs = _ => {
  const dispatch = useDispatch()

  const loadTabs = async _ => {
    try {
      log.debug('loading tabs')
      const tabs = await window.__preload.invoke({ channel: 'loadTabs' })
      log.debug(tabs)
      dispatch(setTabs(tabs))
    } catch (error) {
      log.error(`Could not load the tabs because ${error.message}`)
    }
  }

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
    /* loadTab,
     */loadTabs,
    saveTab
  }
}

export default useTabs
