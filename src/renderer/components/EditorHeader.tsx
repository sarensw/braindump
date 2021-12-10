import React, { ReactElement, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { setFileName } from '../services/fileService'
import { setFocusElement } from '../store/storeApp'

const EditorHeader: React.FunctionComponent<{ path: string }> = (props): ReactElement => {
  const dispatch = useDispatch()
  let refFileNameInput: HTMLInputElement | null = null
  const [name, setName] = useState('')
  const files = useAppSelector(state => state.files)
  const editor = useAppSelector(state => state.editor)
  const focusElement = useAppSelector(state => state.app.focusElement)
  const colors = useAppSelector(state => state.themeNew.colors)

  useEffect(() => {
    if (files.current !== null) {
      const file = files.files?.find(f => f.id === files.current)

      if (file !== undefined) {
        setName(file.name)
      }
    }
  }, [files.current])

  useEffect(() => {
    if (focusElement === 'fileName') {
      refFileNameInput?.select()
      refFileNameInput?.focus()
    }
    return () => {
      dispatch(setFocusElement(''))
    }
  }, [focusElement])

  const handleNameChange = async (event): Promise<void> => {
    setName(event.target.value)
    await setFileName(props.path, event.target.value)
  }

  const getLeftMargin = (): number => {
    let leftMargin = editor.decorationsLeft + editor.decorationsWidth
    if (leftMargin <= 26) leftMargin = 26
    return leftMargin
  }

  return (
    <>
      <div
        className='flex flex-row p-4 pt-2 text-xl font-mono'
        style={{
          marginLeft: `${getLeftMargin()}px`,
          paddingLeft: '0px'
        }}
      >
        <div className='flex flex-col flex-grow'>
          {/* Note name */}
          <input ref={el => { refFileNameInput = el }} className='flex-grow bg-transparent' type='text' value={name} onChange={handleNameChange} />

          {/* Path */}
          <div
            className='flex-grow flex flex-row text-sm h-6'
            style={{
              color: colors.breadcrumb.pathForeground
            }}
          >
            {editor.currentHeaders?.map((header, index) => {
              return (
                <div key={index}>
                  {index > 0 && <span className='mx-2 opacity-50'>&#62;</span>}
                  {header}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default EditorHeader
