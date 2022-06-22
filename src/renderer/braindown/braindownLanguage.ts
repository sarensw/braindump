import log from '../log'
import * as me from 'monaco-editor'
import { BraindownLanguageExtension } from './braindownLanguageExtension'
import { NewLineExtensionHandler } from './extensions/newLineExtensionHandler'
import { ListExtensionHandler } from './extensions/listExtensionHandler'
import { Monaco } from '@monaco-editor/react'
import { loadContactSuggestions, loadHashtagSuggestions, loadWordSuggestions } from './suggestions'
import { loadCommandSuggestions } from './suggestions/commandSuggestions'
import { store } from '../store'
import { setActivePage } from '../store/storeApp'
import { saveFile } from '../services/fileService'
import { setPresentationContent } from '../store/storePresentation'

class BraindownLanguage {
  languageHandlers: BraindownLanguageExtension[] = []
  editor: me.editor.IStandaloneCodeEditor
  monaco: Monaco
  disposables: me.IDisposable[]
  oldDecorations: string[]

  initialize (editor: me.editor.IStandaloneCodeEditor, monaco: Monaco, keyHandler: (key: string, ctrlOrCmd: boolean, shift: boolean, alt: boolean) => void): void {
    this.languageHandlers.push(new ListExtensionHandler(editor))
    this.languageHandlers.push(new NewLineExtensionHandler(editor))
    // this.languageHandlers.push(new CodeExtensionHandler(editor))

    // register the language
    monaco.languages.register({ id: 'braindown' })

    // disposables will collect all disposable providers for monaco
    // to clean them up later
    this.disposables = new Array<me.IDisposable>()

    this.editor = editor
    this.monaco = monaco
    this.addKeyBindings(keyHandler)
    this.registerTokenProvider()
    this.registerOnTypeFormattingProviders()
    this.registerCompletionItemProviders()
    this.registerFoldingRangeProvider()
    this.registerCodeLensProvider()
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
          [/^#{1,6} .*/, 'header'],
          [/[\w\d.]+@[\w\d.]+/, 'email'],
          [/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/, 'link'],
          [/@[\w\d]+/, 'user'],
          [/(\[x\])/, 'taskDone'],
          [/(\[ \])/, 'taskOpen'],
          [/\/\/[\w\d-:_;>=+]+\S/, 'keyword'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
          [/(#\w+)/, 'hashtag'],

          // github style code blocks (with backticks and language)
          [/^\s*```\s*((?:\w|[/\-#])+)\s*$/, { token: 'keyword', next: '@codeblockgh', nextEmbedded: '$1' }],

          // github style code blocks (with backticks but no language)
          [/^\s*```\s*$/, { token: 'keyword', next: '@codeblock' }]
        ],

        codeblock: [
          [/^\s*~~~\s*$/, { token: 'keyword', next: '@pop' }],
          [/^\s*```\s*$/, { token: 'keyword', next: '@pop' }],
          [/.*$/, 'keyword']
        ],

        // github style code blocks
        codeblockgh: [
          [/```\s*$/, { token: 'keyword', next: '@pop', nextEmbedded: '@pop' }],
          [/[^`]+/, 'keyword']
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
      triggerCharacters: ['#'],
      provideCompletionItems: _ => loadHashtagSuggestions(this.monaco, '#') // eslint-disable-line
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

        // this array counts the lines for the header levels
        // index 0 is level 0 which contains all lines without a header
        // index 1 is level 1 which are all lines for the first header level... and so on
        const start = [-1, -1, -1, -1, -1, -1, -1]

        const lines = model.getLinesContent()
        const linesCount = lines.length
        lines.forEach((line, i) => {
          if (line.match(/^#{1,6} .*/) !== null) {
            // ## 2nd
            const level = line.indexOf(' ')
            // level = 2
            for (let j = start.length - 1; j >= level; j--) {
              // j = 6
              if (start[j] >= 0) {
                ranges.push({
                  start: start[j] + 1,
                  end: i,
                  kind: this.monaco.languages.FoldingRangeKind.Region
                })
              }
            }
            start[level] = i
          }

          if (linesCount - 1 === i) {
            for (let j = 0; j < start.length; j++) {
              if (start[j] >= 0) {
                ranges.push({
                  start: start[j] + 1,
                  end: i + 1,
                  kind: this.monaco.languages.FoldingRangeKind.Region
                })
              }
            }
          }
        })
        return ranges
      }
    })
    this.disposables.push(provider)
  }

  private registerCodeLensProvider (): void {
    const commandId = this.editor.addCommand(0, (...args: any[]) => {
      console.log('registerCodeLensProvider.commandId')
      if (args.length === 1) return
      const range = args[1]
      console.log(range)
      const content = this.editor.getModel()?.getValueInRange({
        startLineNumber: range.start,
        startColumn: 1,
        endLineNumber: range.endLineNumber,
        endColumn: range.endColumn
      })
      store.dispatch(setPresentationContent(content))
      console.log(content)
      store.dispatch(setActivePage('presentation'))
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')

    const provider = this.monaco.languages.registerCodeLensProvider('braindown', {
      provideCodeLenses: function (model, token) {
        const ranges = new Array<any>()

        let start = -1
        let previousLineLength = 0

        const lines = model.getLinesContent()
        const linesCount = lines.length
        lines.forEach((line, i) => {
          if (line.match(/^#{1,1} .*/) !== null) {
            if (start !== -1) {
              ranges.push({
                range: {
                  startLineNumber: start + 1,
                  startColumn: 1,
                  endLineNumber: start + 2,
                  endColumn: 1
                },
                id: 'editor:presentation:start:' + String(i + 1),
                command: {
                  id: commandId,
                  title: 'ᐅ present',
                  arguments: [
                    {
                      start: start + 1,
                      endLineNumber: i,
                      endColumn: previousLineLength + 1
                    }
                  ]
                }
              })
            }

            start = i
          }
          previousLineLength = line.length

          if (linesCount - 1 === i) {
            if (start >= 0) {
              ranges.push({
                range: {
                  startLineNumber: start + 1,
                  startColumn: 1,
                  endLineNumber: start + 2,
                  endColumn: 1
                },
                id: 'editor:presentation:start:' + String(i + 1),
                command: {
                  id: commandId,
                  title: 'ᐅ present',
                  arguments: [
                    {
                      start: start + 1,
                      endLineNumber: i + 1,
                      endColumn: line.length + 1
                    }
                  ]
                }
              })
            }
          }
        })

        return {
          lenses: [
            ...ranges
          ],
          dispose: () => {}
        }
      },
      resolveCodeLens: function (model, codeLens, token) {
        return codeLens
      }
    })
    this.disposables.push(provider)
  }

  addKeyBindings (keyHandler: (key: string, ctrlOrCmd: boolean, shift: boolean, alt: boolean) => void): void {
    this.editor.addCommand(me.KeyMod.CtrlCmd | me.KeyCode.KeyP, () => {
      keyHandler('p', true, false, false)
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')
    this.editor.addCommand(me.KeyMod.CtrlCmd | me.KeyCode.KeyK, () => {
      keyHandler('k', true, false, false)
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')

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
      saveFile()
      store.dispatch(setActivePage('files'))
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')
    this.editor.addCommand(me.KeyMod.CtrlCmd | me.KeyCode.KeyR, () => {
      keyHandler('r', true, false, false)
    },
    '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode')
  }

  /**
   * Handles any input by the user based on the bd language specification
   * @param input The current input
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

  /**
   * Handles any deleted text from the editor based on the bd specification
   */
  handleDeletion (): void {
    for (const handler of this.languageHandlers) {
      if (handler.willHandleDeletion()) {
        log.debug(`${handler.constructor.name} will handle the deletion`)
        handler.handleDeletion()
        break
      }
    }
  }

  calculateDeltaDecorations (): void {
    console.log('calculateDeltaDecorations')
    const model = this.editor.getModel()

    if (model === null) return

    let codeSectionStart: number = -1
    let codeSectionEnd: number = -1
    let lines: string[] = []

    const decorations: me.editor.IModelDeltaDecoration[] = []

    let i: number = 0
    for (const line of model.getLinesContent()) {
      i++
      if (line.match(/^```$/) !== null) {
        codeSectionEnd = i

        if (codeSectionStart >= 0) {
          decorations.push({
            range: new me.Range(codeSectionStart, 1, codeSectionStart, 1),
            options: {
              isWholeLine: true,
              className: 'codeBlockFirstLine',
              glyphMarginClassName: 'codeBlockFirstLine',
              marginClassName: 'codeBlockFirstLine'
            }
          })
          decorations.push({
            range: new me.Range(codeSectionStart + 1, 1, codeSectionEnd - 1, 1),
            options: {
              isWholeLine: true,
              className: 'codeBlock',
              glyphMarginClassName: 'codeBlock',
              marginClassName: 'codeBlock'
            }
          })
          decorations.push({
            range: new me.Range(codeSectionEnd, 1, codeSectionEnd, 1),
            options: {
              isWholeLine: true,
              className: 'codeBlockLastLine',
              glyphMarginClassName: 'codeBlockLastLine',
              marginClassName: 'codeBlockLastLine'
            }
          })

          lines = []
          codeSectionStart = -1
          codeSectionEnd = -1
        }
      }
      if (codeSectionStart >= 0 && codeSectionEnd < 0) {
        lines.push(line)
      }
      if (line.match(/^```(\w+) ?.*/) !== null) {
        // section start, only process when an and was found
        codeSectionStart = i
      }

      if (line.match(/^>.*/) !== null) {
        decorations.push({
          range: new me.Range(i, 1, i, 20),
          options: {
            isWholeLine: true,
            className: 'blockQuote',
            marginClassName: 'blockQuoteMargin'
          }
        })
      }

      const matches = line.matchAll(/(#\w+)/g)
      for (const match of matches) {
        const start = match.index ?? 0
        const end = start + match[0].length + 1
        if (start == null || length == null) return
        decorations.push({
          range: new me.Range(i, start + 1, i, end),
          options: {
            isWholeLine: false,
            className: 'hashtag'
          }
        })
      }
    }

    this.oldDecorations = model?.deltaDecorations(
      this.oldDecorations,
      decorations
    )
  }
}

export { BraindownLanguage }
