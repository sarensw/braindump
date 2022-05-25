import React, { FunctionComponent, ReactElement, useEffect } from 'react'
import { SearchField } from '../components/search/SearchField'
import { SearchList } from '../components/search/SearchList'
import { useAppDispatch } from '../hooks'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { FocusElementType, setActiveOverlay } from '../store/storeApp'
import { Overlay } from './Overlay'

const SearchOverlay: FunctionComponent = (): ReactElement => {
  const dispatch = useAppDispatch()

  const { to } = useKeyboardNavigation(
    'search',
    FocusElementType.Page,
    {
      Escape: (to) => {
        dispatch(setActiveOverlay(null))
        to('editor/editor')
      }
    }
  )

  useEffect(() => {
    to('search/field')
  }, [])

  return (
    <Overlay width='w-full' height='h-full'>
      <div
        style={{
          gridTemplateRows: 'auto 1fr'
        }}
        className='p-4 grid h-full'
      >
        <SearchField />
        <SearchList />
      </div>
    </Overlay>
  )
}

export { SearchOverlay }
