import React from 'react'
import BlockHelper from '../../helper/blockHelper'
import df from 'dateformat'
import DatePicker from 'react-datepicker'

const BlockDate = (props) => {
  console.log(props)
  const date = df(new Date(), 'yy-mm-dd')
  return (
    <span style={{
      background: '#a3be8c'
    }}
      className=''
      data-offset-key={props.offsetKey}>
      {props.children}{date}
    </span>
  )
}

const blockDateRegex = /\/\//g

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
