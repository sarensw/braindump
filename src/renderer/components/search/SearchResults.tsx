import fuzzysort from 'fuzzysort'
import React, { ReactElement } from 'react'
import useElementSize from '../../hooks/useElementSize'

interface SearchResult {
  id: string
  score: number
  indexes: number[]
  target: string
  path: string
  lnr: number
  name: string
}

const truncate = (result: SearchResult, maxLength: number): SearchResult => {
  const text = result.target
  const indexes = result.indexes

  // easy case, no need to truncate anything
  if (text.length <= maxLength) return result

  // in case the line is too long, but the interesting part is at
  // the beginning, just truncate on the right
  if (indexes[0] < maxLength /* && indexes[indexes.length - 1] < maxLength */) {
    return {
      ...result,
      target: text.slice(0, maxLength - 1) + '…'
    }
  }

  // in case the line is too long, but the interesting part is at
  // the end, just truncate on the left
  if (indexes[0] > (text.length - maxLength)) {
    return {
      ...result,
      target: '…' + text.slice(-(maxLength - 1)),
      indexes: indexes.map(nr => nr - (text.length - (maxLength - 1)) + 1)
    }
  }

  // the interesting part is at the end, so we have to truncate at the
  // beginning at least
  // 1. the first and last index fit in max length -> cut at beginning
  //    and end in a way that the text seems to be at the end
  // 2. the first and last index are further away than max length ->
  //    cut at the beginning just as much so that at least the first
  //    interesting character is visible
  return {
    ...result,
    target: '…' + text.slice(indexes[0] - 9, indexes[0] - 9 + (maxLength - 2)) + '…',
    indexes: indexes.map(nr => nr - (indexes[0] - 9) + 1)
  }
}

const colorize = (truncatedResult: SearchResult): string => {
  const result = fuzzysort.highlight(
    truncatedResult,
    '<span class="text-green-500">',
    '</span>')
  return result ?? truncatedResult.target
}

function getCharacterWidth (): number {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context == null) return 1
  context.font = getComputedStyle(document.body).font
  return context.measureText('X').width
}

const format = (searchResult: SearchResult, width: number): string => {
  const result = searchResult // props.result as SearchResult
  const widthInChars = width / getCharacterWidth()
  const truncatedResult = truncate(result, widthInChars)
  const coloredTarget = colorize(truncatedResult)
  return coloredTarget
}

const SearchResultRow = (props): ReactElement => {
  const [divRef, { width }] = useElementSize()

  const result = props.result as SearchResult

  return (
    <div className='flex flex-row gap-4'>
      <div ref={divRef} className='truncate flex-grow' dangerouslySetInnerHTML={{ __html: format(result, width) }} />
      <div className='text-white/30 text-sm self-center'>{result.name}</div>
      <div className='text-white/30 text-sm self-center'>({result.lnr})</div>
    </div>
  )
}

export { SearchResultRow }
