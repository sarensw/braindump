import React, { FunctionComponent, useEffect, useState } from 'react'
import log from '../log'
import Page from './Page'
import settingsStructure from '../settings/settings.json'
import { update as updateSetting } from '../store/storeSettings'
import { setTheme } from '../store/storeThemeNew'
import Label from '../components/settings/Label'
import { Dropdown, Option } from '../components/settings/Dropdown'
import { SettingsCategory } from '../components/settings/SettingsCategory'
import { Settings } from '../../shared/types'
import { useAppDispatch, useAppSelector } from '../hooks'
import { saveSettings } from '../services/settingsService'
import { Light } from '../themes/themeLoader'
import Text from '../components/settings/Text'
import { Description } from '../components/settings/Description'
import { SettingElement } from '../components/settings/SettingElement'
import { isPathValid } from '../services/fileService'

const SettingsPage: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const [categories, setCategories] = useState<SettingsCategory[]>()
  const [validationError, setValidationError] = useState({})
  const [temporaryTextValue, setTemporaryTextValue] = useState({})
  const settings: Settings = useAppSelector(state => state.settings)

  useEffect(() => {
    const mappedSettings = settingsStructure.map(s => s as SettingsCategory)
    console.log(mappedSettings)
    setCategories(mappedSettings)

    for (const category of mappedSettings) {
      for (const setting of category.settings) {
        if (setting.type === 'text') {
          temporaryTextValue[setting.id] = settings[setting.id]
        }
      }
    }
  }, [])

  if (categories === undefined) return null

  const storeSetting = async (cid: string, s: SettingElement, value: string): Promise<void> => {
    let newValue: string | boolean = value
    if (value === 'boolean.true') newValue = true
    if (value === 'boolean.false') newValue = false
    dispatch(updateSetting({ id: s.id, value: newValue }))
    await saveSettings()

    if (s.id === 'app.theme') {
      dispatch(setTheme({
        theme: Light,
        id: value
      }))
    }
  }

  const onChangeSetting = async (cid: string, s: SettingElement, value: string): Promise<void> => {
    log.debug({ cid, sid: s.id, value })

    if (s.type === 'text') {
      setTemporaryTextValue(prev => ({
        ...prev,
        [s.id]: value
      }))
    }

    // check whether the given entry is valid before actually storing the value
    if (s.validation !== undefined) {
      if (s.validation === 'path') {
        const isValid = await isPathValid(value)
        if (isValid && value !== '/') {
          setValidationError(prev => ({
            ...prev,
            [s.id]: undefined
          }))

          await storeSetting(cid, s, value)
        } else {
          setValidationError(prev => ({
            ...prev,
            [s.id]: 'Invalid path'
          }))
        }
      }
    } else {
      await storeSetting(cid, s, value)
    }
  }

  return (
    <Page>
      <div className='max-w-lg m-auto px-2'>
        {categories.map((c, i) => {
          return (
            <div key={i} className='flex flex-col gap-3 mb-4'>
              <div className='ftext-lg col-span-2 font-bold'>{c.category}</div>
              {c.settings.map((s, i) => {
                return (
                  <div key={i} className='text-sm'>
                    <Label className=''>{s.title}</Label>
                    <Description className='mb-0.5'>{s.description}</Description>

                    {/* setting type enum */}
                    {s.type === 'enum' &&
                      <Dropdown onChange={async e => await onChangeSetting(c.id, s, (e.target as HTMLSelectElement).value)} value={settings[s.id]}>
                        {s.values?.map((v, i) => {
                          return <option key={v.id} value={v.id} label={v.label}>{v.label}</option>
                        })}
                      </Dropdown>}

                    {/* setting type boolean */}
                    {s.type === 'boolean' &&
                      <Dropdown onChange={async e => await onChangeSetting(c.id, s, (e.target as HTMLSelectElement).value)} value={settings[s.id] === true ? 'boolean.true' : 'boolean.false'}>
                        <Option value='boolean.true' label='on'>true</Option>
                        <Option value='boolean.false' label='off'>false</Option>
                      </Dropdown>}

                    {/* setting type text */}
                    {s.type === 'text' &&
                      <Text className='w-full' onChange={async e => await onChangeSetting(c.id, s, (e.target as HTMLInputElement).value)} value={temporaryTextValue[s.id]} />}

                    {/* show a validation error */}
                    {validationError[s.id] !== undefined &&
                      <div className='text-xs text-red-500'>{validationError[s.id]}</div>}

                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </Page>
  )
}

export default SettingsPage
