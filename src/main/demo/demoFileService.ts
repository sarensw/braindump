/* eslint-disable no-template-curly-in-string */
import * as electron from 'electron'
import IFileSystem from '../IFileSystem'

let files: any = {
  files: [
    {
      id: '9302cbcb-55e4-4222-aee0-56af0c23524f',
      name: 'First Note',
      path: '/Users/sarensw/Library/Application Support/Electron/dump_1',
      position: {
        line: 0,
        column: 0
      }
    },
    {
      id: '9302cbcb-55e4-4222-aee0-56af0c23524g',
      name: 'Features',
      path: '/Users/sarensw/Library/Application Support/Electron/dump_2',
      position: {
        line: 0,
        column: 0
      }
    },
    {
      id: '9302cbcb-55e4-4222-aee0-56af0c23524i',
      name: 'Features short',
      path: '/Users/sarensw/Library/Application Support/Electron/dump_3',
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
  '/Users/sarensw/Library/Application Support/Electron/dump_1': 'Welcome to Braindump\n',
  '/Users/sarensw/Library/Application Support/Electron/dump_2':
    '# Braindump features\n' +
    '- Minimalistic\n' +
    '- Auto save\n' +
    '- Based on VSCode editor -> well known experience\n' +
    '- Available for Mac, Windows Linux\n' +
    '- Offline\n' +
    '- Start any first level header in presentation mode\n' +
    '\n' +
    '## Markdown inspired\n' +
    '- List formatting\n' +
    '- Links (e.g. https://getbraindump.com)\n' +
    '- Snippets\n' +
    '\n' +
    '```javascript\n' +
    'console.log(\'hello world\')\n' +
    '```\n' +
    '\n' +
    '> block quotes',
  '/Users/sarensw/Library/Application Support/Electron/dump_3':
    '# Braindump features\n' +
    '- Minimalistic, Auto save, Offline, Tasks, Quick snippets\n' +
    '- Start any first level header in presentation mode\n' +
    '- Available for Mac, Windows Linux\n' +
    '- VIM mode (experimental)\n' +
    '\n' +
    '## Markdown inspired\n' +
    '- List formatting\n' +
    '- Links (e.g. https://getbraindump.com)\n' +
    '> block quotes\n' +
    '\n' +
    '```javascript\n' +
    'console.log(\'source code highlight\')\n' +
    '```'
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

export class FileSystem implements IFileSystem {
  private readonly userDataPath: string

  constructor (parameters) {
    this.userDataPath = electron.app.getPath('userData')
  }

  initialize: () => Promise<void>
  size: (path: string) => Promise<number>
  compress: (filePaths: string[], targetPath: string) => Promise<void>
  move: (filePaths: string[], newPath: string) => Promise<number>

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
    if (path.includes('settings.json')) {
      return JSON.stringify({
        'app.path': electron.app.getPath('userData'),
        'app.theme': 'dark',
        'app.hotkeys.show': false,
        'backup.enabled': false,
        'backup.path': '/Users/sarensw/OneDrive/',
        'editor.minimap.show': false,
        'editor.linenumbers.show': true,
        'editor.wordwrap': true,
        'editor.mode': 'vim',
        'tabs.show': false,
        'presentation.title.subTitle': '',
        'pro.licenseKey': '6FB42E21-E09C4924-937ACF0A-80C86FA0'
      })
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
