import styled from 'styled-components'

const Button = styled.button`
  background-color: ${props => props.theme['button.background']};
  color: ${props => props.theme['button.foreground']};
  &:hover {
    background-color: ${props => props.theme['button.hoverBackground']}};
  }
`

export default Button

/* const Button = (props) => {
  const theme = useSelector(state => state.theme.theme)

  const classes = [
    'inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-sm'
  ]

  return (
    <>
      <button
        type='button'
        style={{
          backgroundColor: theme.colors['button.background'],
          '& button:hover': {
            backgroundColor: 'black',
            color: 'black'
          }
        }}
        className={classes.join(' ')}
        className={{
          '&:hover': {
            backgroundColor: 'green'
          }
        }}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </>
  )
} */
