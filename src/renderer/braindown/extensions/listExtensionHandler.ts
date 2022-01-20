import { BraindownLanguageExtension } from '../braindownLanguageExtension'

export class ListExtensionHandler extends BraindownLanguageExtension {
  willHandleInput (input: string): boolean {
    return input === '-'
  }

  handleInput (input: string): void {
    const lineBeforeInput = this.getLineBeforeInput()
    if (lineBeforeInput === null) return

    if (this.testLineBeforeInput(/^$/, input.length)) {
      this.replace(-1, '- ', 0)
      this.positionDelta(0, 0)
    } else if (this.testLineBeforeInput(/^[ ]*[-]{1} $/, input.length)) {
      this.replace(
        -lineBeforeInput.length - 1,
        ' '.repeat(lineBeforeInput.length) + '- ',
        0)
      this.positionDelta(0, 0)
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
        0)
      this.positionDelta(0, 0)
    } else {
      const lineSuffix: string = this.getLineAfterInput()
      this.newLine()
      this.clearLine()
      this.replace(
        0,
        ''.padStart(gap) + '- ' + lineSuffix,
        0)
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
