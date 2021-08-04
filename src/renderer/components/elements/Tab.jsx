import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import Icon from './Icon'
import { closeTab } from '../../store/storeTabs'

const eitherOrActive = (props, styleActive, styleInactive) => {
  if (props.active) return props.theme[styleActive]
  return props.theme[styleInactive]
}

const ifExists = (props, attribute, yes, no) => {
  if (props.theme[attribute]) return yes
  return no
}

const NewTab = styled.li`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  cursor: pointer;
  user-select: none;
  border-right-width: 1px;
  border-bottom-width: ${props => ifExists(props, 'tab.activeBorder', 1, 0)}px;
  border-top-width: ${props => ifExists(props, 'tab.activeBorder', 2, 0)}px;
  font-size: 0.8rem;
  background-color: ${props => eitherOrActive(props, 'tab.activeBackground', 'tab.inactiveBackground')};
  color: ${props => eitherOrActive(props, 'tab.activeForeground', 'tab.inactiveForeground')};
  border-color: ${props => props.theme['tab.border']}};
  border-bottom-color: ${props => eitherOrActive(props, 'tab.activeBorder', 'tab.inactiveBackground')}};
  border-top-color: ${props => eitherOrActive(props, 'tab.activeBorderTop', 'tab.inactiveBackground')}};
  &:hover {
    background-color: ${props => props.theme['tab.hoverBackground']}};
    color: ${props => props.theme['tab.hoverForeground']}};
    border-color: ${props => props.theme['tab.hoverBorder']}};
  }
`

const CloseButton = styled.button`
  padding: 0.1rem;
  margin-left: 0.3rem;
  height: 1rem;
  width: 1rem;
  color: ${props => eitherOrActive(props, 'tab.activeForeground', 'tab.inactiveForeground')};
  &:hover {
    background-color: ${props => props.theme['toolbar.hoverBackground']};
  }
`

const Tab = (props) => {
  const dispatch = useDispatch()

  const close = (event, tab) => {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    console.log('closing tab ' + tab.name)
    dispatch(closeTab(tab))
  }

  return (
    <>
      <NewTab active={props.active} onClick={props.onClick}>
        {props.children}
        <CloseButton onClick={(event) => close(event, props.tab)}>
          <Icon name='window_close' />
        </CloseButton>
      </NewTab>
    </>
  )
}

export default Tab
