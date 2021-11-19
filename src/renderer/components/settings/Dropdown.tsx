import styled from 'styled-components'

const ifExists = (color: string | undefined, yes: any, no: any): any => {
  if (color !== undefined) return yes
  return no
}

const Dropdown = styled.select`
  background-color: ${props => props.theme.dropdown.background};
  color: ${props => props.theme.dropdown.foreground};
  padding: 2px 22px 2px 22px;
  border-width: ${props => ifExists(props.theme.dropdown.border, '1px', '0px')};
  border-color: ${props => ifExists(props.theme.dropdown.border, props.theme.dropdown.border, 0)};
  &:hover {
    background-color: ${props => props.theme.dropdown.hoverBackground};
    color: ${props => props.theme.dropdown.hoverForeground};
    border-width: ${props => ifExists(props.theme.dropdown.border, '1px', '0px')};
    border-color: ${props => props.theme.dropdown.hoverBorder};
  }
`

export default Dropdown
