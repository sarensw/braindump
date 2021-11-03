import styled from 'styled-components'

const Button = styled.button`
  background-color: ${props => props.theme['button.background']};
  color: ${props => props.theme['button.foreground']};
  padding: 2px 22px 2px 22px;
  &:hover {
    background-color: ${props => props.theme['button.hoverBackground']}};
  }
`

export default Button
