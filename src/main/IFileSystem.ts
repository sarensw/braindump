interface IFileSystem {
  initialize: () => Promise<void>
  exists: (path: string) => Promise<boolean>
  size: (path: string) => Promise<number>
  read: (path: string) => Promise<string | null>
  write: (path: string, text: string) => Promise<void>
  compress: (filePaths: string[], targetPath: string) => Promise<void>
  move: (filePaths: string[], newPath: string) => Promise<number>
}

export default IFileSystem
