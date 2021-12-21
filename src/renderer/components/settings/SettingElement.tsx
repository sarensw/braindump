import { SettingEnumValue } from './SettingEnumValue'

export interface SettingElement {
  id: string
  type: string
  title: string
  description: string
  validation?: string
  values?: SettingEnumValue[]
}
