import log from '../log'
import { store } from '../store'
import { readFile } from './fileService'

async function fileShareAs (): Promise<void> {
  const shareFile = store.getState().files.shareFile

  if (shareFile === null) {
    log.error('Cannot share file because shareFile is null')
    return
  }

  log.debug('intent to share the following file')
  log.debug(shareFile)

  // open the dialog to get the path
  const path = await window.__preload.invoke({
    channel: 'share/saveas',
    payload: {
      defaultPath: shareFile?.name
    }
  })

  if (path === undefined || path.canceled === true) {
    // user has cancelled the dialog
    log.debug('user did cancel the save dialog')
    return
  }

  // read the content of the file
  const text = await readFile(shareFile?.path)

  // write the file at the target
  await window.__preload.send({
    channel: 'file/write',
    payload: {
      path: path.filePath,
      text
    }
  })

  log.debug(`shared file ${shareFile.name} to ${String(path)}`)
}

export { fileShareAs }
