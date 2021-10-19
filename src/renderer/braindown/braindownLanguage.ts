import log from '../log'
import * as monaco from 'monaco-editor'

abstract class BraindownLanguageExtension {
  editor: monaco.editor.IStandaloneCodeEditor

  /**
   * Default constructor
   * @param editor the editor to work on
   */
  constructor (editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor
  }

  /**
   * Returns true in case this extension will handle the key
   */
  willHandleInput (input: string): boolean {
    return false
  }

  /**
   * Will handle the input by the user in the text editor. `willHandleInput` has to return true in order for thie method to be called
   * @param input the text input to handle
   */
  handleInput (input: string): void {

  }

  /**
   * Allows a handler to use the Enter key
   * @returns false, a handler has to override this method to all handling for the special key Enter
   */
  willHandleEnter (): boolean {
    return false
  }

  /**
   * Will handle the enter key in the text editor. `willHandleEnter` has to return true in order for thie method to be called
   */
  handleEnter (): void {

  }

  /**
   * Allows a handler to use the Tab key
   * @returns false, a handler has to override this method to all handling for the special key Tab
   */
  willHandleTab (): boolean {
    return false
  }

  /**
   * Will handle the tab key in the text editor. `willHandleTab` has to return true in order for thie method to be called
   */
  handleTab (): void {

  }

  /**
   * Returns the line of the current cursor position
   * @returns line of the current cursor position
   */
  getLine (): string {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      return model.getLineContent(position.lineNumber)
    }
    return ''
  }

  /**
   * Returns text on the line of the current position, before that position
   * @returns text on the line of the current position, before that position
   */
  getLineBeforeInput (): string {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      const token = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 0,
        endLineNumber: position.lineNumber,
        endColumn: position.column - 1
      })

      return token
    }

    return ''
  }

  getLineAfterInput (): string {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      const token = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: model.getLineLength(position.lineNumber) + 1
      })

      return token
    }

    return ''
  }

  /**
   * Checks whether the text on the same line before the current position tests true agains the given regex
   * @param regex regex
   * @param length Length of the input -> when looking at the text before the input, then for special characters (e.g. Enter) it is zero, but for any other character, it is the length of the input. Otherwise, the input is taken into account, too.
   * @returns true in case the text on the same line before the current position tests true agains the given regex
   */
  testLineBeforeInput (regex: RegExp, length: number): boolean {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      const token = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 0,
        endLineNumber: position.lineNumber,
        endColumn: position.column - length
      })
      log.debug(`testing regex ${regex.toString()} on token [${token}]`)
      log.debug(String(regex.test(token)))

      if (regex.test(token)) {
        return true
      }
    }

    return false
  }

  testLineBeforePosition (regex: RegExp): boolean {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      const token = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 0,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      })
      log.debug(`testing regex ${regex.toString()} on token [${token}]`)
      log.debug(String(regex.test(token)))

      if (regex.test(token)) {
        return true
      }
    }

    return false
  }

  /**
   * Returns the number of characters before a given string
   * @param searchString string to search for in the current line
   * @returns number of characters for the found string
   */
  getLengthUntilFirstOf (searchString: string): number {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      const line = model.getLineContent(position.lineNumber)
      const indexOf = line.indexOf(searchString)
      return indexOf
    }

    return -1
  }

  /**
   * Replaces the existing text with the given text
   * @param offset Offset from where to start the replacement
   * @param text Text to add
   * @param length Length of text to replace
   */
  replace (offset: number, text: string, length: number): void {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      model.pushEditOperations(
        [],
        [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column - 1 + offset,
            endLineNumber: position.lineNumber,
            endColumn: position.column + length
          },
          text
        }],
        () => null)
    }
  }

  /**
   * Adds a new line to the current position. The cursor will start at the column 0.
   */
  newLine (): void {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()
    const eol = model?.getEOL()

    if (model !== null && position !== null && eol !== undefined) {
      // add new line
      model.pushEditOperations(
        [],
        [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: eol
        }],
        () => null)

      // set position to column 0 of next line. all other operations have to start there
      this.editor.setPosition(new monaco.Position(position.lineNumber + 1, 0))
    }
  }

  /**
   * Clears the content of the current line
   */
  clearLine (): void {
    const model = this.editor.getModel()
    const position = this.editor.getPosition()

    if (model !== null && position !== null) {
      this.replace(-position.column, '', model.getLineLength(position.lineNumber))
    }
  }

  /**
   * Sets the new cursor position using delta numbers based on the current position
   * @param deltaLineNumber Delta to current position line number
   * @param deltaColumnNumber Delta to current position line column
   */
  positionDelta (deltaLineNumber: number, deltaColumnNumber: number): void {
    const position = this.editor.getPosition()

    if (position !== null) {
      const newPosition = position.delta(deltaLineNumber, deltaColumnNumber)
      this.editor.setPosition(newPosition)
    }
  }

  /**
   * Sets the new cursor position
   * @param lineNumber Line number
   * @param columnNumber Column number
   */
  positionAbsolute (lineNumber: number, columnNumber: number): void {
    const position = this.editor.getPosition()

    if (position !== null) {
      this.editor.setPosition(new monaco.Position(lineNumber, columnNumber))
    }
  }

  /**
   * Changes only the line number position. Column position stays the same. Absolute values.
   * @param lineNumber Line number
   */
  positionLine (lineNumber: number): void {
    const position = this.editor.getPosition()

    if (position !== null) {
      this.editor.setPosition(new monaco.Position(lineNumber, position.column))
    }
  }

  /**
   * Changes only the column position. Line number position stays the same. Absolute values.
   * @param columnNumber Column number
   */
  positionColumn (columnNumber: number): void {
    const position = this.editor.getPosition()

    if (position !== null) {
      this.editor.setPosition(new monaco.Position(position.lineNumber, columnNumber))
    }
  }
}

class NewLineExtensionHandler extends BraindownLanguageExtension {
  willHandleEnter (): boolean {
    return true
  }

  handleEnter (): void {
    this.newLine()
  }
}

class ListExtensionHandler extends BraindownLanguageExtension {
  willHandleInput (input: string): boolean {
    return input === '-'
  }

  handleInput (input: string): void {
    const lineBeforeInput = this.getLineBeforeInput()
    if (lineBeforeInput === null) return

    if (this.testLineBeforeInput(/^$/, input.length)) {
      this.replace(-1, '- ', '- '.length)
      this.positionDelta(0, 1)
    } else if (this.testLineBeforeInput(/^[ ]*[-]{1} $/, input.length)) {
      this.replace(
        -lineBeforeInput.length - 1,
        ' '.repeat(lineBeforeInput.length) + '- ',
        (' '.repeat(lineBeforeInput.length) + '- ').length)
      this.positionDelta(0, 1)
    }
  }

  willHandleEnter (): boolean {
    if (this.testLineBeforeInput(/^[ ]*[-]{1} .*$/, 0)) return true
    else return false
  }

  willHandleTab (): boolean {
    return this.willHandleEnter()
  }

  handleEnter (): void {
    const gap = this.getLengthUntilFirstOf('-')
    if (this.testLineBeforePosition(/^[-]{1} $/)) {
      this.replace(
        -3,
        '',
        ''.length)
      this.positionDelta(0, 0)
    } else if (this.testLineBeforePosition(/^[ ]+[-]{1} $/)) {
      this.replace(
        -3,
        '- ',
        '- '.length)
      this.positionDelta(0, 0)
    } else {
      const lineSuffix: string = this.getLineAfterInput()
      this.newLine()
      this.clearLine()
      this.replace(
        0,
        ''.padStart(gap) + '- ' + lineSuffix,
        (''.padStart(gap) + '- ').length)
      this.positionColumn((''.padStart(gap) + '- ').length + 1)
    }
  }

  handleTab (): void {
    const line = this.getLine()
    const paddedLine = '  ' + line

    this.replace(
      -line.length,
      paddedLine,
      paddedLine.length
    )
    this.positionDelta(0, 2)
  }
}

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
    '!suggestWidgetVisible')
    this.editor.addCommand(monaco.KeyCode.Tab, () => {
      for (const handler of this.languageHandlers) {
        if (handler.willHandleTab()) {
          log.debug(`${handler.constructor.name} will handle the Tab key`)
          handler.handleTab()
          break
        }
      }
    },
    '!suggestWidgetVisible')
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
