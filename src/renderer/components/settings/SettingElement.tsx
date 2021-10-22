import { SettingEnumValue } from './SettingEnumValue'

export interface SettingElement {
  id: string
  type: string
  title: string
  values?: SettingEnumValue[]
}
