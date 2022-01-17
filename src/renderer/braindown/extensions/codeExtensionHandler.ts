import { BraindownLanguageExtension } from '../braindownLanguageExtension'
import * as monaco from 'monaco-editor'

interface IExtendedViewZone {
  viewZoneId: string
  viewZone: monaco.editor.IViewZone
}

/**
 * This is not used at all -> Reuse this code as a template for images, website previews...
 */
export class CodeExtensionHandler extends BraindownLanguageExtension {
  private readonly viewZones: IExtendedViewZone[] = []

  willHandleInput (input: string): boolean {
    return true
  }

  handleInput (input: string): void {
    const line = this.getLine()
    const position = this.editor.getPosition()

    if (position === null) return

    if (line.match(/'''(\w+) ?.*/) !== null) {
      // empty by purpose
    }
  }

  handleInput2 (input: string): void {
    const line = this.getLine()
    const position = this.editor.getPosition()

    if (position === null) return

    if (line.match(/'''(\w+) ?.*/) !== null) {
      for (const viewZone of this.viewZones) {
        if (viewZone.viewZone.afterLineNumber === position.lineNumber) {
          // there is already a viewzone, ignore further processing
          return
        }
      }

      const overlayDom = document.createElement('div')
      overlayDom.classList.add('h-full', 'w-full', 'bg-red-400')
      overlayDom.style.display = 'flex'
      const code = document.createElement('code')
      code.classList.add('h-full', 'w-full', 'bg-yellow-400', 'block')
      code.contentEditable = 'true'
      code.innerHTML = 'console.log("Hello World!)"'
      overlayDom.appendChild(code)

      const overlayWidget = {
        getId: () => 'overlay.zone.widget',
        getDomNode: () => overlayDom,
        getPosition: () => null
      }
      this.editor.addOverlayWidget(overlayWidget)

      // Used only to compute the position.
      const zoneNode = document.createElement('div')
      zoneNode.style.background = '#8effc9'
      zoneNode.id = 'zoneId'

      this.editor.changeViewZones((accessor) => {
        const viewZone: monaco.editor.IViewZone = {
          afterLineNumber: position.lineNumber,
          heightInLines: 1,
          domNode: zoneNode,
          onDomNodeTop: top => { overlayDom.style.top = String(top) + 'px' },
          onComputedHeight: height => { overlayDom.style.height = String(height) + 'px' }
        }
        const viewZoneId = accessor.addZone(viewZone)
        this.viewZones.push({
          viewZone,
          viewZoneId
        })
      })
    } else {
      console.log('not matched')
    }
  }

  willHandleDeletion (): boolean {
    return true
  }

  handleDeletion (): void {
    const line = this.getLine()
    const position = this.editor.getPosition()

    if (position === null) return

    for (let i = 0; i < this.viewZones.length; i++) {
      const viewZone = this.viewZones[i]
      if (viewZone.viewZone.afterLineNumber === position.lineNumber) {
        if (line.match(/'''(\w+) ?.*/) === null) {
          this.editor.changeViewZones((accessor) => {
            accessor.removeZone(viewZone.viewZoneId)
          })
          this.viewZones.splice(i, 1)
          break
        }
      }
    }
  }
}
