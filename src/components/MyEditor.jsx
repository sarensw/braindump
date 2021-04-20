import React from 'react'
import Line from './Line'

const MyEditor = _ => {
  return (
    <>
      <div className="bg-gray-100">
        <Line line={1} />
        <Line line={2} />
        <Line line={3} />
        <Line line={4} />
        <Line line={5} />
        <Line line={6} />
      </div>
    </>
  )
}

export default MyEditor
