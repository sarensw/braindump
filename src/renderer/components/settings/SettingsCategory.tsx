import { SettingElement } from './SettingElement'

export interface SettingsCategory {
  id: string
  category: string
  settings: SettingElement[]
}
