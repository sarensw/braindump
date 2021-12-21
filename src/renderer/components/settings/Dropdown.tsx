import styled from 'styled-components'

const ifExists = (color: string | undefined, yes: any, no: any): any => {
  if (color !== undefined) return yes
  return no
}

const Dropdown = styled.select`
  background-color: ${props => props.theme.settings.dropdown.background};
  color: ${props => props.theme.settings.dropdown.foreground};
  padding: 0.2rem 0rem;
  border-width: ${props => ifExists(props.theme.settings.dropdown.border, '1px', '0px')};
  border-color: ${props => ifExists(props.theme.settings.dropdown.border, props.theme.settings.dropdown.border, 0)};
  min-width: 50%;
  &:hover {
    background-color: ${props => props.theme.settings.dropdown.hoverBackground};
    color: ${props => props.theme.settings.dropdown.hoverForeground};
    border-width: ${props => ifExists(props.theme.settings.dropdown.border, '1px', '0px')};
    border-color: ${props => props.theme.settings.dropdown.hoverBorder};
  }
`

const Option = styled.option`
`

export { Dropdown, Option }
