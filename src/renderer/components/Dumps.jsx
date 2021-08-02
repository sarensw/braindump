import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import log from '../log'
import { setCurrentTab, setSettingsAsCurrentTab } from '../store/storeTabs'
import dumpService from '../services/dumpService'
import Tab from './elements/Tab'

const Dumps = _ => {
  const tabs = useSelector(state => state.tabs.list)
  const currentTab = useSelector(state => state.tabs.currentTab)
  const dispatch = useDispatch()

  const loadDump = tab => {
    log.debug(`loading dump ${tab.name} from ${tab.path} as per user request`)
    dumpService.flush()
    dispatch(setCurrentTab(tab))
  }

  const showSettings = settings => {
    log.debug('loading settings as per user request')
    dispatch(setSettingsAsCurrentTab())
  }

  const isCurrentTabActive = (tab) => {
    if (!currentTab) return false
    if (tab.path === currentTab.path) return true
    return false
  }

  return (
    <>
      <ul>
        {tabs && tabs.map((tab, index) => {
          return <Tab key={index} onClick={() => loadDump(tab)} active={isCurrentTabActive(tab)}>{tab.name}</Tab>
        })}
        {/* <Tab onClick={showSettings}>settings</Tab> */}
      </ul>
    </>
  )
}

export default Dumps
