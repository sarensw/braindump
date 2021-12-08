import React from 'react'
import styled from '../../themes/themed-styled-component'
import Icon from './Icon'
import { closeFile } from '../../services/fileService'

const eitherOrActive = (props, styleActive: string | undefined, styleInactive: string | undefined): string => {
  if (props.active !== null && props.active === true) return styleActive === undefined ? '' : styleActive
  return styleInactive === undefined ? '' : styleInactive
}

const ifExists = (color: string | undefined, yes: any, no: any): any => {
  if (color !== undefined) return yes
  return no
}

const NewTab = styled.li<{ active: boolean }>`
  /* display: inline-flex; */
  flex: 0 0 auto;
  align-items: center;
  padding: 0.4rem;
  padding-left: 1rem;
  padding-right: 0.6rem;
  cursor: pointer;
  user-select: none;
  border-right-width: ${props => ifExists(props.theme.tab.border, 1, 0)}px;
  border-bottom-width: ${props => ifExists(props.theme.tab.activeBorder, 1, 0)}px;
  border-top-width: ${props => ifExists(props.theme.tab.activeBorder, 1, 0)}px;
  font-size: 0.94rem;
  background-color: ${props => eitherOrActive(props, props.theme.tab.activeBackground, props.theme.tab.inactiveBackground)};
  color: ${props => eitherOrActive(props, props.theme.tab.activeForeground, props.theme.tab.inactiveForeground)};
  /* border-color: ${props => props.theme.tab.border}; */
  border-bottom-color: ${props => eitherOrActive(props, props.theme.tab.activeBorder, props.theme.tab.inactiveBackground)};
  border-top-color: ${props => eitherOrActive(props, props.theme.tab.activeBorderTop, props.theme.tab.inactiveBackground)};
  &:hover {
    background-color: ${props => props.theme.tab.hoverBackground};
    color: ${props => props.theme.tab.hoverForeground};
    /* border-color: ${props => props.theme.tab.hoverBorder}; */
  }
`

const CloseButton = styled.button`
  padding: 0.1rem;
  margin-left: 0.3rem;
  height: 1rem;
  width: 1rem;
  color: ${props => eitherOrActive(props, props.theme.tab.activeForeground, props.theme.tab.inactiveForeground)};
  &:hover {
    background-color: ${props => props.theme.toolBar.hoverBackground};
  }
`

const Tab = (props): React.ReactElement => {
  const close = async (event, tab): Promise<void> => {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    await closeFile(props.fid)
  }

  return (
    <>
      <NewTab active={props.active} onClick={props.onClick} className='flex flex-row'>
        <div>{props.children}</div>
        <CloseButton onClick={async (event): Promise<void> => await close(event, props.tab)}>
          <Icon icon='window_close' />
        </CloseButton>
      </NewTab>
    </>
  )
}

export default Tab
