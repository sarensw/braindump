import React from 'react'
import BlockHelper from '../../helper/blockHelper'

const BlockTask = (props) => {
  return (
    <span style={{
      background: '#81A1C1'
    }}
      className=''
      data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  )
}

const blockTaskRegex = /\[[/x]?\]/g

const blockTaskStrategy = (contentBlock, callback, contentState) => {
  BlockHelper.findWithRegex(blockTaskRegex, contentBlock, callback)
}

export default BlockTask
export const BlockTaskSettings = {
  decorator: {
    strategy: blockTaskStrategy,
    component: BlockTask
  }
}
