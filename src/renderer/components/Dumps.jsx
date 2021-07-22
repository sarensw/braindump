import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import log from '../log'
import { setCurrentTab } from '../store/storeTabs'

const Dumps = _ => {
  const tabs = useSelector(state => state.tabs.list)
  const currentTab = useSelector(state => state.tabs.currentTab)
  const dispatch = useDispatch()

  const loadDump = tab => {
    log.debug(`loading dump ${tab.name} from ${tab.path}`)
    dispatch(setCurrentTab(tab))
  }

  return (
    <>
      {tabs && tabs.map((tab, index) => {
        return <button key={index} onClick={() => loadDump(tab)} className={(currentTab && currentTab.path === tab.path ? 'bg-yellow-100' : 'bg-blue-100')}>{tab.name}</button>
      })}
    </>
  )
}

export default Dumps
