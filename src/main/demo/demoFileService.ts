import * as electron from 'electron'

let files: any = {
  files: [
    {
      id: '9302cbcb-55e4-4222-aee0-56af0c23524f',
      name: '2021',
      path: '/Users/sarensw/Library/Application Support/Electron/dump_1',
      position: {
        line: 0,
        column: 0
      }
    }
  ],
  lastUsed: '9302cbcb-55e4-4222-aee0-56af0c23524f',
  count: 1
}
const contents: any = {
  '/Users/sarensw/Library/Application Support/Electron/dump_1': '2021\n'
}
const snippets: any = [
  {
    name: 'idea',
    description: 'write down a new idea',
    body: 'idea: ${1:plant a tree}\n' +
      '  prereq: ${2:get a seed}\n' +
      '  estimate: ${3:s/m/l}'
  },
  {
    name: 'book',
    description: 'write down a new idea',
    body: 'book: ${1:A brief history of time}\n' +
      '  author: ${2:Stephan Hawking}\n' +
      '  published: ${3:1989}\n' +
      '  pages: ${4:272}\n'
  }
]

export class FileSystem {
  private readonly userDataPath: string

  constructor (parameters) {
    this.userDataPath = electron.app.getPath('userData')
  }

  /**
   * Checks whether the given file actually exists
   * @param path path to the file to check
   * @returns true in case the file exists, false otherwise
   */
  public async exists (path: string): Promise<boolean> {
    return true
  }

  /**
   * Loads the content of a given file
   * @param path path to the file to load
   */
  public async read (path: string): Promise<string | null> {
    if (path.includes('snippets.yaml')) {
      return JSON.stringify(snippets)
    }
    if (path.includes('files.json')) {
      return JSON.stringify(files)
    }
    return contents[path]
  }

  /**
   * Writes the given text into the given file. Existing content is overriden.
   * @param path path to the file to write
   * @param text text to write into the file
   */
  async write (path: string, text: string): Promise<void> {
    if (path.includes('files.json')) {
      files = JSON.parse(text)
    }
    contents[path] = text
  }
}
