import React, { ReactElement } from 'react'
import Page from './Page'
import Search from '../components/Search'
import MonacoEditor from '../components/EditorMonaco'
import Dumps from '../components/Dumps'
import { useAppSelector } from '../hooks'

const EditorPage: React.FunctionComponent = (): ReactElement => {
  const colors = useAppSelector(state => state.theme.colors)
  return (
    <Page>
      <div
        className='grid h-full'
        style={{
          gridTemplateRows: '[search] 2.0rem [header] 2.2rem [main] minmax(0, 1fr)'
        }}
      >
        <Search />

        <div
          className='grid'
          style={{
            backgroundColor: colors['editorGroupHeader.tabsBackground'],
            gridTemplateColumns: '1fr 26px'
          }}
        >
          <Dumps />
        </div>

        <MonacoEditor />
      </div>
    </Page>
  )
}

export default EditorPage
