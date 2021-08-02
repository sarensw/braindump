import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { set as setTheme } from '../store/storeTheme'
import themes from '../themes'

const Select = styled.select`
  font-size: 0.8rem;
  padding: 0.125rem;
  border-width: 1px;
  border-color: ${props => props.theme['dropdown.border']};
  background-color: ${props => props.theme['dropdown.background']};
  color: ${props => props.theme['dropdown.foreground']};
`

const ThemeChanger = _ => {
  const dispatch = useDispatch()

  const changeThemeByUser = event => {
    const themeId = event.target.value
    dispatch(setTheme({
      theme: themes[themeId],
      id: themeId
    }))
  }

  return (
    <>
      <div className='flex flex-row items-center mr-1'>
        <Select onChange={changeThemeByUser}>
          <option value='monokai'>Monokai</option>
          <option value='solarizedlight'>Solarized Light</option>
          <option value='nordlight'>Nord Light</option>
        </Select>
      </div>
    </>
  )
}

export default ThemeChanger
