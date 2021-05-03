import React from 'react'
import BlockHelper from '../../helper/blockHelper'

const BlockDate = (props) => {
  return (
    <span style={{
      background: '#a3be8c'
    }}
      className=''
      data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  )
}

const blockDateRegex = /\/\/\d\d-\d\d-\d\d/g

const blockDateStrategy = (contentBlock, callback, contentState) => {
  BlockHelper.findWithRegex(blockDateRegex, contentBlock, callback)
}

export default BlockDate
export const BlockDateSettings = {
  decorator: {
    strategy: blockDateStrategy,
    component: BlockDate
  }
}
