
interface Positionable {
  line: number
  column: number
}

class CursorPosition implements Positionable {
  line: number
  column: number

  constructor (line: number, column: number) {
    this.line = line
    this.column = column
  }
}

export { CursorPosition }
export type { Positionable }
