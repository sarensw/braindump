import Monokai from './MonokaiVs.json'
import NordLight from './NordLight.json'
import SolarizedLight from './SolarizedLight.json'
import log from '../log'
import { convertTheme } from './convert'

export function getMonarchTheme (theme) {
  log.debug('converting theme')
  const convertedTheme = convertTheme(theme)
  return convertedTheme
}

export default {
  solarizedlight: SolarizedLight,
  nordlight: NordLight,
  monokai: Monokai
}
