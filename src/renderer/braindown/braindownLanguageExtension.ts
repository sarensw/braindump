import log from '../log'
import * as monaco from 'monaco-editor'

export abstract class BraindownLanguageExtension {
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
   * Returns true in case this extension will handle the deletion of a character
   */
  willHandleDeletion (): boolean {
    return false
  }

  /**
   * Will handle the text that was deleted in the editor. `willHandleDeletion` has to return true in order for this method to be called
   */
  handleDeletion (): void {
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
