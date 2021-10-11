import React, { FunctionComponent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import log from '../log'
import Page from './Page'
import settingsStructure from '../settings.json'
import { update as updateSetting, saveSettings } from '../store/storeSettings'
import themes from '../themes'
import { set as setTheme } from '../store/storeTheme'
import Label from '../components/settings/Label'
import Dropdown from '../components/settings/Dropdown'
import { SettingsCategory } from '../settings/SettingsCategory'
import { Settings } from '../settings/Settings'

const SettingsPage: FunctionComponent = () => {
  const dispatch = useDispatch()
  const [categories, setCategories] = useState<SettingsCategory[]>()
  const settings: Settings = useSelector(state => state.settings.settings)

  useEffect(() => {
    const mappedSettings = settingsStructure.map(s => s as SettingsCategory)
    console.log(mappedSettings)
    setCategories(mappedSettings)
  }, [])

  if (categories === undefined) return null

  const onChangeSetting = (cid: string, sid: string, value: string): void => {
    log.debug({ cid, sid, value })
    dispatch(updateSetting({ id: sid, value }))
    dispatch(saveSettings())
    if (sid === 'app.theme') {
      dispatch(setTheme({
        theme: themes[value],
        id: value
      }))
    }
  }

  return (
    <Page>
      <div className='grid grid-cols-2 max-w-lg m-auto'>
        {categories.map((c, i) => {
          return c.settings.map((s, i) => {
            if (s.type === 'enum') {
              return (
                <>
                  <Label>{s.title}</Label>
                  <Dropdown onChange={e => onChangeSetting(c.id, s.id, (e.target as HTMLSelectElement).value)} value={settings['app.theme']}>
                    {s.values?.map((v, i) => {
                      return <option key={v.id} value={v.id} label={v.label}>{v.label}</option>
                    })}
                  </Dropdown>
                </>
              )
            } else {
              return <div key={i} />
            }
          })
        })}
      </div>
    </Page>
  )
}

export default SettingsPage
