import React, { FunctionComponent, useEffect, useState } from 'react'
import log from '../log'
import Page from './Page'
import settingsStructure from '../settings/settings.json'
import { update as updateSetting } from '../store/storeSettings'
import { setTheme } from '../store/storeThemeNew'
import Label from '../components/settings/Label'
import Dropdown from '../components/settings/Dropdown'
import { SettingsCategory } from '../components/settings/SettingsCategory'
import { Settings } from '../../shared/types'
import { useAppDispatch, useAppSelector } from '../hooks'
import { saveSettings } from '../services/settingsService'
import { Light } from '../themes/themeLoader'

const SettingsPage: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const [categories, setCategories] = useState<SettingsCategory[]>()
  const settings: Settings = useAppSelector(state => state.settings)

  useEffect(() => {
    const mappedSettings = settingsStructure.map(s => s as SettingsCategory)
    console.log(mappedSettings)
    setCategories(mappedSettings)
  }, [])

  if (categories === undefined) return null

  const onChangeSetting = async (cid: string, sid: string, value: string): Promise<void> => {
    log.debug({ cid, sid, value })
    let newValue: string | boolean = value
    if (value === 'boolean.true') newValue = true
    if (value === 'boolean.false') newValue = false
    dispatch(updateSetting({ id: sid, value: newValue }))
    await saveSettings()
    if (sid === 'app.theme') {
      dispatch(setTheme({
        theme: Light,
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
                  <Label>{c.category}: {s.title}</Label>
                  <Dropdown onChange={async e => await onChangeSetting(c.id, s.id, (e.target as HTMLSelectElement).value)} value={settings[s.id]}>
                    {s.values?.map((v, i) => {
                      return <option key={v.id} value={v.id} label={v.label}>{v.label}</option>
                    })}
                  </Dropdown>
                </>
              )
            } else if (s.type === 'boolean') {
              return (
                <>
                  <Label>{c.category}: {s.title}</Label>
                  <Dropdown onChange={async e => await onChangeSetting(c.id, s.id, (e.target as HTMLSelectElement).value)} value={settings[s.id] === true ? 'boolean.true' : 'boolean.false'}>
                    <option value='boolean.true' label='on'>true</option>
                    <option value='boolean.false' label='off'>false</option>
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
