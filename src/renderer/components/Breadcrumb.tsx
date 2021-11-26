import React, { ReactElement } from 'react'
import { useAppSelector } from '../hooks'
import { useDispatch } from 'react-redux'
import { set as setPage } from '../store/storeApp'
import Icon from './elements/Icon'

const Breadcrumb = (): ReactElement => {
  const dispatch = useDispatch()
  const colors = useAppSelector(state => state.themeNew.colors)
  const current = useAppSelector(state => state.files.current)
  const files = useAppSelector(state => state.files.files)
  const headers = useAppSelector(state => state.editor.currentHeaders)

  const getFileName = (id: string | null): string => {
    const file = files?.find(f => f.id === id)
    return file?.name ?? ''
  }

  return (
    <div
      className='flex flex-row border-b h-full items-center whitespace-nowrap'
      style={{
        background: colors.breadcrumb.background ?? '#fff'
      }}
    >
      {/* Home */}
      <div
        className='p-0.5 px-2 self-stretch flex flex-row items-center cursor-pointer'
        style={{
          background: colors.breadcrumb.homeBackground
        }}
        onClick={() => dispatch(setPage('files'))}
      >
        <Icon color={colors.breadcrumb.homeForeground} height='10' icon='home' />
        <div
          className='ml-2 text-xs'
          style={{
            color: colors.breadcrumb.homeForeground
          }}
        >
          ({files?.length})
        </div>
      </div>
      <div
        className='mr-2'
        style={{
          width: '0',
          height: '0',
          borderTop: '0.675rem solid transparent',
          borderBottom: '0.675rem solid transparent',
          borderLeft: '0.6rem solid ' + colors.breadcrumb.homeBackground
        }}
      />

      {/* Path */}
      <div className='flex-grow flex flex-row'>
        {getFileName(current)}
        {headers?.map((header, index) => {
          return (
            <div key={index}><span className='mx-2 opacity-50'>&#62;</span>{header}</div>
          )
        })}
      </div>

      {/* Control elements */}
      {/* <div>
        Settings
      </div> */}
    </div>
  )
}

export default Breadcrumb
