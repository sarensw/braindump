import styled from '../../themes/themed-styled-component'

const ifExists = (color: string | undefined, yes: any, no: any): any => {
  if (color !== undefined) return yes
  return no
}

const Button = styled.button`
  background-color: ${props => props.theme.button.background};
  color: ${props => props.theme.button.foreground};
  padding: 2px 22px 2px 22px;
  border-width: ${props => ifExists(props.theme.button.border, '1px', '0px')};
  border-color: ${props => ifExists(props.theme.button.border, props.theme.button.border, 0)};
  &:hover {
    background-color: ${props => props.theme.button.hoverBackground};
    color: ${props => props.theme.button.hoverForeground};
    border-width: ${props => ifExists(props.theme.button.hoverBorder, '1px', '0px')};
    border-color: ${props => props.theme.button.hoverBorder};
  }
`

export default Button
