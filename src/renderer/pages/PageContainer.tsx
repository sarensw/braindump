import React, { ReactElement, FunctionComponent, useEffect, useState } from 'react'
import { useAppSelector } from '../hooks'
import log from '../log'
import EditorPage from './EditorPage'
import FilesPage from './FilesPage'
import SettingsPage from './SettingsPage'
import SnippetsPage from './SnippetsPage'

const PageContainer: FunctionComponent = (): ReactElement => {
  const app = useAppSelector(state => state.app)
  const [page, setPage] = useState<FunctionComponent>(() => SettingsPage)
  console.log(page)

  useEffect(() => {
    log.debug(`app page changed to ${app.page}`)
    console.trace()
    if (app.page === 'files') setPage(() => FilesPage)
    else if (app.page === 'editor') setPage(() => EditorPage)
    else if (app.page === 'snippets') setPage(() => SnippetsPage)
    else setPage(() => SettingsPage)
  }, [app.page])

  return React.createElement(page, {})
}

export default PageContainer
