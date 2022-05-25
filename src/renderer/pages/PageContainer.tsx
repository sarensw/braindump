import React, { ReactElement, FunctionComponent, useEffect, useState } from 'react'
import { useAppSelector } from '../hooks'
import log from '../log'
import EditorPage from './EditorPage'
import FilesPage from './FilesPage'
import PresentationPage from './PresentationPage'
import SettingsPage from './SettingsPage'
import SnippetsPage from './SnippetsPage'

const PageContainer: FunctionComponent = (): ReactElement => {
  const appPage = useAppSelector(state => state.app.page)
  const [page, setPage] = useState<FunctionComponent>(() => SettingsPage)

  useEffect(() => {
    log.debug(`app page changed to ${appPage}`)
    if (appPage === 'files') setPage(() => FilesPage)
    else if (appPage === 'editor') setPage(() => EditorPage)
    else if (appPage === 'snippets') setPage(() => SnippetsPage)
    else if (appPage === 'presentation') setPage(() => PresentationPage)
    else setPage(() => SettingsPage)
  }, [appPage])

  return React.createElement(page, {})
}

export default PageContainer
