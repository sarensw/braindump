import React, { ReactElement, FunctionComponent, useEffect, useState } from 'react'
import { useAppSelector } from '../hooks'
import EditorPage from './EditorPage'
import SettingsPage from './SettingsPage'

const PageContainer: FunctionComponent = (): ReactElement => {
  const app = useAppSelector(state => state.app)
  const [page, setPage] = useState<FunctionComponent>(() => SettingsPage)

  useEffect(() => {
    if (app.page === 'editor') setPage(() => EditorPage)
    else setPage(() => SettingsPage)
  }, [app.page])

  return React.createElement(page, {})
}

export default PageContainer
