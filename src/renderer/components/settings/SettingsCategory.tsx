import { SettingElement } from './SettingElement'

export interface SettingsCategory {
  id: string
  category: string
  show: boolean
  settings: SettingElement[]
}
