import styled from 'styled-components'

const ifExists = (color: string | undefined, yes: any, no: any): any => {
  if (color !== undefined) return yes
  return no
}

const Text = styled.input`
  background-color: ${props => props.theme.settings.text.background};
  color: ${props => props.theme.settings.text.foreground};
  padding: 0.2rem 0.3rem;
  border-width: ${props => ifExists(props.theme.settings.text.border, '1px', '0px')};
  border-color: ${props => ifExists(props.theme.settings.text.border, props.theme.settings.text.border, 0)};
  &:hover {
    background-color: ${props => props.theme.settings.text.hoverBackground};
    color: ${props => props.theme.settings.text.hoverForeground};
    border-width: ${props => ifExists(props.theme.settings.text.border, '1px', '0px')};
    border-color: ${props => props.theme.settings.text.hoverBorder};
  }
`

export default Text
