import Monokai from './MonokaiVs.json'
import NordLight from './NordLight.json'
import SolarizedLight from './SolarizedLight.json'
import log from '../log'
import { convertTheme } from './convert'

export function getMonarchTheme (theme) {
  log.debug('converting theme')
  const convertedTheme = convertTheme(theme)

  if (convertedTheme.colors['editor.background']) {
    convertedTheme.rules.push({
      background: convertedTheme.colors['editor.background']
    })
  }

  return convertedTheme
}

export default {
  solarizedlight: SolarizedLight,
  nordlight: NordLight,
  monokai: Monokai
}
