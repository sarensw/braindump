require('dotenv').config()
const { notarize } = require('electron-notarize')

exports.default = async function notarizing (context) {
  console.log('Notarizing now')

  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename

  console.log(`appOutDir: ${appOutDir}`)
  console.log(`appName  : ${appName}`)

  return await notarize({
    appBundleId: 'com.featureninjas.braindump',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS
  })
}
