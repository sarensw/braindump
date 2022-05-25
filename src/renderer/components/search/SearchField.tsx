import React, { FunctionComponent, ReactElement, useRef } from 'react'
import { useAppDispatch } from '../../hooks'
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation'
import { FocusElementType } from '../../store/storeApp'
import { fuzzySearch } from '../../store/storeSearch'
import Text from '../settings/Text'

const SearchField: FunctionComponent = (): ReactElement => {
  const dispatch = useAppDispatch()
  const refText = useRef<HTMLInputElement>(null)

  const { to } = useKeyboardNavigation(
    'search/field', // id,
    FocusElementType.Element,
    {
      ArrowDown: (to) => to('search/list')
    },
    refText
  )

  return (
    <Text
      ref={refText}
      className='flex-grow'
      onFocus={e => to('search/field')}
      onChange={e => dispatch(fuzzySearch(e.target.value))}
    />
  )
}

export { SearchField }
