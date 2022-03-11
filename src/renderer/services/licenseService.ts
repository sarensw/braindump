import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import log from '../log'
import { store } from '../store'
import { setIsPro } from '../store/storeApp'
import { update as updateSetting } from '../store/storeSettings'
import { saveSettings } from './settingsService'

interface LicenseInformationResult {
  success: boolean
}

async function loadLicense (): Promise<void> {
  const settings = store.getState().settings
  const licenseKey = settings['pro.licenseKey']

  if (licenseKey.length > 0) {
    store.dispatch(setIsPro(true))
  }
}

async function applyLicense (licenseKey: string): Promise<boolean> {
  const result = await checkLicense(licenseKey)

  // set the license key to be used by the rest of the app
  store.dispatch(setIsPro(result))

  if (result) {
    store.dispatch(updateSetting({ id: 'pro.licenseKey', value: licenseKey }))
    await saveSettings()
  }

  return result
}

async function checkLicense (licenseKey: string): Promise<boolean> {
  const data = new FormData()
  data.append('product_permalink', 'bceuq')
  data.append('license_key', licenseKey)

  // ask Gumroad to check the license
  const config: AxiosRequestConfig<any> = {
    method: 'post',
    url: 'https://api.gumroad.com/v2/licenses/verify',
    data,
    validateStatus: (status: number) => {
      return (status >= 200 && status < 300) || status === 404
    }
  }

  // if result.status = true, then the license is valid, false otherwise
  const result: AxiosResponse<LicenseInformationResult> = await axios(config)
  log.debug(result.data.success)

  return result.data.success
}

export { loadLicense, applyLicense, checkLicense }
