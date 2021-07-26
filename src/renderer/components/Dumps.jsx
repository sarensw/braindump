import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import log from '../log'
import { setCurrentTab, setSettingsAsCurrentTab } from '../store/storeTabs'
import dumpService from '../services/dumpService'

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

  return (
    <>
      <div className='flex flex-row'>
        {tabs && tabs.map((tab, index) => {
          return <button key={index} onClick={() => loadDump(tab)} className={(currentTab && currentTab.path === tab.path ? 'bg-yellow-100' : 'bg-blue-100')}>{tab.name}</button>
        })}
        <button onClick={showSettings}>settings</button>
      </div>
    </>
  )
}

export default Dumps
