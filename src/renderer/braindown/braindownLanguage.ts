import log from '../log'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { BraindownLanguageExtension } from './braindownLanguageExtension'
import { NewLineExtensionHandler } from './extensions/newLineExtensionHandler'
import { ListExtensionHandler } from './extensions/listExtensionHandler'

class BraindownLanguage {
  languageHandlers: BraindownLanguageExtension[] = []
  editor: monaco.editor.IStandaloneCodeEditor

  constructor (editor: monaco.editor.IStandaloneCodeEditor) {
    this.languageHandlers.push(new ListExtensionHandler(editor))
    this.languageHandlers.push(new NewLineExtensionHandler(editor))

    this.editor = editor
    this.addKeyBindings()
  }

  addKeyBindings (): void {
    this.editor.addCommand(monaco.KeyCode.Enter, () => {
      for (const handler of this.languageHandlers) {
        if (handler.willHandleEnter()) {
          log.debug(`${handler.constructor.name} will handle the Enter key`)
          handler.handleEnter()
          break
        }
      }
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')
    this.editor.addCommand(monaco.KeyCode.Tab, () => {
      for (const handler of this.languageHandlers) {
        if (handler.willHandleTab()) {
          log.debug(`${handler.constructor.name} will handle the Tab key`)
          handler.handleTab()
          break
        }
      }
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')
  }

  /**
   * Handles any input by the user based on the bd language specification
   * @param input The current input
   * @param position Current position on the line
   */
  handleInput (input: string): void {
    for (const handler of this.languageHandlers) {
      if (handler.willHandleInput(input)) {
        log.debug(`${handler.constructor.name} will handle the input`)
        handler.handleInput(input)
        break
      }
    }
  }
}

export { BraindownLanguage }
