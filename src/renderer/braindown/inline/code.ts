import * as monaco from 'monaco-editor'

interface IExtendedViewZone {
  viewZoneId: string
  viewZone: monaco.editor.IViewZone
}

interface CodeSection {
  startLineNumber: number
  endLineNumber: number
  lines: string[]
  viewZone: IExtendedViewZone
}

class InlineCode {
  private readonly codeSections: CodeSection[]
  private readonly viewZones: IExtendedViewZone[] = []
  private readonly editor: monaco.editor.IStandaloneCodeEditor
  private readonly model: monaco.editor.ITextModel

  constructor (editor: monaco.editor.IStandaloneCodeEditor, model: monaco.editor.ITextModel) {
    this.editor = editor
    this.model = model
  }

  initialize (): void {
    let codeSectionStart: number = -1
    let codeSectionEnd: number = -1
    let lines: string[] = []

    let i: number = 0
    for (const line of this.model.getLinesContent()) {
      i++
      if (line.match(/^'''$/) !== null) {
        codeSectionEnd = i

        if (codeSectionStart >= 0) {
          const domEl = this.createOverlayWidget(lines)
          const viewZone = this.createViewZone(domEl, new monaco.Range(codeSectionStart, 0, codeSectionEnd, 0))

          if (viewZone !== null) {
            this.codeSections.push({
              startLineNumber: codeSectionStart,
              endLineNumber: codeSectionEnd,
              lines,
              viewZone: viewZone
            })
          }

          lines = []
          codeSectionStart = -1
          codeSectionEnd = -1
        }
      }
      if (codeSectionStart >= 0 && codeSectionEnd < 0) {
        lines.push(line)
      }
      if (line.match(/'''(\w+) ?.*/) !== null) {
        // section start, only process when an and was found
        codeSectionStart = i
      }
    }
  }

  createViewZone (overlayDom: HTMLElement, range: monaco.Range): IExtendedViewZone | null {
    // Used only to compute the position.
    const zoneNode = document.createElement('div')
    zoneNode.style.background = '#8effc9'
    zoneNode.id = 'zoneId'

    let result: IExtendedViewZone | null = null

    this.editor.changeViewZones((accessor) => {
      const viewZone: monaco.editor.IViewZone = {
        afterLineNumber: range.startLineNumber,
        heightInLines: 0,
        domNode: zoneNode,
        onDomNodeTop: top => { overlayDom.style.top = String(top) + 'px' }
      }
      const viewZoneId = accessor.addZone(viewZone)
      this.viewZones.push({
        viewZone,
        viewZoneId
      })

      result = {
        viewZone,
        viewZoneId
      }
    })

    return result
  }

  createOverlayWidget (lines: string[]): HTMLElement {
    const overlayDom = document.createElement('div')
    overlayDom.classList.add('w-full', 'bg-red-600')
    overlayDom.style.display = 'flex'
    overlayDom.style.left = '100px'
    const code = document.createElement('code')
    code.classList.add('h-full', 'w-full', 'bg-yellow-600', 'block')
    code.contentEditable = 'true'
    code.style.backgroundColor = '#353c45'
    code.innerHTML = lines.join('\r\n')
    code.style.whiteSpace = 'pre-wrap'
    overlayDom.appendChild(code)

    const overlayWidget = {
      getId: () => 'overlay.zone.widget',
      getDomNode: () => overlayDom,
      getPosition: () => null
    }
    this.editor.addOverlayWidget(overlayWidget)

    return overlayDom
  }
}

export { InlineCode }
