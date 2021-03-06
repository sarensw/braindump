import React, { FunctionComponent, useEffect, useState } from 'react'
import log from '../log'
import Page from './Page'
import settingsStructure from '../settings/settings.json'
import { update as updateSetting } from '../store/storeSettings'
import Label from '../components/settings/Label'
import { Dropdown, Option } from '../components/settings/Dropdown'
import { SettingsCategory } from '../components/settings/SettingsCategory'
import { useAppDispatch, useAppSelector } from '../hooks'
import { saveSettings } from '../services/settingsService'
import Text from '../components/settings/Text'
import { Description } from '../components/settings/Description'
import { SettingElement } from '../components/settings/SettingElement'
import { isPathValid, moveUserDataDirectory } from '../services/fileService'
import TextArea from '../components/settings/TextArea'
import { Settings } from '../braindump'
import { changeTheme } from '../services/themeService'
import { BuyMeCoffee } from '../components/settings/BuyMeCoffee'
import Button from '../components/elements/Button'

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

    if (s.id === 'app.theme') {
      await changeTheme(value)
    } else {
      dispatch(updateSetting({ id: s.id, value: newValue }))
      await saveSettings()
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

          // only store the setting if there is no separate action defined
          if (s.action === undefined) {
            await storeSetting(cid, s, value)
          }
        } else {
          setValidationError(prev => ({
            ...prev,
            [s.id]: 'Invalid path'
          }))
        }
      }
    } else {
      // only store the setting if there is no separate action defined
      if (s.action === undefined) {
        await storeSetting(cid, s, value)
      }
    }
  }

  const onAction = async (cid: string, s: SettingElement, value: string): Promise<void> => {
    const result = await moveUserDataDirectory(value)
    if (result !== null) {
      setValidationError(prev => ({
        ...prev,
        [s.id]: result
      }))
    }

    await storeSetting(cid, s, value)
  }

  return (
    <Page escToGoBack>
      <div className='h-full w-full overflow-y-auto styled-scrollbars'>
        <div className='max-w-xl m-auto px-2 h-full'>
          {/* license settings */}
          {/* <LicenseConfiguration /> */}

          {/* BuyMeCoffee link */}
          <div className='p-2'>
            <BuyMeCoffee width='120px' />
          </div>

          {/* all settings */}
          {categories.map((c, i) => {
            /* only show categories that are meant to be shown here */
            if (!c.show) return (<></>)

            /* category has to be shown */
            return (
              <div key={i} className='flex flex-col gap-3 mb-4 p-2'>
                <div className='text-lg col-span-2 font-bold'>{c.category}</div>
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
                        <div className='flex flex-row w-full gap-2'>
                          {s.action === undefined &&
                            <Text className='flex-grow' onChange={async e => await onChangeSetting(c.id, s, (e.target as HTMLInputElement).value)} value={temporaryTextValue[s.id]} />}
                          {s.action !== undefined &&
                            <>
                              <Text className='flex-grow' onChange={async e => await onChangeSetting(c.id, s, (e.target as HTMLInputElement).value)} value={temporaryTextValue[s.id]} />
                              <Button onClick={async e => await onAction(c.id, s, temporaryTextValue[s.id])}>{s.action.title}</Button>
                            </>}
                        </div>}

                      {/* setting type textarea */}
                      {s.type === 'textarea' &&
                        <TextArea className='w-full' onChange={async e => await onChangeSetting(c.id, s, (e.target as HTMLTextAreaElement).value)} value={temporaryTextValue[s.id]} />}

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
      </div>
    </Page>
  )
}

export default SettingsPage
