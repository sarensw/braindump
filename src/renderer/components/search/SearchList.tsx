import React, { FunctionComponent, ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation'
import { FocusElementType, setActiveOverlay } from '../../store/storeApp'
import { setCurrentFile } from '../../store/storeFiles'
import { List } from '../elements/List'
import { SearchResultRow } from './SearchResults'

interface SearchResult {
  id: string
  score: number
  indexes: number[]
  target: string
  path: string
  lnr: number
  name: string
}

const SearchList: FunctionComponent = (): ReactElement => {
  const dispatch = useAppDispatch()
  const fuzzy = useAppSelector(state => state.search.fuzzy)

  const { to } = useKeyboardNavigation(
    'search/listContainer',
    FocusElementType.Element,
    {}
  )

  const openFileAtPosition = (selected: SearchResult): void => {
    dispatch(setCurrentFile({
      id: selected.id,
      line: selected.lnr,
      column: selected.indexes[0]
    }))
    dispatch(setActiveOverlay(null))
    to('editor/editor')
  }

  return (
    <List<SearchResult>
      focusId='search/list'
      prevFocusId='search/field'
      items={fuzzy}
      onClick={(item) => openFileAtPosition(item)}
      display={(item, index, selected) => <SearchResultRow key={index} index={index} result={item} selected={selected} />}
    />
  )
}

export { SearchList }
