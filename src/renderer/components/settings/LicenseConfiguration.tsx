import React, { ReactElement, useState, useEffect } from 'react'
import { useAppSelector } from '../../hooks'
import Label from './Label'
import { Description } from './Description'
import Text from './Text'
import Button from '../elements/Button'
import log from '../../log'
import { applyLicense } from '../../services/licenseService'

const LicenseConfiguration: React.FunctionComponent = (): ReactElement => {
  const isPro = useAppSelector(state => state.app.isPro)
  const colors = useAppSelector(state => state.themeNew.colors)
  const settings = useAppSelector(state => state.settings)
  const [licenseKey, setLicenseKey] = useState('')
  const [showLicenseError, setShowLicenseError] = useState(false)

  useEffect(() => {
    const licenseKey = settings['pro.licenseKey']
    setLicenseKey(licenseKey)
  }, [])

  const activateLicense = async (): Promise<void> => {
    log.debug(`about to activate the given license key ${licenseKey}`)
    const result = await applyLicense(licenseKey)

    // pro > result is true
    setShowLicenseError(!result)
  }

  return (
    <>
      <div
        className='flex flex-col gap-3 mb-4 p-2 rounded-lg bg-opacity-60'
        style={{
          backgroundColor: isPro ? 'transparent' : colors.pro.background,
          borderColor: colors.pro.border,
          border: isPro ? '' : '1px solid'
        }}
      >
        <div className='flex flex-row gap-2'>
          <div className='text-lg col-span-2 font-bold'>Pro</div>
          {isPro && <div className='text-sm bg-green-300 border border-green-600 self-center p-0.5 px-1 rounded-lg'>Active</div>}
        </div>
        <div className='text-sm'>
          <Label className=''>License Key</Label>
          <Description className='mb-0.5'>Enter your license key here, and select Activate to enable your Pro license</Description>
        </div>
        <div className='flex flex-row w-full gap-2 text-sm'>
          <Text className='flex-grow' value={licenseKey} onChange={e => setLicenseKey(e.target.value)} />
          <Button onClick={activateLicense}>Activate</Button>
        </div>
        {showLicenseError && <div className='text-red-500 text-sm'>Key could not be validated</div>}
      </div>
    </>
  )
}

export { LicenseConfiguration }
