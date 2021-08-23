import React, { useRef } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import log from '../log'
import { setCurrentTab/* , setSettingsAsCurrentTab */ } from '../store/storeTabs'
import dumpService from '../services/dumpService'
import Tab from './elements/Tab'

const AddDumpButton = styled.button`
  color: ${props => props.theme.foreground};
`

const Dumps = _ => {
  const tabs = useSelector(state => state.tabs.list)
  const currentTab = useSelector(state => state.tabs.currentTab)
  const dispatch = useDispatch()
  const scrollContainer = useRef()

  const loadDump = tab => {
    log.debug(`loading dump ${tab.name} from ${tab.path} as per user request`)
    dumpService.flush()
    dispatch(setCurrentTab(tab))
  }

  const addDump = tab => {
    log.debug('adding new dump')
    dumpService.flush()
    dispatch(setCurrentTab(null))
  }

  /* const showSettings = settings => {
    log.debug('loading settings as per user request')
    dispatch(setSettingsAsCurrentTab())
  } */

  const isCurrentTabActive = (tab) => {
    if (!currentTab) return false
    if (tab.path === currentTab.path) return true
    return false
  }

  const onWheel = (evt) => {
    evt.preventDefault()
    if (scrollContainer && scrollContainer.current) {
      scrollContainer.current.scrollLeft += evt.deltaY
    }
  }

  return (
    <>
      <ul ref={scrollContainer} role='tablist' className='flex flex-nowrap overflow-x-scroll tablist' onWheel={onWheel}>
        {tabs && tabs.map((tab, index) => {
          return <Tab key={index} onClick={() => loadDump(tab)} active={isCurrentTabActive(tab)} tab={tab}>{tab.name}</Tab>
        })}
        {/* <Tab onClick={showSettings}>settings</Tab> */}
      </ul>
      <AddDumpButton className='text-xl px-2' onClick={addDump}>+</AddDumpButton>
    </>
  )
}

export default Dumps
