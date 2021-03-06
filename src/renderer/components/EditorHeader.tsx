import React, { ReactElement, useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { setClusterName, setFileName } from '../services/fileService'
import { FocusElementType } from '../store/storeApp'
import { getMenuTemplate } from '../services/contextMenuService'
import Icon from '../components/elements/Icon'
import { setShareFile } from '../store/storeFiles'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'

const EditorHeader: React.FunctionComponent<{ path: string }> = (props): ReactElement => {
  const dispatch = useDispatch()
  const refName = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [cluster, setCluster] = useState('')
  const current = useAppSelector(state => state.files.current)
  const files = useAppSelector(state => state.files)
  const editor = useAppSelector(state => state.editor)
  const colors = useAppSelector(state => state.themeNew.colors)

  const { to } = useKeyboardNavigation(
    'editor/header/name',
    FocusElementType.Element,
    {},
    refName
  )

  useEffect(() => {
    if (current == null) return

    const file = files.files?.find(f => f.id === current.id)

    if (file !== undefined) {
      setName(file.name)
      setCluster(file.cluster)
    }
  }, [current])

  const handleClusterChange = async (event): Promise<void> => {
    setCluster(event.target.value)
    await setClusterName(props.path, event.target.value)
  }

  const handleNameChange = async (event): Promise<void> => {
    setName(event.target.value)
    await setFileName(props.path, event.target.value)
  }

  const getLeftMargin = (): number => {
    let leftMargin = editor.decorationsLeft + editor.decorationsWidth
    if (leftMargin <= 26) leftMargin = 26
    return leftMargin
  }

  const showAppContextMenu = (): void => {
    const template = getMenuTemplate('appContext')
    window.__preload.menu(template)
  }

  const showShareMenu = (): void => {
    if (current === null) return

    const file = files.files?.find(f => f.id === current.id)
    if (file === undefined) return

    dispatch(setShareFile(file))
    const template = getMenuTemplate('share')
    window.__preload.menu(template)
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
          <div className='flex flex-row gap-2'>
            {/* Note cluster */}
            <input
              // ref={el => { refFileNameInput = el }}
              className='shrink bg-transparent min-w-min italic'
              style={{
                color: colors.foregroundLight
              }}
              type='text'
              value={cluster}
              placeholder='unclustered'
              size={cluster === undefined || cluster.length === 0 ? 'unclustered'.length : cluster.length}
              onChange={handleClusterChange}
              onFocus={e => to('editor/header/category')}
            />

            {/* Note name */}
            <input
              ref={refName}
              className='flex-grow bg-transparent'
              type='text'
              value={name}
              onChange={handleNameChange}
              onFocus={e => to('editor/header/name')}
            />

            <button tabIndex={-1} onClick={() => showShareMenu()}>
              <Icon icon='share' />
            </button>
            <button tabIndex={-1} onClick={() => showAppContextMenu()}>
              <Icon icon='more' />
            </button>
          </div>

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
