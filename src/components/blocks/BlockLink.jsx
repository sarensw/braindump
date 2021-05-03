import React from 'react'
import BlockHelper from '../../helper/blockHelper'

const BlockLink = (props) => {
  console.log(props)
  return (
    <span style={{
      background: '#88C0D0'
    }}
      className=''
      data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  )
}

const blockLinkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

const blockLinkStrategy = (contentBlock, callback, contentState) => {
  BlockHelper.findWithRegex(blockLinkRegex, contentBlock, callback)
}

export default BlockLink
export const BlockLinkSettings = {
  decorator: {
    strategy: blockLinkStrategy,
    component: BlockLink
  }
}
