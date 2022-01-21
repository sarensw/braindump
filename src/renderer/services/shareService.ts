import { SharedFile } from '../../shared/types'
import log from '../log'
import { store } from '../store'
import { readFile } from './fileService'

function getFileToShare (): SharedFile | null {
  const shareFile = store.getState().files.shareFile

  if (shareFile === null) {
    log.error('Cannot share file because shareFile is null')
    return null
  }

  log.debug('intent to share the following file')
  log.debug(shareFile)

  return shareFile
}

async function fileShareAs (): Promise<void> {
  const shareFile = getFileToShare()
  if (shareFile === null) return

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

async function shareViaEmail (): Promise<void> {
  const shareFile = getFileToShare()
  if (shareFile === null) return

  // read the content of the file
  const text = await readFile(shareFile?.path)
  const encodedText = encodeURIComponent(text)
  const encodedSubject = encodeURIComponent(shareFile.name)

  await window.__preload.send({
    channel: 'share/openExternal',
    payload: {
      url: `mailto:?subject=${encodedSubject}&body=${encodedText}`
    }
  })
}

export { fileShareAs, shareViaEmail }
