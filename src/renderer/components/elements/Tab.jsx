import React from 'react'
import styled from 'styled-components'

const eitherOrActive = (props, styleActive, styleInactive) => {
  console.log(props.theme['tab.activeForeground'])
  if (props.active) return props.theme[styleActive]
  return props.theme[styleInactive]
}

const ifExists = (props, attribute, yes, no) => {
  if (props.theme[attribute]) return yes
  return no
}

const NewTab = styled.li`
  display: inline-block;
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

const Tab = (props) => {
  return (
    <>
      <NewTab active={props.active} onClick={props.onClick}>{props.children}</NewTab>
    </>
  )
}

export default Tab
