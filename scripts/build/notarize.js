require('dotenv').config()
const { notarize } = require('electron-notarize')

exports.default = async function notarizing (context) {
  console.log('Notarizing now')

  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    console.log('Notarizing not needed for platform ' + electronPlatformName)
    return
  }

  const appName = context.packager.appInfo.productFilename

  console.log(`appOutDir: ${appOutDir}`)
  console.log(`appName  : ${appName}`)

  return await notarize({
    appBundleId: 'app.braindump.Braindump',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS
  })
}
