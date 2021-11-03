import React, { ReactElement, FunctionComponent, useEffect, useState } from 'react'
import { useAppSelector } from '../hooks'
import EditorPage from './EditorPage'
import SettingsPage from './SettingsPage'
import SnippetsPage from './SnippetsPage'

const PageContainer: FunctionComponent = (): ReactElement => {
  const app = useAppSelector(state => state.app)
  const [page, setPage] = useState<FunctionComponent>(() => SettingsPage)

  useEffect(() => {
    if (app.page === 'editor') setPage(() => EditorPage)
    else if (app.page === 'snippets') setPage(() => SnippetsPage)
    else setPage(() => SettingsPage)
  }, [app.page])

  return React.createElement(page, {})
}

export default PageContainer
