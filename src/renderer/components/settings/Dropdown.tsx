import styled from 'styled-components'

const Dropdown = styled.select`
  font-size: 0.8rem;
  padding: 0.125rem;
  border-width: 1px;
  border-color: ${props => props.theme['dropdown.border']};
  background-color: ${props => props.theme['dropdown.background']};
  color: ${props => props.theme['dropdown.foreground']};

  :focus {
    border-color: ${props => props.theme.focusBorder};
  }
`

export default Dropdown
