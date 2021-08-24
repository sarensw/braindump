import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const SearchBox = styled.input`
  width: 100%;
  font-size: 0.8rem;
  padding: 0.1rem 0.3rem 0.1rem 0.3rem;
  background-color: ${props => props.theme['input.background']};
  border-width: 1px;
  border-color: ${props => props.theme['input.border']};
  color: ${props => props.theme['input.foreground']};

  ::placeholder {
    color: ${props => props.theme['input.placeholderForeground']};
  }

  :focus {
    border-color: ${props => props.theme.focusBorder};
  }

  /* ::placeholder,
  ::-webkit-input-placeholder {
    font-size: 0.6rem;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    float: left;
    padding: 0.1rem;
    margin-top: 0.1rem;
  } */
`

const Search = _ => {
  const theme = useSelector(state => state.theme)

  return (
    <>
      <div
        className='w-full px-2 pt-1 h-full'
        style={{
          backgroundColor: theme.colors['editorGroupHeader.tabsBackground']
        }}
      >
        <SearchBox placeholder='⌘P for search for any...' />
      </div>
    </>
  )
}

export default Search
