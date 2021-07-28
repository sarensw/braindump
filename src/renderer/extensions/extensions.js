import extensionTask from './extensionTask'

const extensions = [
  ...extensionTask
]

/**
 * Calls all registered extension to update the text
 *
 * @param {import('monaco-editor/esm/vs/editor/editor.api').editor.IModel} model model holding the current text
 */
function run (text, editor) {
  for (const extension of extensions) {
    const result = extension(text, editor)
    if (result) {
      break
    }
  }
}

export default { run }
