import { BraindownLanguageExtension } from '../braindownLanguageExtension'

export class NewLineExtensionHandler extends BraindownLanguageExtension {
  willHandleEnter (): boolean {
    return true
  }

  handleEnter (): void {
    this.newLine()
  }
}
