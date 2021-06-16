
class Storage {
  constructor () {
    const electron = window.require('electron')
    this.userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.path = (require('path') || electron.remote.require('path'))
    this.fs = (require('fs') || electron.remote.require('fs'))
  }

  getDocument (fileName) {
    const filePath = this.path.join(this.userDataPath, fileName + '.txt')
    try {
      const text = this.fs.readFileSync(filePath).toString()
      return text
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  saveDocument (fileName, text) {
    const filePath = this.path.join(this.userDataPath, fileName + '.txt')
    try {
      this.fs.writeFileSync(filePath, text)
    } catch (err) {
      console.error(err)
    }
  }
}

// expose the class
export default Storage
