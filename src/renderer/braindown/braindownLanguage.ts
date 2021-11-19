import log from '../log'
import * as me from 'monaco-editor'
import { BraindownLanguageExtension } from './braindownLanguageExtension'
import { NewLineExtensionHandler } from './extensions/newLineExtensionHandler'
import { ListExtensionHandler } from './extensions/listExtensionHandler'
import { Monaco } from '@monaco-editor/react'
import { loadContactSuggestions, loadWordSuggestions } from './suggestions'
import { loadCommandSuggestions } from './suggestions/commandSuggestions'
import { store } from '../store'
import { set as setPage } from '../store/storeApp'

class BraindownLanguage {
  languageHandlers: BraindownLanguageExtension[] = []
  editor: me.editor.IStandaloneCodeEditor
  monaco: Monaco
  disposables: me.IDisposable[]

  initialize (editor: me.editor.IStandaloneCodeEditor, monaco: Monaco): void {
    this.languageHandlers.push(new ListExtensionHandler(editor))
    this.languageHandlers.push(new NewLineExtensionHandler(editor))

    // register the language
    monaco.languages.register({ id: 'braindown' })

    // disposables will collect all disposable providers for monaco
    // to clean them up later
    this.disposables = new Array<me.IDisposable>()

    this.editor = editor
    this.monaco = monaco
    this.addKeyBindings()
    this.registerTokenProvider()
    this.registerOnTypeFormattingProviders()
    this.registerCompletionItemProviders()
    this.registerFoldingRangeProvider()
  }

  clear (): void {
    for (const disposable of this.disposables) {
      disposable.dispose()
    }
    this.disposables = new Array<me.IDisposable>()
  }

  registerTokenProvider (): void {
    const provider = this.monaco.languages.setMonarchTokensProvider('braindown', {
      tokenizer: {
        root: [
          [/^# .*/, 'header'],
          [/[\w\d.]+@[\w\d.]+/, 'email'],
          [/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/, 'link'],
          [/@[\w\d]+/, 'user'],
          [/(\[x\])/, 'taskDone'],
          [/(\[ \])/, 'taskOpen'],
          [/\/\/[\w\d-:_;>=+]+\S/, 'keyword'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date']
        ]
      }
    })
    this.disposables.push(provider)
  }

  registerOnTypeFormattingProviders (): void {
    const provider = this.monaco.languages.registerOnTypeFormattingEditProvider('braindown', {
      autoFormatTriggerCharacters: [']'],
      provideOnTypeFormattingEdits: (model, position, ch, options, token) => {
        const t = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        })
        if (t === '[]') {
          return [
            {
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 2,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              },
              text: '[ ] '
            }
          ]
        }
      }
    })
    this.disposables.push(provider)
  }

  registerCompletionItemProviders (): void {
    let provider = this.monaco.languages.registerCompletionItemProvider('braindown', {
      triggerCharacters: ['/'],
      provideCompletionItems: (model, position, context, token) => {
        const t = model.getValueInRange({
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endColumn: position.column
        })

        if (t === '//') {
          return {
            suggestions: loadCommandSuggestions(this.monaco, model, position)
          }
        }
      }
    })
    this.disposables.push(provider)

    provider = this.monaco.languages.registerCompletionItemProvider('braindown', {
      triggerCharacters: ['@'],
      provideCompletionItems: (model, position, context, token) => loadContactSuggestions(this.monaco, '@') // eslint-disable-line
    })
    this.disposables.push(provider)

    provider = this.monaco.languages.registerCompletionItemProvider('braindown', {
      triggerCharacters: 'abcdefghijklmnopqrstuvwxyz'.split(''),
      provideCompletionItems: (model, position, context, token) => {
        const t1 = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        })
        const t4 = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column + 1
        })

        if (t1 !== '[' && (t4 === ' ' || t4 === '')) {
          return loadWordSuggestions(this.monaco)
        } else {
          return {
            suggestions: []
          }
        }
      }
    })
    this.disposables.push(provider)
  }

  registerFoldingRangeProvider (): void {
    const provider = this.monaco.languages.registerFoldingRangeProvider('braindown', {
      provideFoldingRanges: (model, context, token) => {
        const ranges = new Array<any>()
        let start = -1
        const lines = model.getLinesContent()
        const linesCount = lines.length
        lines.forEach((line, i) => {
          if (line.startsWith('#')) {
            if (start >= 0) {
              ranges.push({
                start: start + 1,
                end: i,
                kind: this.monaco.languages.FoldingRangeKind.Region
              })
            }
            start = i
          }
          if (linesCount - 1 === i && start >= 0) {
            ranges.push({
              start: start + 1,
              end: i + 1,
              kind: this.monaco.languages.FoldingRangeKind.Region
            })
          }
        })
        return ranges
      }
    })
    this.disposables.push(provider)
  }

  addKeyBindings (): void {
    this.editor.addCommand(me.KeyCode.Enter, () => {
      for (const handler of this.languageHandlers) {
        if (handler.willHandleEnter()) {
          log.debug(`${handler.constructor.name} will handle the Enter key`)
          handler.handleEnter()
          break
        }
      }
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')

    this.editor.addCommand(me.KeyCode.Tab, () => {
      for (const handler of this.languageHandlers) {
        if (handler.willHandleTab()) {
          log.debug(`${handler.constructor.name} will handle the Tab key`)
          handler.handleTab()
          break
        }
      }
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')

    this.editor.addCommand(me.KeyCode.Escape, () => {
      store.dispatch(setPage('files'))
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
